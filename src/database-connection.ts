
import mongoose from 'mongoose';

require('dotenv').config();
const databaseConnection = mongoose.createConnection(process.env.MONGO_URL!);

export default databaseConnection;
    