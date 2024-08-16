import React, { useState, useEffect } from 'react';
import Nav from "../Nav/Nav";
import "./Chat.css";
import { CreateChat } from "../../service/http/Chat";
import width_194 from "./width_194.png";

interface ChatFormData {
  user_input: string;
  conversation_history: string;
}

function Chat() {
  const [conversation, setConversation] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [typing, setTyping] = useState(false); // State to manage typing indicator

  useEffect(() => {
    const chatContainer = document.querySelector(".chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [conversationHistory, aiResponse]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const updatedHistory = [
      ...conversationHistory,
      `${conversation}`
    ];
    setConversationHistory(updatedHistory);
    setConversation("");

    setTyping(true);

    const formData: ChatFormData = {
      user_input: conversation,
      conversation_history: conversationHistory.join("\n"),
    };

    const response = await CreateChat(formData);

    if (response && response.ai_response) {
      simulateTypingEffect(response.ai_response);
    } else {
      console.log("Failed to get AI response");
      setTyping(false);
    }
  };

  const simulateTypingEffect = (fullResponse: string) => {
    let currentText = "";
    const typingInterval = 30; // milliseconds between each character
    const chars = fullResponse.split("");

    const typeChar = (index: number) => {
      if (index < chars.length) {
        currentText += chars[index];
        setAiResponse(currentText);

        if (index === chars.length - 1) {
          setConversationHistory(prevHistory => [
            ...prevHistory,
            `${currentText}`,
          ]);
          setTyping(false);
        }

        setTimeout(() => typeChar(index + 1), typingInterval);
      }
    };

    typeChar(0);
  };

  return (
    <div>
      <Nav />
      <div className="chat-container">
        {conversationHistory.map((msg, index) => (
          <div key={index} className={index % 2 === 0 ? "sendBG" : "respondBG"}>
            {index % 2 !== 0 && (
              <div className="message-flex">
                <div className='flex-in'>
                  <img src={width_194} alt="AI" className="ai-profile-icon" />
                  <h4>BREATHE</h4>
                </div>
                <div>{msg}</div>
              </div>
            )}
            {index % 2 === 0 && (
              <div className="message-flex">
                <div>{msg}</div>
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="message-flex respondBG">
            <div className='flex-in'>
              <img src={width_194} alt="AI" className="ai-profile-icon" />
              <h4>BREATHE</h4>
            </div>
            <div>{aiResponse}</div> {/* AI response typing effect here */}
          </div>
        )}
      </div>
      <div className="textArea">
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="text"
              value={conversation}
              placeholder="Say something:"
              onChange={(e) => setConversation(e.target.value)}
            />
          </label>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
