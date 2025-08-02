import React, { useState, useEffect } from 'react';

const TypingEffect = ({ text, speed = 30, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset when new text is provided
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  return <span>{displayedText}</span>;
};

const TypingRecommendations = ({ recommendations, typingSpeed = 30 }) => {
  const [currentRecommendationIndex, setCurrentRecommendationIndex] = useState(0);
  const [completedRecommendations, setCompletedRecommendations] = useState([]);
  
  const handleRecommendationComplete = () => {
    setCompletedRecommendations(prev => [
      ...prev, 
      recommendations[currentRecommendationIndex]
    ]);
    
    if (currentRecommendationIndex < recommendations.length - 1) {
      setCurrentRecommendationIndex(prev => prev + 1);
    }
  };
  
  return (
    <ul className="list-disc pl-5 space-y-2">
      {completedRecommendations.map((rec, index) => (
        <li key={`completed-${index}`} className="text-gray-800">{rec}</li>
      ))}
      
      {currentRecommendationIndex < recommendations.length -1 && (
        <li className="text-gray-800">
          <TypingEffect 
            text={recommendations[currentRecommendationIndex]} 
            speed={typingSpeed}
            onComplete={handleRecommendationComplete}
          />
        </li>
      )}
    </ul>
  );
};

export default TypingRecommendations;