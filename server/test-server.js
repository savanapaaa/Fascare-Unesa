const Hapi = require('@hapi/hapi');
require('dotenv').config();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || '0.0.0.0'
  });

  server.route({
    method: 'GET',
    path: '/test',
    handler: () => {
      return { message: 'Server is working!', time: new Date().toISOString() };
    }
  });

  try {
    await server.start();
    console.log(`Test server running on ${server.info.uri}`);
    console.log('Port:', server.info.port);
    console.log('Host:', server.info.host);
    
    // Keep server alive
    process.on('SIGINT', async () => {
      console.log('Stopping server...');
      await server.stop();
      process.exit(0);
    });
    
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

init();