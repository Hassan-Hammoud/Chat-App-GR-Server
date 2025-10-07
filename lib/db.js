import mongoose from 'mongoose';

// * FUNCTION TO CONNECT TO THE MONGODB DATABASE

export const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('You successfully connected to MongoDB!');
    });
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log('❌ connectDB ~ error:', error.message);
  }
};
