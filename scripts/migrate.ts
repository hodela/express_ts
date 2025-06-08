import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    // Generate Prisma client
    console.log('📦 Generating Prisma client...');
    await execAsync('npx prisma generate');
    
    // Run migrations
    console.log('🗄️ Running migrations...');
    await execAsync('npx prisma migrate deploy');
    
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations(); 