# AI Employee Performance Analytics & Recommendation System

A complete MERN stack project for employee registration, performance analytics, rankings, JWT authentication, and AI-powered HR recommendations through OpenRouter.

## Tech Stack

- Frontend: React.js, Vite, Axios, React Router DOM
- Backend: Node.js, Express.js, MVC folder structure
- Database: MongoDB Atlas with Mongoose
- Authentication: JWT and bcryptjs
- AI: OpenRouter OpenAI-compatible chat completions API
- Deployment: Render-ready backend and static frontend

## Project Structure

```txt
ai-employee-performance-analytics/
  backend/
    config/db.js
    controllers/
    middleware/
    models/
    routes/
    utils/
    app.js
    server.js
  frontend/
    src/api/
    src/components/
    src/context/
    src/pages/
    src/styles/
  postman_collection.json
  render.yaml
```

## Local Setup

Install dependencies:

```bash
npm install
npm run install:all
```

Create/update backend environment variables in `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
CLIENT_URL=http://localhost:5173
OPENROUTER_MODEL=openai/gpt-4o-mini
```

Create/update frontend environment variables in `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Run both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## API Routes

Auth:

- `POST /api/auth/signup`
- `POST /api/auth/login`

Employees, protected by JWT:

- `POST /api/employees`
- `GET /api/employees`
- `GET /api/employees/search?department=Engineering&q=React`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

AI, protected by JWT:

- `POST /api/ai/recommend`

Use this header for protected requests:

```txt
Authorization: Bearer <token>
```

## Postman Examples

Import `postman_collection.json` into Postman.

1. Run `Auth - Signup` or `Auth - Login`.
2. Copy the returned `token` into the collection variable named `token`.
3. Run `Employees - Create`.
4. Copy the returned employee `_id` into `employeeId`.
5. Test list, search, update, AI recommendation, and delete requests.

## Render Deployment

This repo includes `render.yaml` for Blueprint deployment.

Backend service:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `CLIENT_URL`

Frontend service:

- Root directory: `frontend`
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://your-backend-service.onrender.com/api`

After the frontend deploys, update backend `CLIENT_URL` to the Render frontend URL and redeploy the backend.

## GitHub Push

```bash
git init
git add .
git commit -m "Build AI employee performance analytics MERN app"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Do not commit real `.env` files. They are ignored by `.gitignore`; use `.env.example` as the template.

## Security Notes

- Rotate any API key or database credential that has been shared in chat or committed accidentally.
- Use a strong production `JWT_SECRET`.
- Add your Render backend URL to the frontend `VITE_API_BASE_URL`.
- Add your Render frontend URL to backend `CLIENT_URL` for CORS.

