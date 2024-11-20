const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, (err) => {
    if (err) {
      console.log("Database not connected", err);
    } else {
      console.log("Database connected");
    }
  });
};

module.exports = connectDB;
