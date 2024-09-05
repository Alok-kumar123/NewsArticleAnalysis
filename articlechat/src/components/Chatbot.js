import React, { useState } from 'react';
import './chatbot.css';
import bot from '../bot.jpg'; // Bot icon image path

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [Urls, setUrls] = useState([]);

  const handleSend = async () => {
    if (inputValue.trim()) {
      // Add the user's message to the chat
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      const ques = inputValue;
      setInputValue('');
      try {
        const msg = await fetch("http://localhost:5000/ask_ques", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            question: ques
          })
        });

        const data = await msg.json();
        console.log(data.response);
        //const resPonse=JSON.stringify(data.response)
        const formattedResponse = data.response.replace(/\n/g, '<br />').replace(/•/g, '<li>')
        .replace(/\*(.*?)\*/g, '<i>$1</i>')
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');  // This replaces **text** with <b>text</b>;
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: formattedResponse, sender: 'bot' , isHtml:true},
        ]);
      } catch (error) {
        console.error('Error', error);
      }
    }
  };

  const handleSendurl = async () => {
    setUrls(inputValue.split(","));
    const uRls = inputValue.split(",").map(url => url.trim()).filter(url => url.length > 0);
    setInputValue('');
    const res = await fetch("http://localhost:5000/process_articles", {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        urls: uRls,
      }),
    });
    console.log(res.json());
    console.log(inputValue);
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {Urls.length > 0 ?
        <div className="chat-container">
          <div className="chat-window">
            <div className="messages-container">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  {message.sender === 'bot' && <img src={bot} alt="Bot" className="bot-icon" />}
                  {message.isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: message.text }} />
                  ) : (
                    message.text
                  )}
                </div>
              ))}
            </div>
            <div className="prompt-container">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </div>
        </div> :
        <>
          <div className='initiator'>
            <h2>Enter URLS to start the ArticleChat</h2>
            <img src={bot} alt='...' />
            <div className="prompt-container">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter Urls separated by comma..."
              />
              <button onClick={handleSendurl}>Send</button>
            </div>
          </div>
        </>
      }
    </>
  );
};

export default Chatbot;
