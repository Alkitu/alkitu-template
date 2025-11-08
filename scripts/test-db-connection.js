#!/usr/bin/env node

/**
 * MongoDB Atlas Connection Test Script
 *
 * This script tests the MongoDB Atlas connection using credentials from .env file
 * Run with: node scripts/test-db-connection.js
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');

  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found at:', envPath);
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^DATABASE_URL=["']?([^"']+)["']?$/);
      if (match) {
        return match[1];
      }
    }
  }

  console.error('❌ DATABASE_URL not found in .env file');
  process.exit(1);
}

async function testConnection() {
  const uri = loadEnv();

  console.log('🔄 Testing MongoDB Atlas Connection...\n');
  console.log('📍 Cluster:', uri.match(/@([^/]+)/)?.[1] || 'unknown');
  console.log('👤 User:', uri.match(/\/\/([^:]+):/)?.[1] || 'unknown');
  console.log('');

  const client = new MongoClient(uri);

  try {
    // Attempt connection
    console.log('⏳ Connecting...');
    await client.connect();
    console.log('✅ Connection established!\n');

    // Test database access
    const db = client.db();
    console.log('📦 Database:', db.databaseName);

    // Ping the database
    const adminDb = db.admin();
    await adminDb.ping();
    console.log('✅ Ping successful!\n');

    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📚 Collections found:', collections.length);
    if (collections.length > 0) {
      collections.forEach(col => {
        console.log('   -', col.name);
      });
    } else {
      console.log('   (No collections yet - database is empty)');
    }

    console.log('\n✨ MongoDB Atlas connection is working correctly!');
    console.log('\n✅ You can now start your application with: npm run dev');

    return true;

  } catch (error) {
    console.log('\n❌ Connection Failed\n');
    console.log('Error:', error.message);
    console.log('');

    if (error.message.includes('bad auth')) {
      console.log('🔍 Authentication Error Detected');
      console.log('');
      console.log('This error means the username or password is incorrect.');
      console.log('');
      console.log('📋 Please verify in MongoDB Atlas:');
      console.log('   1. Go to https://cloud.mongodb.com');
      console.log('   2. Navigate to "Database Access" (left sidebar)');
      console.log('   3. Verify the database user exists');
      console.log('   4. Check the password is correct');
      console.log('   5. Ensure the user has proper permissions');
      console.log('');
      console.log('🌐 Also check "Network Access":');
      console.log('   1. Navigate to "Network Access" (left sidebar)');
      console.log('   2. Verify your IP is whitelisted');
      console.log('   3. Or add 0.0.0.0/0 for testing (allow all IPs)');
    }

    console.log('\n📖 See MONGODB-CONNECTION-DIAGNOSTICS.md for detailed troubleshooting');

    return false;

  } finally {
    await client.close();
  }
}

// Run the test
testConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
  });
