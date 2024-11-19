const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Could not connect to MongoDB:', error);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
