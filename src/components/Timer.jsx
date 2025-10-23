import  { useState, useEffect } from "react";

export default function Timer({counter,trigger}) {
  const [secondsLeft, setSecondsLeft] = useState(counter || 60);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if(trigger) trigger();
      return;
    };

    const timer = setInterval(() => {
      setSecondsLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, trigger]);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
      {secondsLeft > 0 ? formatTime(secondsLeft) : "Time's up!"}
    </div>
  );
}
