# MongoDB Atlas Connection Diagnostics

## Summary
All connection attempts to MongoDB Atlas are failing with authentication error.

## Error Details
- **Error Code**: 8000
- **Error Message**: "bad auth : authentication failed"
- **Error Type**: MongoServerError (SCRAM authentication failure)

## Tests Performed

### 1. Backend Health Check
```bash
curl http://localhost:3001/health
```
**Result**: ✗ Failed - Database unhealthy

### 2. Direct MongoDB Connection Test
Tested with Node.js MongoDB driver directly:
```javascript
mongodb+srv://luiseum95:Martucci.95@alkitu.bfid3.mongodb.net/alkitu
```
**Result**: ✗ Failed - Authentication failed

### 3. Connection String Variations Tested
- ✗ With database name specified
- ✗ Without database name
- ✗ With explicit authSource=admin
- ✗ With URL-encoded password

**All variations failed** with the same authentication error.

## Current Configuration
- **Cluster**: alkitu.bfid3.mongodb.net
- **Database**: alkitu
- **Username**: luiseum95
- **Password**: Martucci.95
- **Connection Type**: MongoDB Atlas (SRV)

## Root Cause Analysis
The authentication failure indicates one of the following issues:

### 1. Database User Configuration (Most Likely)
The database user "luiseum95" either:
- Does not exist in MongoDB Atlas
- Has an incorrect password
- Is not configured for SCRAM authentication

### 2. IP Whitelist Restriction
MongoDB Atlas may be blocking connections from the current IP address.

### 3. User Permissions
The user may exist but lacks permissions for the "alkitu" database.

## Required Actions

### In MongoDB Atlas Console (https://cloud.mongodb.com):

1. **Verify Database User**
   - Navigate to: Database Access (left sidebar)
   - Check if user "luiseum95" exists
   - Verify the password is exactly: Martucci.95
   - Ensure Authentication Method is set to: SCRAM

2. **Check IP Whitelist**
   - Navigate to: Network Access (left sidebar)
   - Verify your current IP is whitelisted
   - OR add 0.0.0.0/0 to allow all IPs (for testing only)

3. **Verify User Permissions**
   - Ensure the user has "Read and write to any database" or at minimum
   - Has specific read/write permissions for the "alkitu" database

4. **Get Connection String**
   - Navigate to: Database → Connect
   - Click "Connect your application"
   - Copy the exact connection string provided
   - Replace <password> with actual password

## Files Modified
- `/.env` - Updated DATABASE_URL
- `/packages/api/.env` - Updated DATABASE_URL
- `/packages/web/.env` - Already has updated DATABASE_URL
- `/package.json` - Added `db:test` script
- `/scripts/test-db-connection.js` - Created connection test utility

## Quick Test Command

A dedicated test script has been created for easy connection testing:

```bash
npm run db:test
```

This script will:
- Load credentials from your `.env` file
- Test the MongoDB Atlas connection
- Provide detailed error messages and troubleshooting steps
- List collections if connection is successful

## Next Steps

1. **Verify Database User in MongoDB Atlas**
   - Go to https://cloud.mongodb.com
   - Navigate to: Database Access
   - Verify user "luiseum95" exists with correct password
   - Ensure SCRAM authentication is enabled

2. **Check Network Access**
   - Navigate to: Network Access
   - Verify your IP is whitelisted or add 0.0.0.0/0 (for testing)

3. **Update Credentials** (if needed)
   - Update `.env` file in project root
   - Update `packages/api/.env` file
   - Update `packages/web/.env` file

4. **Test Connection**
   ```bash
   npm run db:test
   ```

5. **Start Application** (once connection works)
   ```bash
   npm run dev
   ```

## Helpful Commands

- `npm run db:test` - Test MongoDB Atlas connection
- `curl http://localhost:3001/health` - Check backend health (when running)
- `npm run dev:api` - Start backend server
- `npm run dev` - Start full development environment

---
Generated: 2025-11-08
Script Location: `scripts/test-db-connection.js`
