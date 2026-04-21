import React from 'react';
import './SuggestionBox.css';
import { Lightbulb } from 'lucide-react';

const SuggestionBox = ({ suggestions = [], onSelectSuggestion }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="suggestion-box">
      <div className="suggestion-header">
        <Lightbulb size={18} className="suggestion-icon" />
        <span>Gợi ý câu hỏi</span>
      </div>
      <div className="suggestion-list">
        {suggestions.map((suggestion, index) => (
          <button 
            key={index} 
            className="suggestion-item"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionBox;
