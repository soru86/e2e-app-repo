# reCAPTCHA Contact Form App

A full-stack application built with Express.js, React, and SQLite, featuring a contact form with Google reCAPTCHA integration.

## Features

- **5-Field Contact Form**: Name, Email, Phone, Country, and Message
- **Google reCAPTCHA v3 Integration**: Invisible bot protection using Google's reCAPTCHA v3 with score-based verification
- **SQLite Database**: Lightweight database for storing form submissions
- **Seed Data**: Pre-populated sample data for testing
- **RESTful API**: Express.js backend with proper error handling
- **Modern UI**: Responsive React frontend with beautiful styling

## Tech Stack

- **Backend**: Express.js, SQLite3, Node.js
- **Frontend**: React, Axios, Google reCAPTCHA v3 API
- **Database**: SQLite

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google reCAPTCHA API keys (optional for development - test keys are included)

## Setup Instructions

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

### 2. Configure Environment Variables

#### Backend (.env file in root directory)

Create a `.env` file in the root directory:

```env
PORT=5001
RECAPTCHA_SITE_KEY=your_recaptcha_v3_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_v3_secret_key_here
RECAPTCHA_MIN_SCORE=0.5
RECAPTCHA_EXPECTED_ACTION=submit
```

**Note**: `RECAPTCHA_MIN_SCORE` (optional, default: 0.5) - Minimum score threshold (0.0 to 1.0). Higher scores indicate more legitimate users.
`RECAPTCHA_EXPECTED_ACTION` (optional, default: `submit`) - Expected action string returned by reCAPTCHA.

#### Frontend (.env file in client directory)

Create a `.env` file in the `client` directory:

```env
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

**Note**: For development and testing, the app includes Google's test reCAPTCHA v3 keys by default. These will always pass verification but won't work in production.

To get your own reCAPTCHA v3 keys:
1. Visit [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Register a new site
3. Choose **reCAPTCHA v3** (not v2)
4. Add your domain (e.g., `localhost` for development)
5. Copy the Site Key and Secret Key to your `.env` files

**reCAPTCHA v3 Features:**
- **Invisible**: No checkbox - runs automatically in the background
- **Score-based**: Returns a score (0.0 to 1.0) indicating how likely the user is legitimate
- **Better UX**: No user interaction required
- **Action-based**: Can track different actions (e.g., 'submit', 'login')

### 3. Run the Application

#### Development Mode (runs both server and client)

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- React development server on `http://localhost:3000`

#### Run Separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## API Endpoints

### POST `/api/submit`
Submit a contact form with reCAPTCHA verification.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "Hello, this is a test message",
  "country": "United States",
  "recaptchaToken": "recaptcha_token_here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Form submitted successfully",
  "id": 1
}
```

### GET `/api/submissions`
Get all form submissions (for testing/admin purposes).

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "message": "Hello",
    "country": "United States",
    "created_at": "2024-01-01 12:00:00"
  }
]
```

### GET `/api/health`
Health check endpoint.

## Database

The SQLite database (`server/database.sqlite`) is automatically created on first run. It includes:

- **submissions table**: Stores all form submissions
- **Seed data**: 3 sample submissions for testing

## Project Structure

```
recaptch-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ContactForm.js
│   │   │   └── ContactForm.css
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
├── server/                 # Express backend
│   ├── index.js            # Main server file
│   └── database.sqlite     # SQLite database (auto-generated)
├── package.json
├── .env                    # Backend environment variables
└── README.md
```

## Form Fields

The contact form includes the following 5 required fields:

1. **Name**: Full name of the user
2. **Email**: Email address
3. **Phone**: Phone number
4. **Country**: Country name
5. **Message**: Text message/comment

## Testing

The application includes seed data that is automatically inserted when the database is first created. You can view all submissions by visiting:

```
GET http://localhost:5000/api/submissions
```

## Troubleshooting

### Port 5000 already in use (EADDRINUSE)

If you see an error like `Error: listen EADDRINUSE: address already in use :::5000`:

**Option 1: Stop the existing process**
```bash
# Use the stop script
npm run stop

# Or manually kill the process
lsof -ti:5000 | xargs kill -9
```

**Option 2: Use a different port**
```bash
# Set a different port in your .env file
PORT=5001 npm run dev
```

**Option 3: Stop all Node processes**
If the process keeps restarting (common with nodemon):
1. Press `Ctrl+C` in the terminal where `npm run dev` is running
2. Wait a few seconds for processes to fully stop
3. Run `npm run dev` again

### reCAPTCHA v3 not working
- Ensure you've set the `REACT_APP_RECAPTCHA_SITE_KEY` in the client `.env` file
- For development, the app uses Google's test keys by default
- Check browser console for any errors
- Verify that the reCAPTCHA script is loading (check Network tab)
- Ensure your domain is registered in the reCAPTCHA admin console
- Check server logs for reCAPTCHA verification scores

### Database errors
- Ensure SQLite3 is properly installed
- Check file permissions for the database file
- The database is created automatically on first run

### CORS errors
- The backend includes CORS middleware
- Ensure the frontend is making requests to `http://localhost:5000`

## License

ISC

