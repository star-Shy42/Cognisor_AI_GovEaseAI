# GovEase AI 🚀

**AI Platform for Bangladesh Government Services**

## ✨ Features
- **🤖 Natural Language Q&A**: "How to apply birth certificate?" → Steps + docs
- **🎤 Bangla Voice Input**: Speech-to-text with Whisper
- **✨ Smart Form Auto-Fill**: Dynamic fields from DB, AI completes forms
- **📍 Nearest Offices**: Mock geolocation + distance
- **🔐 JWT Auth**: Register/Login stateless
- **👨‍💼 Admin Dashboard**: Manage services, queries
- **Local AI**: HuggingFace Transformers.js (no cloud)

## 🛠 Stack
| Tech | Version | Purpose |
|------|---------|---------|
| Next.js | 14 | Fullstack API + UI |
| Prisma | 6 | PostgreSQL ORM |
| JWT | - | Stateless auth |
| @xenova/transformers | 2.x | Local Whisper/QA |

## 🚀 Setup
```bash
cd govease-ai-backend
npm install
cp .env.example .env
# Edit DATABASE_URL, JWT_SECRET
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
```

**PostgreSQL**: Local `postgresql://user:pass@localhost:5432/govease_ai` or Supabase

## 📱 Test Flow
1. **localhost:3000/register** → Create user
2. **Dashboard**:
   - Ask Q&A
   - Select service → **dynamic form** appears (from DB)
   - Fill basics → AI auto-fills rest
   - Get locations (23.81, 90.41)
3. **/admin** → Add services (name, steps, formFields JSON e.g. `{"child_name":"string","father_name":"string"}`)

## 🔗 APIs
| Endpoint | Method | Auth | Desc |
|----------|--------|------|------|
| `/api/auth/register` | POST | - | {email, password, name} |
| `/api/govease/services` | GET | ✓ | List services |
| `/api/govease/query` | POST | ✓ | {"question": "..."} |
| `/api/govease/form-fill` | POST | ✓ | {"serviceName": "...", "basicInfo":{}} |
| `/api/govease/locations` | GET | - | ?lat=23.81&lng=90.41 |

## 🤖 AI Models
- **QA**: distilbert-squad (question-answer context)
- **STT**: Whisper-small (Bangla)
- Auto-downloads `./models_cache` (~500MB first run)

## 📂 Structure
```
├── app/api/auth/**          # JWT login/register
├── app/api/govease/**       # Core features
├── app/admin/**             # Admin UI
├── app/dashboard/           # User dashboard
├── lib/**                   # Prisma/auth/transformers
├── prisma/**                # Schema + seed (Birth Cert, NID)
├── services/**              # API wrappers
```

## 🐛 Troubleshooting
- **DB**: `npx prisma studio`
- **Models slow**: First run downloads
- **Middleware**: /govease/* protected
- **Deploy**: Vercel (PostgreSQL add-on)

**Made with ❤️ by BLACKBOXAI**

