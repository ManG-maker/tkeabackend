// Prefer the server-level Prisma Client, fallback to root
let PrismaClient;
try {
    // When running from server folder, use local node_modules
    ({ PrismaClient } = require("@prisma/client"));
} catch (e) {
    try {
        // Fallback to root node_modules
        ({ PrismaClient } = require("../../node_modules/@prisma/client"));
    } catch (e2) {
        console.error('Failed to load Prisma from both locations:', e.message, e2.message);
        throw new Error('Could not load @prisma/client. Make sure to run "prisma generate" first.');
    }
}

const prismaClientSingleton = () => {
    // Validate that DATABASE_URL is present
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is required');
    }

    // Parse DATABASE_URL to check SSL configuration
    const databaseUrl = process.env.DATABASE_URL;
    const url = new URL(databaseUrl);
    
    // Log SSL configuration for debugging
    if (process.env.NODE_ENV === "development") {
        console.log(` Database connection: ${url.protocol}//${url.hostname}:${url.port || '3306'}`);
        console.log(`🔒 SSL Mode: ${url.searchParams.get('sslmode') || 'not specified'}`);
    }

    return new PrismaClient({
        // Add logging for debugging
        log: process.env.NODE_ENV === "development" 
            ? ['query', 'info', 'warn', 'error']
            : ['error', 'warn'],
    });
}

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

module.exports = prisma;

if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;