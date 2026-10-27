// eslint-disable-next-line react-hooks/exhaustive-deps
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Reminder = ({ tasks }) => {
    const [alarmTask, setAlarmTask] = useState(null);
    const [audioContext, setAudioContext] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        // Create audio context 
        const context = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(context);
        return () => context.close();
    }, []);

    // Function to create beep sound 
    const playBeep = (context) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, context.currentTime);
        oscillator.frequency.setValueAtTime(440, context.currentTime + 0.3);

        gainNode.gain.setValueAtTime(1, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(.001, context.currentTime + 0.3);

        gainNode.gain.setValueAtTime(1, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.6);

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.6);
    };

    // Start alarm beeping 
    const startAlarm = (context) => {
        setIsPlaying(true);
        playBeep(context);
        const id = setInterval(() => {
            playBeep(context);
        }, 1000);
        setIntervalId(id);
    };

    // Stop alarm beeping 
    const stopAlarm = () => {
        setIsPlaying(false);
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            tasks.forEach(task => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
                if (task.reminder && !task.completed) {
                    const reminderTime = new Date(task.reminder).getTime();
                    const currentTime = new Date().getTime();
                    const timeDiff = reminderTime - currentTime;

                    // Trigger alarm when time matches
                    if (timeDiff <= 0 && timeDiff >= -60000) {
                        if (!isPlaying) {
                            setAlarmTask(task);
                            startAlarm(audioContext);
                            toast.warn(`⏰ Alarm: "${task.title}" is due now!`, {
                                position: "top-right",
                                autoClose: false,
                            });
                        }
                    }
                }
            });
        }, 10000);  // Check every 10 seconds

        return () => clearInterval(interval);
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasks, audioContext, isPlaying]);

    // Dismiss alarm 
    const handleDismiss = () => {
        stopAlarm();
        setAlarmTask(null);
    };

    // Snooze alarm for 5 minutes 
    const handleSnooze = () => {
        stopAlarm();
        const snoozedTask = alarmTask;
        setAlarmTask(null);
        toast.info('⏰ Alarm snoozed for 5 minutes!', {
            position: "top-right",
            autoClose: 3000,
        });
        setTimeout(() => {
            setAlarmTask(snoozedTask);
            startAlarm(audioContext);
        }, 5 * 60 * 1000);
    };

    if (!alarmTask) return null;

    return (
        <div className="alarm-overlay">
            <div className="alarm-popup">
                <div className="alarm-icon">⏰</div>
                <h2>Task Reminder!</h2>
                <h3>{alarmTask.title}</h3>
                {alarmTask.description && (
                    <p>{alarmTask.description}</p>
                )}
                <p className="alarm-time">
                    ⌚ {new Date(alarmTask.reminder).toLocaleString()}
                </p>
                <div className="alarm-priority">
                    {alarmTask.priority === 'high' && '🔴 High Priority'}
                    {alarmTask.priority === 'medium' && '🟡 Medium Priority'}
                    {alarmTask.priority === 'low' && '🟢 Low Priority'}
                </div>
                <div className="alarm-buttons">
                    <button
                        className="snooze-btn"
                        onClick={handleSnooze}
                    >
                        😇 Snooze 5 mins 
                    </button>
                    <button
                        className="dismiss-btn"
                        onClick={handleDismiss}
                    >
                       ✅ Dismiss 
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reminder;