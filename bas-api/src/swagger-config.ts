// import swaggerAutogen from 'swagger-autogen';
// import path from 'path';

// const outputFile = path.resolve(__dirname, '../src/docs/swagger.json');

// const endpointsFiles = [
//   path.resolve(__dirname, './app.ts'),
//   path.resolve(__dirname, './api/routes/*.ts'),
// ];

// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'My API Documentation',
//       version: '1.0.0',
//       description: 'This is the API documentation for the Node.js app',
//     },
//   },
//   apis: endpointsFiles,
// };

// async function generateSwagger() {
//   await swaggerAutogen(swaggerOptions)(outputFile, endpointsFiles);
//   console.log('Swagger documentation generated at ' + outputFile);
// }

// generateSwagger().catch((err) => {
//   console.error('Error generating Swagger:', err);
// });

// export { outputFile };
