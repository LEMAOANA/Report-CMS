# HOW TO RUN FRONTEND
cd report-
cd luct-report
cd frontend
create .env file and paste "
#REACT_APP_BASE_URL=http://localhost:3000/api
REACT_APP_BASE_URL=https://rcmsb.onrender.com/api
"
npm install
npm start

# HOW TO RUN BACKEND
"Please do these Everytime after pulling up some new changes from get and when running backend"
cd report-
cd luct-report
cd backend
create .env file and paste "
DATABASE_URL=postgresql://neondb_owner:npg_ZkazV0vXKiQ6@ep-long-hall-adu9t852-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=24260f9aa46b1b3ee8c75f432f1934fb3385be5a7a3eb0c397408fa5d22ba8c334c505012518d97b47559a8df78a5021532f8418afd9f2d302b9ed7672372b92
JWT_EXPIRES_IN=7d
PORT=3000
#FRONTEND_URL=https://your-frontend-deployed-url.onrender.com
FRONTEND_URL=http://localhost:3000
"
npm install
npm run server

Case 1: Deployed Backend + Local Frontend
    1️⃣ Backend setup (on hosting platform like Render, Railway, Heroku)
        Deploy your backend.
            Go to environment variables in the hosting platform and add:
            FRONTEND_URL=http://localhost:3000 This tells the backend to accept requests from your local frontend.
            Make sure your server code uses this variable for CORS:
                app.use(cors({
                origin: process.env.FRONTEND_URL,
                credentials: true
                }));

    2️⃣ Frontend setup (on your computer)
        In your frontend project folder, create or edit .env and add:
        REACT_APP_BASE_URL=https://your-backend.com/api This tells your local frontend where to send API requests.
    ✅ Result: Your local frontend can now log in, sign up, and communicate with the deployed backend.

Case 2: Deployed Backend + Deployed Frontend
    1️⃣ Backend setup
        In backend .env on the hosting platform:
        FRONTEND_URL=https://your-frontend.com Make sure CORS in server code uses process.env.FRONTEND_URL.

    2️⃣ Frontend setup
        In frontend .env (for deployed frontend build):
        REACT_APP_BASE_URL=https://your-backend.com/api
    ✅ Result: Deployed frontend communicates with deployed backend.