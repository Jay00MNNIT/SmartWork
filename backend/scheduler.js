require('dotenv').config();
const cron = require('node-cron');
const webpush = require('web-push');
const Task = require('./models/Task');
const Subscription = require('./models/Subscription');

const startScheduler = () => {
    webpush.setVapidDetails(
    process.env.VAPID_EMAIL,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);
    // Runs every minute 
    cron.schedule('* * * * *', async () => {
        try {
            const dueTasks = await Task.find({
                reminder: { $lte: new Date() },
                completed: false,
                notified: false
            });

            for (const task of dueTasks) {
                const subs = await Subscription.find({ userId: task.userId });

                const payload = JSON.stringify({
                    title: '⏰ SmartWork Reminder',
                    body: task.title 
                });

                for (const sub of subs) {
                    try {
                        await webpush.sendNotification(
                            { endpoint: sub.endpoint, keys: sub.keys },
                            payload
                        );
                    } catch (err) {
                        // Device unscribed, remove it 
                        if (err.statusCode === 404 || err.statusCode === 410) {
                            await Subscription.deleteOne({ _id: sub._id });
                        }
                    }
                }

                task.notified = true;
                await task.save();
            }
        } catch (error) {
            console.error('Scheduler error:', error.message);
        }
    });
    console.log('✅ Reminder scheduler started');
};

module.exports = startScheduler;