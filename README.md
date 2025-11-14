# Study Jam - Campus Study Group Finder

A web application where students can post study jam requests and form groups to study together on campus.

## Features

- 🎓 **Post Study Jam Requests** - Create study sessions with details like subject, location, date, and time
- 🔍 **Browse Study Jams** - Filter study jams by campus, subject, and status
- 👥 **Join Study Groups** - Join study jams and form groups with other students
- 📍 **Campus-Based** - Filter study jams by campus location
- 🔐 **Simple Authentication** - Easy email-based login (no password required for MVP)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Data Storage**: JSON files (can be upgraded to a database)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd FSD_project
```

2. Install dependencies:
```bash
npm install
```

3. Create the data directory (if it doesn't exist):
```bash
mkdir -p data
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Login**: Click "Login" in the navbar and enter your email address
2. **Browse Study Jams**: View all available study jams on the homepage
3. **Filter**: Use the filter button to filter by campus, subject, or status
4. **Create Study Jam**: Click "Create Study Jam" to post a new study session
5. **Join Study Jam**: Click "Join" on any study jam card to join the group
6. **Leave Study Jam**: Click "Leave" to leave a study jam you've joined

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── study-jams/   # Study jam CRUD operations
│   ├── create/           # Create study jam page
│   ├── login/            # Login page
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── Navbar.tsx        # Navigation bar
│   ├── StudyJamCard.tsx  # Study jam card component
│   └── StudyJamForm.tsx  # Create study jam form
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication helpers
│   └── data.ts           # Data access layer
├── types/                # TypeScript types
│   └── index.ts          # Type definitions
└── data/                 # Data storage (JSON files)
    ├── study-jams.json   # Study jams data
    └── users.json        # Users data
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Study Jams
- `GET /api/study-jams` - Get all study jams (with optional filters)
- `POST /api/study-jams` - Create a new study jam
- `GET /api/study-jams/[id]` - Get a specific study jam
- `PUT /api/study-jams/[id]` - Update a study jam
- `DELETE /api/study-jams/[id]` - Delete a study jam
- `POST /api/study-jams/[id]/join` - Join a study jam
- `POST /api/study-jams/[id]/leave` - Leave a study jam

## Future Enhancements

- [ ] User profiles with more details
- [ ] Real-time notifications
- [ ] Chat functionality within study groups
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Database integration (PostgreSQL, MongoDB, etc.)
- [ ] Image uploads for study locations
- [ ] Ratings and reviews
- [ ] Study jam reminders
- [ ] Mobile app version

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

