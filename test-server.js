const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

const PORT = 3001;
const server = app.listen(PORT, 'localhost', () => {
  console.log(`Test server running on port ${PORT}`);
});

server.on('error', (error) => {
  console.error('Server error:', error.message);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
