# GovEase AI 🚀

GovEase AI is a Bangladesh government service assistant built with Next.js 16 App Router. Users can:

- 🔍 **AI Query**: Ask about govt services, get instant AI answers with relevant service matches
- 📝 **Smart Form Fill**: Auto-map basic info to service forms
- 📍 **Nearest Offices**: Find closest offices by GPS with distance calculation
- 🛠️ **Admin Dashboard**: Manage services, offices, and queries

## ✨ Tech Stack

```
Frontend: Next.js 16 (App Router) + Tailwind CSS 4 + React Leaflet
Backend: Prisma + PostgreSQL
Auth: JWT (jose) + bcryptjs
AI: @xenova/transformers (local ML)
Geo: haversine-distance
Other: leaflet, react-dom
```

## 🚀 Quickstart

```bash
# Clone & Install
git clone <repo>
cd govease-ai-backend
npm install

# Database Setup
cp .env.example .env
# Set DATABASE_URL=postgresql://...
npx prisma db push
npx prisma generate

# Run
npm run dev
# Open http://localhost:3000
```

## 🛡️ Authentication

- **JWT Tokens**: Returned on login/register
- **Header**: `x-user-id` (extracted from middleware/lib/auth.js)
- **Roles**: `user` (default), `admin`

## 📚 Database Schema

| Model          | Fields                                                                            | Relations |
| -------------- | --------------------------------------------------------------------------------- | --------- |
| **User**       | `id`, `email`, `password`, `name?`, `role`                                        | `queries` |
| **GovService** | `id`, `name`, `description?`, `steps:Json`, `documents:Json[]`, `formFields:Json` | -         |
| **Query**      | `id`, `userId`, `question`, `answer?`, `audioUrl?`, `serviceName?`                | `user`    |
| **Office**     | `id`, `name`, `address?`, `lat`, `lng`, `services:string[]`                       | -         |

## 🔌 API Reference

| Endpoint                 | Method                | Description         | Auth        | Params                                              | Response                                              |
| ------------------------ | --------------------- | ------------------- | ----------- | --------------------------------------------------- | ----------------------------------------------------- |
| `/api/auth/login`        | `POST`                | Login user          | -           | `{email, password}`                                 | `{token, user{id,email,name,role}}`                   |
| `/api/auth/register`     | `POST`                | Register user       | -           | `{email, password, name?, role?}`                   | `{token, user{id,email,name,role}}`                   |
| `/api/govease/services`  | `GET`                 | List all services   | -           | -                                                   | `[{id,name,description,steps,documents,formFields}]`  |
| `/api/govease/query`     | `POST`                | AI query processing | `x-user-id` | `{question, audio?}`                                | `{answer}` (saves to DB)                              |
| `/api/govease/form-fill` | `POST`                | Fill service form   | `x-user-id` | `{serviceName, basicInfo}`                          | `{success, filledForm}`                               |
| `/api/govease/form-fill` | `GET`                 | User's form fills   | `x-user-id` | `?serviceName=`                                     | `{formFills:[{id,createdAt,serviceName,filledForm}]}` |
| `/api/govease/locations` | `GET`                 | Nearest offices     | -           | `?lat=&lng=`                                        | `[{name,address,services,lat,lng,distance(km)}]`      |
| `/api/admin/services`    | `GET/POST/PUT/DELETE` | CRUD services       | Admin       | `{id?,name,description,steps,documents,formFields}` | Service object                                        |
| `/api/admin/offices`     | `GET/POST/PUT/DELETE` | CRUD offices        | Admin       | `{id?,name,address,lat,lng,services[]}`             | Office object                                         |



│ └── govease/ # Main user pages
├── lib/ # auth.js, prisma.js, transformers.js
├── prisma/ # schema.prisma
├── services/ # auth.js, admin.js, govease.js
└── public/ # Static assets

```

## 🌐 Deployment

- **Vercel**: `vercel --prod` (auto-detects Next.js)
- **Env Vars**: `DATABASE_URL` (Postgres on Neon/Supabase)
- **Prisma**: Run `prisma db push` in production
- **Static Exports**: Not supported (uses API routes)

## 🤝 Contributing

1. Fork & PR
2. Run tests: `npm test` (add later)
3. Update services/offices data via admin panel

## 📄 License

JUST

---

**Built with ❤️ for Bangladesh govt service access**

```
