import React, { useEffect, useState } from "react";
import QuoteCard from "./QuoteCard";
import mathQuotes from "../../../Data/mathQuotes";
import "./Quote.css";

const QuoteSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === mathQuotes.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const currentQuote = mathQuotes[currentIndex];

  return (
    <section className="quote-section">
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <QuoteCard
          quote1={currentQuote.quote1}
          quote2={currentQuote.quote2}
          author={currentQuote.author}
          image={currentQuote.image}
        />
      </div>
    </section>
  );
};

export default QuoteSection;
