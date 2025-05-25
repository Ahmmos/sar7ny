import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

export async function ensureDbConnection() {
    const readyState = mongoose.connection.readyState;

    if (readyState === 0 || readyState === 3) { // Disconnected or Disconnecting
        const connectionString = process.env.DB_URI;
        if (!connectionString) {
            console.error('DB_URI is not defined in your environment variables.');
            throw new Error('DB_URI is not defined in your environment variables.');
        }
        try {
            await mongoose.connect(connectionString);
            console.log('New database connection established.');
        } catch (err) {
            console.error('Error connecting to database:', err);
            throw err; // Re-throw the error after logging
        }
    } else if (readyState === 1) { // Connected
        console.log('Reusing existing database connection.');
    } else if (readyState === 2) { // Connecting
        console.log('Currently connecting, will reuse or establish.');
        // Mongoose's connect method handles ongoing connections appropriately.
        // Calling it again can ensure we wait for completion.
        const connectionString = process.env.DB_URI;
        if (!connectionString) {// This check is important here too, in case the initial attempt didn't have it.
            console.error('DB_URI is not defined in your environment variables.');
            throw new Error('DB_URI is not defined in your environment variables.');
        }
        try {
            await mongoose.connect(connectionString);
            console.log('Connection established/reused after waiting.');
        } catch (err) {
            console.error('Error while waiting for connection:', err);
            throw err; // Re-throw the error
        }
    }
}