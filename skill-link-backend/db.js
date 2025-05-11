import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.DB_URL;
const dbName = process.env.DB_NAME;

mongoose.connect(`${dbUrl}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Database connected successfully');
}).catch((error) => {
    console.error('Database connection error:', error);
});

export default mongoose;