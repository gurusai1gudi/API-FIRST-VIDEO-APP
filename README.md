# API First Video App

An **API-first mobile video application** built using **Flask**, **MongoDB**, and **Expo (React Native)**.  
The backend exposes REST APIs, and the mobile app consumes them securely using JWT authentication.

---

##  Features

- User Signup & Login
- JWT-based Authentication
- Secure API access
- Video dashboard
- YouTube video streaming via backend
- Expo Router based mobile navigation

---

##  Stack

| Layer | Technology |
|------|-----------|
| Backend | Python (Flask) |
| Frontend | Expo (React Native) |
| Database | MongoDB |
| Authentication | JWT |
| API Testing | HTTP Client (`API test.http`) |

---

##  Project Structure

| Path | Description |
|----|------------|
| backend/app.py | Flask API application |
| backend/.env.example | Environment variable template |
| backend/requirements.txt | Backend dependencies |
| backend/API test.http | API testing file |
| frontend/mobile | Expo React Native app |

---

##  Setup Instructions

###  Backend Setup

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
python app.py

Backend will start at:
http://127.0.0.1:5000

Frontend Setup (Mobile App)
cd frontend/mobile
npm install
npx expo start

Run the app using Expo Go or an emulator.




### Example `.env.example`

```env
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
MONGO_URI=mongodb://localhost:27017/api_first_video_app