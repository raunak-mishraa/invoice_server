import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import ConnectDB from "./db";
import router from "./router";
import cookieParser from "cookie-parser";

// Load environment variables from .env file
dotenv.config({
  path: './.env'
});

// Initialize express application
const app = express();

// Ensure the PORT is a number
const PORT = Number(process.env.PORT) || 5000;  // Convert to number if available, otherwise fallback to 5000

// Middleware for parsing the request body
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// Middleware for cookie parsing
app.use(cookieParser());

// CORS setup to allow requests from specific origins
app.use(
  cors({
    origin: ["https://invoice-app-zaid.vercel.app/", "http://localhost:5173"], // Allow specific origins
    credentials: true,
  })
);

// Use custom routes
app.use(router);

try {
  // Attempt to connect to the database
  ConnectDB();

  // Start the server and ensure it's listening on the correct port and interface
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (e: any) {
  // Log an error if the server fails to start
  console.log("Failed to start the server:", e.message);
}
