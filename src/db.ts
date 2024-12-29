import mongoose from 'mongoose';
import { dbname} from './constants';

// Connect to MongoDB
const ConnectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DBURI}${dbname}`)
        console.log(`Connected to MongoDB: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("MongoDB connection FAILED",error);
        process.exit(1);
    }
}
export default ConnectDB;