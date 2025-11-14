# Study Jam - Quick Setup Guide

## Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Data Directory** (if it doesn't exist)
   ```bash
   mkdir -p data
   ```
   
   The data directory will be created automatically when you first run the app, but you can create it manually if needed.

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## First Time Usage

1. **Login**: Click "Login" in the navbar
2. **Enter Email**: Use any email address (no password required for MVP)
3. **Create Study Jam**: Click "Create Study Jam" to post your first study session
4. **Browse**: View all available study jams on the homepage
5. **Join**: Click "Join" on any study jam to join the group

## Features to Test

- ✅ User authentication (email-based login)
- ✅ Create study jam requests
- ✅ Browse study jams
- ✅ Filter by campus, subject, and status
- ✅ Join/leave study jams
- ✅ View study jam details
- ✅ Responsive design

## Troubleshooting

### Data Directory Not Created
If you get errors about the data directory:
- Make sure you have write permissions in the project directory
- Create the `data` folder manually: `mkdir data`

### Port Already in Use
If port 3000 is already in use:
- Change the port in `package.json` scripts: `"dev": "next dev -p 3001"`
- Or stop the process using port 3000

### Build Errors
If you encounter build errors:
- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Run `npm run dev`

## Next Steps

- Add more features (chat, notifications, etc.)
- Integrate with a database (PostgreSQL, MongoDB, etc.)
- Add user profiles with more details
- Add image uploads for study locations
- Add calendar integration
- Deploy to production (Vercel, Netlify, etc.)

