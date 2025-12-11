const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const config = require("./config");
const routes = require("./routes");
const swaggerSpec = require("./config/swagger");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

/**
 * Create and configure Express application
 * @returns {Express.Application}
 */
const createApp = () => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Request logging
  if (config.nodeEnv !== "test") {
    app.use(morgan("dev"));
  }

  // Body parsing middleware
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));

  // Swagger UI documentation
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Shipment API Documentation",
      swaggerOptions: {
        displayOperationId: true,
      },
    })
  );

  // Serve OpenAPI JSON spec
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  // Root endpoint
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to Shipment Management API",
      version: "1.0.0",
      documentation: "/api-docs",
      endpoints: {
        swagger_ui: "/api-docs",
        openapi_json: "/api-docs.json",
        health: "/api/health",
        shipments: "/api/shipments",
      },
    });
  });

  // API routes
  app.use("/api", routes);

  // Handle 404 - Route not found
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
