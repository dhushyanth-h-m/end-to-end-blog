# Blogify Application

A fullstack blog application built with React, TypeScript, and Node.js.

## Project Structure

- `/frontend` - React frontend application
- `/backend` - Express.js API server

## Getting Started

### Setup Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend server will run on http://localhost:5000

### Setup Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend application will run on http://localhost:5173

## Connecting Frontend to Backend

The frontend is configured to connect to the backend at `http://localhost:3000/api`. If your backend is running on a different URL, update the `API_BASE_URL` in `frontend/src/services/api.ts`.

## Features

- User authentication (login/register)
- Blog post creation and management
- Like and bookmark posts
- User profiles
- Search functionality
- Real-time notifications
- Responsive design

## Data Flow

1. The frontend uses React hooks (useState, useEffect) to manage component state
2. API requests are made to the backend using the fetch API
3. Data is fetched from the API and stored in component state
4. The UI is updated to reflect the data from the backend
5. User interactions (likes, bookmarks, etc.) are sent to the backend to be persisted

## Loading States and Error Handling

- The application uses skeleton loading states to improve user experience during data fetching
- Error states are captured and displayed to the user when API requests fail
- Optimistic updates are used for actions like liking and bookmarking to make the UI feel responsive

## Mock Data vs. Real Data

- The backend provides mock data that simulates a real database
- In a production environment, you would replace the mock data with real database queries
- The API structure remains the same, so the frontend doesn't need to change when switching to a real database

## License

MIT 