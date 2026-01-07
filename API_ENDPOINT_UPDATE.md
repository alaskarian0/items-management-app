# API Endpoint Configuration Update

## Summary
The frontend application has been successfully updated to use `http://localhost:5000` as the API endpoint URL.

## Files Updated

### 1. `.env.local` ✅
**Location:** `inventory-management-app/.env.local`

**Changes:**
```diff
- NODE_ENV=production
- NEXT_PUBLIC_API_BASE_URL=http://192.168.0.100:8000/
+ NODE_ENV=development
+ NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### 2. `.env.example` ✅
**Location:** `inventory-management-app/.env.example`

**Changes:**
```diff
- # Base URL for API (using Next.js API routes)
- NEXT_PUBLIC_API_BASE_URL=http://localhost:3002/api/
+ # Base URL for Backend API (NestJS API on port 5000)
+ NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

- # File URL for API
- NEXT_PUBLIC_API_FILE_URL=http://localhost:3002/
+ # File URL for API
+ NEXT_PUBLIC_API_FILE_URL=http://localhost:5000
```

### 3. `src/lib/imageUtils.ts` ✅
**Location:** `inventory-management-app/src/lib/imageUtils.ts`

**Changes:**
```diff
- const apiBaseUrl = baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
+ const apiBaseUrl = baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
```

## Configuration Verification

### Axios Client Configuration ✅
**Location:** `inventory-management-app/src/lib/axiosClients.ts`

The axios client is already properly configured to read from the environment variable:
```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
```

Features:
- ✅ Reads from `NEXT_PUBLIC_API_BASE_URL` environment variable
- ✅ Falls back to `http://localhost:5000` if env var is not set
- ✅ Automatically adds authentication token to requests
- ✅ Handles token expiration and redirects to login
- ✅ CORS enabled with credentials

## How It Works

### Environment Variable Priority
1. **Production:** Uses `.env.local` value
2. **Development:** Uses `.env.local` value
3. **Fallback:** Uses hardcoded `http://localhost:5000` in code

### API Endpoints Structure
All API calls will now be made to:
```
Base URL: http://localhost:5000

Examples:
- GET    http://localhost:5000/warehouses
- POST   http://localhost:5000/entry-documents
- GET    http://localhost:5000/item-instance
- POST   http://localhost:5000/item-instance/bulk
- GET    http://localhost:5000/item-master
- PATCH  http://localhost:5000/item-instance/123/status
```

## Next Steps

### 1. Restart the Development Server 🔄

**Important:** You must restart the Next.js development server for the environment variable changes to take effect.

```bash
# Stop the current server (Ctrl+C in the terminal)

# Then restart:
cd inventory-management-app
npm run dev
```

### 2. Ensure Backend API is Running 🚀

Make sure your NestJS backend API is running on port 5000:

```bash
cd inventory-api
npm run start:dev

# Should see:
# [Nest] INFO  Application is running on: http://localhost:5000
```

### 3. Test the Connection 🧪

After restarting both servers, test the API connection:

1. Open the frontend: `http://localhost:3000` (or your Next.js port)
2. Open browser DevTools → Network tab
3. Navigate to any warehouse page
4. Look for API calls to `localhost:5000`
5. Verify successful responses (200 status codes)

### 4. Verify Hooks Integration

Test the new API hooks:

```typescript
// In any component
import { useWarehouses } from '@/hooks/use-warehouses';
import { useItemMasters } from '@/hooks/use-item-masters';
import { useItemInstances } from '@/hooks/use-item-instances';
import { useEntryDocuments } from '@/hooks/use-entry-documents';

// The hooks will automatically call:
// http://localhost:5000/warehouses
// http://localhost:5000/item-master
// http://localhost:5000/item-instance
// http://localhost:5000/entry-documents
```

## Troubleshooting

### Issue: Changes Not Taking Effect

**Solution:** Restart the Next.js development server
```bash
# Ctrl+C to stop
npm run dev  # Start again
```

### Issue: CORS Errors

**Solution:** Ensure your NestJS backend has CORS enabled for `localhost:3000` (or your frontend port)

In `inventory-api/src/main.ts`:
```typescript
app.enableCors({
  origin: 'http://localhost:3000', // Your Next.js port
  credentials: true,
});
```

### Issue: 404 Not Found Errors

**Possible Causes:**
1. Backend API is not running
2. Backend is running on a different port
3. API endpoint paths don't match

**Solution:**
- Verify backend is running: `curl http://localhost:5000`
- Check backend logs for the actual port
- Ensure API routes match between frontend hooks and backend controllers

### Issue: Connection Refused

**Solution:**
1. Check if backend API is running: `netstat -an | findstr :5000`
2. Verify firewall settings
3. Try accessing `http://localhost:5000` directly in browser

### Issue: Authentication Errors (401)

**Solution:**
- The axios client automatically adds auth tokens
- Ensure `tokenManager.getToken()` returns a valid token
- Check `src/lib/tokenManager.ts` implementation
- Verify backend JWT validation

## Production Deployment

When deploying to production, update `.env.local` with your production API URL:

```bash
NODE_ENV=production
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

**Note:** Environment variables prefixed with `NEXT_PUBLIC_` are embedded into the client-side bundle at build time.

## API Health Check

You can verify the API is accessible by visiting:
```
http://localhost:5000
```

Or test a specific endpoint:
```bash
curl http://localhost:5000/warehouses
```

## Summary of Benefits

✅ **Consistent Configuration:** All API calls now use the same base URL
✅ **Environment-Based:** Easy to change for different environments
✅ **Centralized:** Single source of truth for API endpoint
✅ **Type-Safe:** Works with TypeScript hooks
✅ **Production-Ready:** Easy to deploy with different URLs

## Related Documentation

- [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Complete API integration guide
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Implementation overview
- Axios Configuration: `src/lib/axiosClients.ts`
- API Hooks: `src/hooks/use-*.ts`

---

**Configuration Update Completed Successfully! ✅**

Remember to restart your development server for changes to take effect.
