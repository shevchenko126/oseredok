import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

interface IProps {
    startDuration?: number;
    startDate?: Date | number | string;
    isRunning?: boolean;
}
const Timer = ({ startDuration = 0, startDate = 0, isRunning = false }: IProps) => {


  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    const startDateDate = typeof startDate === 'number' || typeof startDate === 'string' ? new Date(startDate + "Z") : startDate;
    const startSeconds = startDate? Math.floor((Date.now() - startDateDate.getTime()) / 1000) + startDuration : startDuration;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          return prev + 1;
        });
      }, 1000);
    }
    setSeconds(startSeconds);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, startDate, startDuration]);

      console.log('Timer props:', { startDuration, startDate, isRunning });
  console.log('Timer seconds:', seconds);

  const formatTime = (totalSeconds: number | null) => {
    const hours = Math.floor((totalSeconds || 0) / 3600);
    const minutes = Math.floor(((totalSeconds || 0) % 3600) / 60);
    const secs = (totalSeconds || 0) % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 40, fontWeight: "bold" }}>{formatTime(seconds)}</Text>
    </View>
  );
};

export default Timer;