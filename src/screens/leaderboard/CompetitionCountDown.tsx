import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'

const CompetitionCountDown = () => {
    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      });
    
      // Function to calculate the remaining time until Sunday at midnight
      const calculateTimeRemaining = () => {
        const now = new Date();
        const day = now.getDay(); // Get the current day of the week
    
        // If it's Sunday, we set the time to tonight at midnight
        const endOfWeek = new Date(now);
        if (day === 0) {
          // If today is Sunday, set the time to midnight tonight
          endOfWeek.setHours(24, 0, 0, 0); // 24 hours means midnight of the next day
        } else {
          // Otherwise, move to next Sunday
          const daysUntilSunday = 7 - day;
          endOfWeek.setDate(now.getDate() + daysUntilSunday); // Move to next Sunday
          endOfWeek.setHours(0, 0, 0, 0); // Set time to midnight
        }
    
        const timeDiff = endOfWeek - now;
    
        if (timeDiff <= 0) {
          return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          };
        }
    
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds };
      };
    
      useEffect(() => {
        const intervalId = setInterval(() => {
          const timeRemaining = calculateTimeRemaining();
          setCountdown(timeRemaining);
        }, 1000);
    
        const initialTimeRemaining = calculateTimeRemaining();
        setCountdown(initialTimeRemaining);
    
        return () => clearInterval(intervalId);
      }, []);
    
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Time Left to Keep Competing</Text>
      <View style={styles.countdown}>
        <Text style={styles.timeText}>{countdown.days}d</Text>
        <Text style={styles.timeText}>{countdown.hours}h</Text>
        <Text style={styles.timeText}>{countdown.minutes}m</Text>
        <Text style={styles.timeText}>{countdown.seconds}s</Text>
      </View>
      <Text style={styles.infoText}>Keep posting and earning likes to secure your place!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#f9f9f9',
      padding: 10,
      borderRadius: 8,
      elevation: 5, // for Android shadow
      shadowColor: '#000', // for iOS shadow
      shadowOpacity: 0.1,
      shadowRadius: 10,
      textAlign: 'center',
      maxWidth: 400,
      margin: 10,
    },
    heading: {
      fontSize: 20,
      textAlign: 'center',
      color: '#333',
      marginBottom: 10,
    },
    countdown: {
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    timeText: {
      marginHorizontal: 10,
      fontSize: 25,
      fontWeight: 'bold',
      color: '#ff5733', // Highlight color (can be any color you want)
    },
    infoText: {
      fontSize: 16,
      color: '#555',
      textAlign: 'center',
    },
  });

export default CompetitionCountDown