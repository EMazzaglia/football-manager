import { Service } from "typedi";
import { CronJob } from "cron";
import { Event } from "../../domain/models/event";
import { Reservation } from "../../domain/models/reservation";
import { NotificationService } from "./notification.service";

@Service()
export class SchedulerService {
    private eventRemindersJob: CronJob;
    private followUpEmailsJob: CronJob;

    constructor(private notificationService: NotificationService) {
        // Run every day at 10:00 AM to send reminders for events happening in 2 days
        this.eventRemindersJob = new CronJob('0 10 * * *', this.sendEventReminders.bind(this));

        // Run every day at 9:00 AM to send follow-up emails for events that happened yesterday
        this.followUpEmailsJob = new CronJob('0 9 * * *', this.sendFollowUpEmails.bind(this));
    }

    start(): void {
        this.eventRemindersJob.start();
        this.followUpEmailsJob.start();
        console.log('Scheduler service started');
    }

    stop(): void {
        this.eventRemindersJob.stop();
        this.followUpEmailsJob.stop();
        console.log('Scheduler service stopped');
    }

    async sendEventReminders(): Promise<void> {
        try {
            // Find events happening in 2 days
            const twoDaysFromNow = new Date();
            twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

            const startOfDay = new Date(twoDaysFromNow);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(twoDaysFromNow);
            endOfDay.setHours(23, 59, 59, 999);

            const upcomingEvents = await Event.find({
                date: { $gte: startOfDay, $lte: endOfDay }
            });

            // For each upcoming event, find reservations and send reminders
            for (const event of upcomingEvents) {
                const reservations = await Reservation.find({
                    eventId: event.eventId,
                    status: { $ne: 'cancelled' }
                });

                // Get unique users who have reservations
                const userIds = [...new Set(reservations.map(r => r.userId))];

                // Send reminder to each user
                for (const userId of userIds) {
                    try {
                        await this.notificationService.sendEventReminder(userId, event.eventId);
                        console.log(`Sent reminder to user ${userId} for event ${event.eventId}`);
                    } catch (error) {
                        console.error(`Failed to send reminder to user ${userId} for event ${event.eventId}:`, error);
                    }
                }
            }
        } catch (error) {
            console.error('Error in sendEventReminders job:', error);
        }
    }

    async sendFollowUpEmails(): Promise<void> {
        try {
            // Find events that happened yesterday
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            const startOfDay = new Date(yesterday);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(yesterday);
            endOfDay.setHours(23, 59, 59, 999);

            const pastEvents = await Event.find({
                date: { $gte: startOfDay, $lte: endOfDay }
            });

            // For each past event, find reservations and send follow-ups
            for (const event of pastEvents) {
                const reservations = await Reservation.find({
                    eventId: event.eventId,
                    status: { $ne: 'cancelled' }
                });

                // Get unique users who had reservations
                const userIds = [...new Set(reservations.map(r => r.userId))];

                // Send follow-up to each user
                for (const userId of userIds) {
                    try {
                        await this.notificationService.sendFollowUpEmail(userId, event.eventId);
                        console.log(`Sent follow-up to user ${userId} for event ${event.eventId}`);
                    } catch (error) {
                        console.error(`Failed to send follow-up to user ${userId} for event ${event.eventId}:`, error);
                    }
                }
            }
        } catch (error) {
            console.error('Error in sendFollowUpEmails job:', error);
        }
    }
}