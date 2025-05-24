import dotenv from 'dotenv';
dotenv.config();

import { connect } from 'mongoose';

const connectionString = process.env.DB_URI;
if (!connectionString) {
    console.error('DB_URL is not defined in your environment variables.');
    process.exit(1); // Optional: stop the process if no DB_URL
}

export const dbConnection = connect(connectionString).then(() => {
    console.log('connected to database successfully');
}).catch((err) => {
    console.log('error in connecting to database', err);
})