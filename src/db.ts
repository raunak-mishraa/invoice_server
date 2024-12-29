import mongoose from 'mongoose';
import { dbname} from './constants';

// Connect to MongoDB
const ConnectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");
        console.log(`${process.env.DBURI}/${dbname}`);
        const connectionInstance = await mongoose.connect(`${process.env.DBURI}/${dbname}`)
        console.log(`Connected to MongoDB: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("MongoDB connection FAILED",error);
        process.exit(1);
    }
}
export default ConnectDB;