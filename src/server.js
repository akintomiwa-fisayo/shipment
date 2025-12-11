require("dotenv").config();

const createApp = require("./app");
const { connectDB } = require("./config/database");
const config = require("./config");

const app = createApp();

/**
 * Start the server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(config.port, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Shipment API Server Started Successfully!             ║
║                                                            ║
║   Environment: ${config.nodeEnv.padEnd(41)}║
║   Port: ${config.port.toString().padEnd(49)}║
║   URL: http://localhost:${config.port.toString().padEnd(33)}║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("UNHANDLED REJECTION! Shutting down...");
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM signal
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        console.log("Process terminated.");
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
