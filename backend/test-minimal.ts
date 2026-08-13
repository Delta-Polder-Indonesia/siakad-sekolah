console.log('Starting minimal test...');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());

try {
  console.log('Testing dotenv...');
  const dotenv = await import('dotenv');
  dotenv.config();
  console.log('dotenv loaded');
  
  console.log('Testing env variables...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 20) + '...');
  console.log('PORT:', process.env.PORT);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  console.log('Testing zod...');
  const z = await import('zod');
  console.log('zod loaded');
  
  console.log('Testing express...');
  const express = await import('express');
  console.log('express loaded');
  
  console.log('All basic dependencies loaded successfully!');
} catch (err) {
  console.error('Error:', err);
  process.exit(1);
}