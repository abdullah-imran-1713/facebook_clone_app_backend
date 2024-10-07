import mongoose from 'mongoose';

export default function connectDatabase() {
    mongoose.connect(process.env.DATABASE_CONNECTION_STRING || '')
        .then(() => console.log("MongoDB connected sucessfully!"))
        .catch((error: Error) => console.log(error.message));
}