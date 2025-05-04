import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Event } from '../src/domain/models/event';

// Load environment variables
dotenv.config();

// Define a function to parse event data from CSV
const parseEventData = (line: string, lineNumber: number): any => {
  try {
    // Format from your example: id_odsp,date,country,ht,at,league,price,available_seats
    const parts = line.split(',');
    if (parts.length < 8) {
      console.warn(`Skipping line ${lineNumber}: Insufficient columns (${parts.length})`);
      return null;
    }

    // Clean the ID (remove trailing slash if present)
    const eventId = parts[0].replace(/\/$/, '');
    
    // Parse the date with better error handling
    let date;
    try {
      date = new Date(parts[1]);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn(`Invalid date at line ${lineNumber}: "${parts[1]}". Using current date.`);
        date = new Date(); // Fallback to current date
      }
    } catch (error) {
      console.warn(`Error parsing date at line ${lineNumber}: "${parts[1]}". Using current date.`);
      date = new Date(); // Fallback to current date
    }
    
    // Parse numeric values with error handling
    let price;
    try {
      price = parseInt(parts[6], 10);
      if (isNaN(price)) {
        console.warn(`Invalid stat1 at line ${lineNumber}: "${parts[6]}". Using 0.`);
        price = 0; // Fallback to 0
      }
    } catch (error) {
      console.warn(`Error parsing stat1 at line ${lineNumber}: "${parts[6]}". Using 0.`);
      price = 0; // Fallback to 0
    }
    
    let availableSeats;
    try {
      availableSeats = parseInt(parts[7], 10);
      if (isNaN(availableSeats)) {
        console.warn(`Invalid attendance at line ${lineNumber}: "${parts[7]}". Using 0.`);
        availableSeats = 0; // Fallback to 0
      }
    } catch (error) {
      console.warn(`Error parsing attendance at line ${lineNumber}: "${parts[7]}". Using 0.`);
      availableSeats = 0; // Fallback to 0
    }

    // Create event object with proper field mapping based on your CSV headers
    // Headers: id_odsp,date,country,ht,at,league,price,available_seats
    return {
      eventId,
      date,
      country: parts[2].toLowerCase(),
      homeTeam: parts[3],// 'ht' in CSV
      awayTeam: parts[4],// 'at' in CSV
      league: parts[5],
      price,
      availableSeats// 'available_seats' in CSV
    };
  } catch (error) {
    console.error(`Error parsing line ${lineNumber}: ${line}`);
    console.error(error);
    return null;
  }
};

// Direct MongoDB connection with explicit connection string
async function seedDatabase() {
  try {
    // Use a direct MongoDB connection string rather than environment variable substitution
    const mongoUri = process.env.MONGO_URI || 'mongodb://admin:password@localhost:27017/myapi?authSource=admin';
    
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully');

    // Get the file path from command line arguments
    const filePath = process.argv[2];
    if (!filePath) {
      console.error('Please provide a file path as an argument');
      process.exit(1);
    }

    console.log(`Reading file: ${filePath}`);
    
    // Read and process the CSV file
    const fileContent = fs.readFileSync(path.resolve(filePath), 'utf-8');
    
    // Split the content into lines - handle different line endings
    const lines = fileContent.includes('\r\n') 
      ? fileContent.split('\r\n').filter(line => line.trim().length > 0)
      : fileContent.split('\n').filter(line => line.trim().length > 0);
    
    // Skip the header line
    const dataLines = lines.slice(1);
    
    // Parse each line and filter out invalid entries
    const events = dataLines.map((line, index) => parseEventData(line, index + 2)).filter(event => event !== null);
    
    console.log(`Parsed ${events.length} valid events from ${dataLines.length} data lines`);
    
    if (events.length === 0) {
      console.error('No valid events parsed from the file. Exiting...');
      process.exit(1);
    }

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events from database');

    // Insert events in batches to avoid overwhelming the database
    const batchSize = 100;
    for (let i = 0; i < events.length; i += batchSize) {
      const batch = events.slice(i, i + batchSize);
      await Event.insertMany(batch);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(events.length / batchSize)}`);
    }

    console.log(`Successfully seeded ${events.length} events into the database`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();