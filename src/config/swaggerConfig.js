const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger options
const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Authentication API",
            version: "1.0.0",
            description: "API documentation for the Authentication service"
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Development server"
            }
        ],
        securityDefinitions: {
            BearerAuth: {
                type: "apiKey",
                in: "header",
                name: "Authorization",
                scheme: "bearer",
                description: "Enter your bearer token in the format 'Bearer <token>'"
            }
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        tags: [
            {
                name: "Public",
                description: "Endpoints that do not require authentication"
            },
            {
                name: "Private",
                description: "Endpoints that require authentication"
            }
        ]
    },
    apis: ["./src/routes/*.js", "./src/models/*.js"] 
};

// Initialize Swagger-jsdoc
const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };
