# GovEase AI Backend ✅ COMPLETE

## Features Implemented:
- **Auth:** JWT stateless (register/login)
**Prisma v6 + PostgreSQL:** Users, GovServices (dynamic), Queries
- **Local HF Transformers:** Text gen (distilgpt2), Whisper Bangla STT ready
- **APIs:**
  | Endpoint | Method | Auth | Description |
  |----------|--------|------|-------------|
  | /api/auth/register | POST | - | Create user, JWT |
  | /api/auth/login | POST | - | Login JWT |
  | /api/govease/services | GET | - | List services |
  | /api/govease/query | POST | JWT | NLP Q&A (text) |
  | /api/govease/form-fill | POST | JWT | AI form fill |
  | /api/govease/locations | GET | - | Mock nearest |
- **Home page:** Docs + setup guide
- **Middleware:** JWT for protected

## Run:
```
cd govease-ai-backend
npm install
cp .env.example .env
# Edit .env: DATABASE_URL (postgres://...), JWT_SECRET
npx prisma generate
npx prisma db push
# Use `npx prisma studio` to add dynamic GovService data
npm run dev
```

Open http://localhost:3000 for docs.
Test APIs: curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"pass123","name":"Test"}'

Models download ~200MB first HF use.

**DB ready, deps ready, APIs ready. GovEase AI backend complete!**

