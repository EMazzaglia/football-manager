import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { NotificationService } from '../src/application/services/notification.service';
import { SchedulerService } from '../src/application/services/scheduler.service';
import { User } from '../src/domain/models/user';
import { Event } from '../src/domain/models/event';
import { Reservation } from '../src/domain/models/reservation';
import nodemailer from 'nodemailer';

dotenv.config();

const connectToDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MongoDB connection string could not be determined");
    }

    console.log(`Connecting to MongoDB at ${mongoURI}...`);

    await mongoose.connect(mongoURI, {});
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

// Setup test email and env account with Ethereal
const setupEtherealEmail = async () => {
  const testAccount = await nodemailer.createTestAccount();
  console.log('Ethereal Email account created. Setting environment variables...');

  process.env.SMTP_HOST = 'smtp.ethereal.email';
  process.env.SMTP_PORT = '587';
  process.env.SMTP_SECURE = 'false';
  process.env.SMTP_USER = testAccount.user;
  process.env.SMTP_PASS = testAccount.pass;
  process.env.EMAIL_FROM = 'test@footballapp.com';

  return testAccount;
}

// Create test data
const createTestData = async () => {
  console.log('Cleaning up existing test data...');
  await User.deleteMany({});
  await Event.deleteMany({});
  await Reservation.deleteMany({});

  const testEmail = 'test@example.com';
  // Find or create test user
  console.log('Setting up test user...');
  const user = await User.create({
    userId: `test-user-${Date.now()}`,
    email: testEmail,
    firstName: 'Test',
    lastName: 'User'
  });
  console.log(`Created new test user with ID: ${user.userId}`);

  console.log('Setting up upcoming event in 2 days...');
  const upcomingEventDate = new Date();
  upcomingEventDate.setDate(upcomingEventDate.getDate() + 2);
  const upcomingEvent = await Event.create({
    eventId: 'test-upcoming-event',
    date: upcomingEventDate,
    country: 'Spain',
    homeTeam: 'FC Barcelona',
    awayTeam: 'Real Madrid',
    league: 'La Liga',
    price: 150,
    availableSeats: 1000
  });
  console.log(`Created upcoming event with ID: ${upcomingEvent.eventId}`);

  console.log('Setting up past event (from yesterday)...');
  const pastEventDate = new Date();
  pastEventDate.setDate(pastEventDate.getDate() - 1); // Event yesterday
  const pastEvent = await Event.create({
    eventId: 'test-past-event',
    date: pastEventDate,
    country: 'England',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    league: 'Premier League',
    price: 120,
    availableSeats: 800
  });
  console.log(`Created past event with ID: ${pastEvent.eventId}`);

  console.log('creating reservations...');
  const upcomingReservation = await Reservation.create({
    userId: user.userId,
    eventId: upcomingEvent.eventId,
    spots: 2,
    status: 'confirmed'
  });
  console.log(`Created reservation for upcoming event`);

  const pastReservation = await Reservation.create({
    userId: user.userId,
    eventId: pastEvent.eventId,
    spots: 1,
    status: 'confirmed'
  });
  console.log(`Created reservation for past event`);

  return {
    user,
    upcomingEvent,
    pastEvent,
    upcomingReservation,
    pastReservation
  };
}

/**
 * Test the direct email sending functionality of the NotificationService.
 */
const testDirectEmails = async (notificationService: NotificationService, userId: string, upcomingEventId: string, pastEventId: string) => {
  console.log('Testing event reminder email...');
  try {
    await notificationService.sendEventReminder(userId, upcomingEventId);
    console.log('Reminder email sent successfully!');
  } catch (error) {
    console.error('Failed to send reminder email:', error);
  }

  console.log('Testing follow-up email...');
  try {
    await notificationService.sendFollowUpEmail(userId, pastEventId);
    console.log('Follow-up email sent successfully!');
  } catch (error) {
    console.error('Failed to send follow-up email:', error);
  }
}

/**
 * Test the scheduler service jobs.
 */
const testScheduler = async (schedulerService: SchedulerService): Promise<void> => {
  console.log('Testing scheduler service jobs...');

  console.log('Running sendEventReminders job...');
  try {
    await schedulerService.sendEventReminders();
    console.log('Event reminders job completed successfully!');
  } catch (error) {
    console.error('Failed to run event reminders job:', error);
  }

  console.log('Running sendFollowUpEmails job...');
  try {
    await schedulerService.sendFollowUpEmails();
    console.log('Follow-up emails job completed successfully!');
  } catch (error) {
    console.error('Failed to run follow-up emails job:', error);
  }
}

const main = async () => {
  try {
    // get type of test
    const testType = process.argv[2] || 'both';
    // fake email
    const etherealAccount = await setupEtherealEmail();

    // db (remember to use npm run docker:build and start before.)
    await connectToDatabase();

    // Create test data
    const testData = await createTestData();

    const notificationService = new NotificationService();
    const schedulerService = new SchedulerService(notificationService);

    if (testType === 'direct' || testType === 'both') {
      await testDirectEmails(
        notificationService,
        testData.user.userId,
        testData.upcomingEvent.eventId,
        testData.pastEvent.eventId
      );
    }

    if (testType === 'scheduler' || testType === 'both') {
      await testScheduler(schedulerService);
    }

    console.log('=== Test Complete ===');
    console.log('To view test emails:');
    console.log('1. Go to: https://ethereal.email/login');
    console.log(`2. Login with username: ${etherealAccount.user}`);
    console.log(`3. Password: ${etherealAccount.pass}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

main();