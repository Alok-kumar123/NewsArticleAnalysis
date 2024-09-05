from flask import Flask, request, jsonify
import os
from newspaper import Article
from langchain_core.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder
from langchain.chains import LLMChain
from langchain_core.messages import SystemMessage
from langchain.chains.conversation.memory import ConversationBufferWindowMemory
from langchain_groq import ChatGroq
from transformers import AutoModel, AutoTokenizer
import faiss
import torch
import numpy as np
from sklearn.preprocessing import normalize
from flask_cors import CORS
import requests 
from bs4 import BeautifulSoup
from selenium import webdriver

app=Flask(__name__)
CORS(app)
#Load Transformers for embedding Model
tokenizer=AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
embed_model=AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')

index=None
chunk_text=[]

'''def get_article_text(urls):
    text=""
    for url in urls:
        article=Article(url)
        article.download()
        article.parse()
        text+=article.text
    return text'''
def get_article_text(urls,keywords=None):
    text = ""
    if keywords is None:
        keywords=['linkedin','instagram']
    for url in urls:
        if any(keyword.lower() in url.lower() for keyword in keywords):
            try:
                # Initialize WebDriver (make sure you have the appropriate driver installed, e.g., ChromeDriver)
                driver = webdriver.Chrome()

                # Open LinkedIn page
                driver.get(url)

                # You may need to handle login here manually or programmatically

                # Get page source after JavaScript has rendered content
                page_source = driver.page_source

                # Parse the page with BeautifulSoup
                soup = BeautifulSoup(page_source, 'html.parser')

                # Extract relevant data
                paragraphs = soup.find_all('p')
                article_text = "\n".join([p.get_text() for p in paragraphs])

                driver.quit()
            except requests.exceptions.RequestException as e:
              print(f"Failed to retrieve {url}: {e}")
        else:
            try:
                # Fetch the content from the URL
                response = requests.get(url)
                response.raise_for_status()  # Raise an error for bad responses

                # Parse the content with BeautifulSoup
                soup = BeautifulSoup(response.content, 'html.parser')

                # Extract all text within paragraph tags <p>
                paragraphs = soup.find_all('p')
                article_text = "\n".join([p.get_text() for p in paragraphs])

                # Append the extracted text to the main text variable
                text += article_text

            except requests.exceptions.RequestException as e:
                print(f"Failed to retrieve {url}: {e}")
    
    return text

def text_chunks(text,chunk_size=512,overlap=50):
    words=text.split()
    text_chunk=[]
    for i in range(0,len(words),chunk_size-overlap):
        chunk=" ".join(words[i:i+chunk_size])
        text_chunk.append(chunk)
    return text_chunk

def text_embedder(chunks,model,tokenizer):
    embeddings=[]
    for chunk in chunks:
        inputs=tokenizer(chunk,return_tensors='pt',truncation=True,padding=True)
        with torch.no_grad():
            outputs=model(**inputs).last_hidden_state[:,0,:]
        embeddings.append(outputs.numpy())
    return np.vstack(embeddings)

def vector_db_formation(embeddings):
    dim=embeddings.shape[1]
    index=faiss.IndexFlatL2(dim)
    embeddings=normalize(embeddings,axis=1)
    index.add(embeddings)
    return index

@app.route('/process_articles',methods=['POST'])
def process_articles():
    global index, chunk_text

    data=request.json
    urls=data.get('urls')
    if not urls:
        return jsonify({"error":"No urls Provided"}), 400
    
    #Extract Articles
    text=get_article_text(urls)

    #break into chunks and embed
    chunks=text_chunks(text)
    embeddings=text_embedder(chunks,embed_model,tokenizer)
    embeddings=normalize(embeddings,axis=1)

    #store chunks and create faiss index

    chunk_text=chunks
    index=vector_db_formation(embeddings)

    return jsonify({"messages":"Articles Processed and vector db created successfully."})

#Endpoint to interact with chatbot
@app.route('/ask_ques',methods=['POST'])
def ask_ques():
    global index,chunk_text

    data=request.json
    user_ques=data.get('question')

    if not user_ques:
        return jsonify({"Error":"No question provided"}),400
    
    #Embed the user question
    ques_embed=text_embedder([user_ques],embed_model,tokenizer)
    ques_embed=normalize(ques_embed,axis=1)

    #search for relevant chunks
    D,I=index.search(ques_embed,k=3)
    relevant_chunks=" ".join([chunk_text[i] for i in I[0]])

    #initialize groq_chat
    groq_api_key='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'
    model='llama3-8b-8192'
    groq_chat=ChatGroq(
        groq_api_key=groq_api_key,
        model=model
    )

    system_prompt="You are a friendly Chatbot with info related to news articles"
    conv_memory_length=5
    memory=ConversationBufferWindowMemory(k=conv_memory_length,memory_key="chat_history",return_messages=True)

    prompt=ChatPromptTemplate.from_messages(
        [
            SystemMessage(content=system_prompt),
            MessagesPlaceholder(variable_name="chat_history"),
            HumanMessagePromptTemplate.from_template("{human_input}")
        ]
    )

    conversation=LLMChain(
        llm=groq_chat,
        prompt=prompt,
        verbose=False,
        memory=memory,
    )

    #Get response from Chatbot

    response=conversation.predict(human_input=f"{relevant_chunks}\n\nUser Question: {user_ques}")

    return jsonify({"response": response})

if __name__=='__main__':
    app.run(debug=True,host='0.0.0.0',port=5000)
    
    
