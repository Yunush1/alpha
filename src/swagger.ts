import * as swaggerJsdoc from 'swagger-jsdoc';


const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Alpha Service',
        version: '1.0.0',
        description: 'Alpha service is Smart LMS system',
      },
      servers: [
        {
          url: 'http://localhost:3000',
        },
      ],
    },
    // Path to the API specs
    apis: ['./routes/*.ts'], // Adjust path to your routes
  };

  // Initialize swagger-jsdoc
const swaggerDocs = swaggerJsdoc(swaggerOptions);
export {swaggerDocs}