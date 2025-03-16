import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'

const CompetitionCountDown = ({
    filter
}: { filter: string }) => {
    const [countdown, setCountdown] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Function to calculate the remaining time until Sunday at midnight
    const calculateTimeRemaining = (type: string) => {
        const now = new Date();
        let targetDate: Date = new Date(); // Initialized to now

        if (type === "week") {
            const day = now.getDay(); // 0 (Sunday) to 6 (Saturday)
            // Clone the current date into targetDate
            targetDate = new Date(now.getTime());

            if (day === 0) {
                // If today is Sunday, set the target to 7pm tonight (i.e. start of Monday)
                targetDate.setDate(now.getDate() + 1);
                targetDate.setHours(19, 0, 0, 0);
            } else {
                // Otherwise, set the target to next Sunday at 7pm
                const daysUntilSunday = 7 - day;
                targetDate.setDate(now.getDate() + daysUntilSunday);
                targetDate.setHours(19, 0, 0, 0);
            }
        } else if (type === "month") {
            // For "month", target is the last day of the current month at 7pm.
            // new Date(year, month + 1, 0) gives the last day of the month.
            targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            targetDate.setHours(19, 0, 0, 0);
        }

        const timeDiff = targetDate.getTime() - now.getTime();

        if (timeDiff <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds };
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const timeRemaining = calculateTimeRemaining(filter);
            setCountdown(timeRemaining);
        }, 1000);
        const initialTimeRemaining = calculateTimeRemaining(filter);
        setCountdown(initialTimeRemaining);
        return () => clearInterval(intervalId);
    }, [filter]);

    return (
        <>
            {
                filter !== 'alltime' && (
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
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
        elevation: 5, // for Android shadow
        shadowColor: '#000', // for iOS shadow
        shadowOpacity: 0.2,
        shadowRadius: 10,
        textAlign: 'center',
        maxWidth: 400,
        margin: 10,
        marginBottom: 15
    },
    heading: {
        fontSize: 15,
        textAlign: 'center',
        color: '#333',
        marginBottom: 5,
    },
    countdown: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    timeText: {
        marginHorizontal: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ff5733',
    },
    infoText: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
    },
});

export default CompetitionCountDown