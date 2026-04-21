import React from "react";
import Header from "../Components/Chatbot/Header/Header";
import ChatbotLayout from "../Components/Chatbot/Layout/ChatbotLayout";
import "./Chatbot.css";

const Chatbot = () => {
  return (
    <div className="chatbot-page">
      <Header />
      <div className="chatbot-content">
        <ChatbotLayout />
      </div>
    </div>
  );
};

export default Chatbot;
