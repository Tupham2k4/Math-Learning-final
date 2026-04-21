import React from "react";

const QuoteCard = ({ quote1, quote2, author, image }) => {
  return (
    <div className="quote-card fade-in">
      <div className="quote-card-left">
        <img src={image} alt={author}></img>
      </div>
      <div className="quote-card-right">
        <h1 className="quote-title">{quote1}</h1>
        <p className="quote-text">"{quote2}"</p>
        <span className="quote-author">"{author}"</span>
      </div>
    </div>
  );
};

export default QuoteCard;
