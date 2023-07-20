import { Express, Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { log } from "console";
import path from "path";

const options: swaggerJSDoc.Options = {
    definition: {
        failOnErrors: true,
        openapi: "3.0.0",
        info: {
            title: "NodeJS and RabbitMQ Application",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000/",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        path.join(__dirname, '../routes/*.js'),
        path.join(__dirname, '../schemas/*.js'),
    ],
};

const swaggerSpec = swaggerJSDoc(options);
function swaggerDocs(app: Express, port: number) {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get("/docs.json", (req: Request, res: Response) => {
        res.setHeader("Content_Type", "application/json")
        res.send(swaggerSpec)
    })
    log(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;