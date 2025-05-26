import { AppDataSource } from "./data-source"
import * as express from 'express'
import { Express } from 'express';
import * as swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './swagger'
import { router } from "./routes/routes";
import { ApolloServer } from '@apollo/server';
import { createSchema } from "./graphql/schema";
import "reflect-metadata";
import * as cors from 'cors';
import { json } from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';

async function startApolloServer(app: Express) {
    // Initialize TypeORM
    await AppDataSource.initialize();
    console.log("Database connection initialized");

    // Create Apollo Server
    const schema = await createSchema();
    const server = new ApolloServer({
        schema,
        formatError: (error) => {
            console.error('GraphQL Error:', error);
            return error;
        }
    });

    // Start the server
    await server.start();

    // Apply middleware
    app.use(
        '/graphql',
        cors(),
        json(),
        expressMiddleware(server, {
            context: async ({ req, res }) => ({ req, res })
        })
    );
}

async function startApp() {
    const app = express();
    
    // Basic middleware
    app.use(cors());
    app.use(json());
    app.use(express.urlencoded({ extended: true }));

    // Initialize Apollo Server
    await startApolloServer(app);

    // REST API routes
    app.use('/server', router);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

    // Error handling middleware
    app.use((err, req, res, next) => {
        res.status(500).send('Something broke!');
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`GraphQL Playground available at http://localhost:${PORT}/graphql`);
        console.log(`Swagger UI is available at http://localhost:${PORT}/api-docs`);
    });
}

startApp().catch(error => console.log(error));
