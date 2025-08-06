# Uhub Installation Guide

This guide provides step-by-step instructions to install and run the Uhub frontend and backend.

## Prerequisites
Before proceeding with the installation, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Recommended: v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (Comes with Node.js)
- [MongoDB](https://www.mongodb.com/) (Ensure MongoDB is running)

---

## Backend Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/AstonV/UHub_SP25
   cd uhub/backend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Create a `.env` file** in the `backend` directory and configure environment variables:
   ```sh
   PORT=your_port
   DB_URL=your_mongodb_connection_string
   DB_NAME=your_database_name
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   ZOOM_ACCOUNT_ID=your_zoom_account_id
   ZOOM_CLIENT_ID=your_zoom_client_id
   ZOOM_CLIENT_SECRET=your_zoom_client_secret
   REDIRECT_URI=your_redirect_uri
   CLIENT_ID=your_google_client_id
   CLIENT_SECRET=your_google_client_secret
   ```

4. **Start the backend server**
   ```sh
   npm start
   ```
   - The server should be running on `http://localhost:5001`
   
   For development mode with automatic restarts, use:
   ```sh
   npm run test
   ```

---

## Frontend Installation

1. **Navigate to the frontend directory**
   ```sh
   cd ../frontend
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Create a `.env` file** in the `frontend` directory and configure environment variables:
   ```sh
   VITE_API_URL=your_backend_url
   GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Start the frontend**
   ```sh
   npm run dev
   ```
   - The frontend should be running on `http://localhost:5174`

---

## Additional Notes

- Ensure MongoDB is running before starting the backend.
- Update the `.env` files with actual credentials before deploying to production.
- Use `npm run build` in the frontend for production builds.
- You may use `pm2` for process management in production environments.

## Demo Link: 
   https://www.youtube.com/watch?v=JPfTKGpJu7U

### SPRING 2025

### Team members: 
- Bryan Vu 016419208
- Thu Nguyen 015065245
- Rommel Aquino 014787604 
- Phat Chau 016878589
