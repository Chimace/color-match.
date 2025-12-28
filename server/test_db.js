require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        const count = await prisma.user.count();
        console.log(`Successfully connected. User count: ${count}`);

        // Try to create a dummy user to check for constraints/errors
        // We won't actually commit if we just want to test connection, but let's try reading.
        const users = await prisma.user.findMany({ take: 1 });
        console.log('Users found:', users);

    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
