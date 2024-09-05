import React from 'react';
import './about.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>About ArticleChat</h1>
      <p>
        <strong>ArticleChat</strong> is an intelligent chatbot interface that allows users to extract and interact with content from news articles and web pages. It integrates advanced NLP models, like the <strong>sentence-transformers model</strong>, and leverages a <strong>FAISS-based vector search</strong> to retrieve and provide relevant information from the processed content. 
      </p>
      <p>
        Users can provide a list of URLs for articles they want to analyze, and the system will fetch, process, and store these articles in a vector database. The chatbot is designed to answer questions related to the content of the articles by retrieving relevant information using <strong>embedding-based similarity searches</strong>. This makes the chatbot capable of handling complex inquiries and returning accurate and context-aware responses.
      </p>
      <p>
        Powered by <strong>GroqChat LLM</strong>, the chatbot offers a natural language conversation interface, ensuring smooth and friendly communication. The interface is developed using <strong>React</strong> and enables real-time interaction with the chatbot, including user-friendly formatting of responses and a seamless user experience.
      </p>
      <p>
        This project aims to demonstrate the integration of cutting-edge NLP technologies with a functional chatbot UI to provide users with insights and information extracted from online content. Whether for research, content summarization, or casual information retrieval, ArticleChat simplifies and enhances your interaction with web-based information.
      </p>
    </div>
  );
};

export default About;
