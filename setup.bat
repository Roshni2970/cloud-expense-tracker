@echo off
echo Installing dependencies...
npm install

echo Generating Prisma Client...
npx prisma generate

echo Pushing DB schema...
npx prisma db push

echo Seeding Database...
npm run db:seed

echo Setup Complete! Run "npm run dev" to start the application.
pause
