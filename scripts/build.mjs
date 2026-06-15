import { execSync } from 'node:child_process';

const hasDatabase = Boolean(process.env.DATABASE_URL);

if (hasDatabase) {
  console.log('Running Prisma migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
} else {
  console.log('DATABASE_URL not set — skipping Prisma migrations.');
}

console.log('Building Next.js app...');
execSync('next build', { stdio: 'inherit' });
