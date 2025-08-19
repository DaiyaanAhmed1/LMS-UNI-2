import React from 'react';

// Typewriter effect utility for Sage AI summary
export const useTypewriterEffect = (text, speed = 30) => {
  const [displayedText, setDisplayedText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  React.useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    setDisplayedText('');

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, speed);

    return () => {
      clearInterval(interval);
      setIsTyping(false);
    };
  }, [text, speed]);

  return { displayedText, isTyping };
};

// Alternative implementation using a custom hook for better control
export const useTypewriter = (text, options = {}) => {
  const {
    speed = 30,
    delay = 0,
    onComplete = () => {},
    autoStart = true
  } = options;

  const [displayedText, setDisplayedText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);

  const startTyping = React.useCallback(() => {
    if (!text) return;

    setIsTyping(true);
    setIsComplete(false);
    setDisplayedText('');

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        setIsComplete(true);
        onComplete();
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  const reset = React.useCallback(() => {
    setDisplayedText('');
    setIsTyping(false);
    setIsComplete(false);
  }, []);

  React.useEffect(() => {
    if (autoStart && text && !isTyping && !isComplete) {
      const timeout = setTimeout(() => {
        startTyping();
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [text, autoStart, delay, startTyping, isTyping, isComplete]);

  return {
    displayedText,
    isTyping,
    isComplete,
    startTyping,
    reset
  };
};
