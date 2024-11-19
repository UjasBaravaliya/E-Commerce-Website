const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Handling uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to uncaught exception`);
  process.exit(1);
})



// Config
dotenv.config({ path: "config.env" });

// Connect to the database
connectDB();

// Start the server on the specified PORT
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});


// Unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to Unhandled promise rejection`);

  server.close(() => {
    process.exit(1);
  })
})