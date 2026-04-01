// Simple script to run the TypeScript seed file
const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('Running database seed script...');
  
  // Execute the TypeScript file using ts-node
  execSync('npx ts-node src/scripts/seedDatabase.ts', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../..')
  });
  
  console.log('Seed script completed successfully!');
} catch (error) {
  console.error('Error running seed script:', error);
  process.exit(1);
}