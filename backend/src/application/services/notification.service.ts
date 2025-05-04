import { Service } from "typedi";
import { User } from "../../domain/models/user";
import { Event } from "../../domain/models/event";
import { Reservation } from "../../domain/models/reservation";
import { NotFoundException } from "../../api/exceptions/httpExceptions";
import nodemailer from "nodemailer";

@Service()
export class NotificationService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendEventReminder(userId: string, eventId: string): Promise<void> {
        const user = await User.findOne({ userId });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const event = await Event.findOne({ eventId });
        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found`);
        }

        // Get reservation if exists
        const reservation = await Reservation.findOne({ userId, eventId });

        // Construct email
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: `Reminder: ${event.homeTeam} vs ${event.awayTeam} in 2 days`,
            html: `
        <h1>Your upcoming match reminder</h1>
        <p>Hello ${user.firstName},</p>
        <p>We're reminding you that the match between <strong>${event.homeTeam}</strong> and <strong>${event.awayTeam}</strong> is coming up in 2 days.</p>
        ${reservation ? `<p>You have reserved ${reservation.spots} spot(s) for this event.</p>` : ''}
        <p>Date: ${event.date.toLocaleDateString()}</p>
        <p>Country: ${event.country}</p>
        <p>League: ${event.league}</p>
        <p>We look forward to seeing you there!</p>
        <p>The Football App Team</p>
      `
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendFollowUpEmail(userId: string, eventId: string): Promise<void> {
        const user = await User.findOne({ userId });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        const event = await Event.findOne({ eventId });
        if (!event) {
            throw new NotFoundException(`Event with ID ${eventId} not found`);
        }

        // Get reservation if exists
        const reservation = await Reservation.findOne({ userId, eventId });

        // Construct email
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@footballapp.com',
            to: user.email,
            subject: `How was the match? ${event.homeTeam} vs ${event.awayTeam}`,
            html: `
        <h1>Thanks for attending!</h1>
        <p>Hello ${user.firstName},</p>
        <p>We hope you enjoyed the match between <strong>${event.homeTeam}</strong> and <strong>${event.awayTeam}</strong>.</p>
        ${reservation ? `<p>Thank you for reserving with us.</p>` : ''}
        <p>We'd love to hear your feedback about the event and your experience. Please reply to this email with any comments.</p>
        <p>Looking forward to seeing you at future events!</p>
        <p>The Football App Team</p>
      `
        };

        await this.transporter.sendMail(mailOptions);
    }
}