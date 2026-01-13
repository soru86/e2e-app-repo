# Frontend Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Ensure Backend is Running

Make sure the Spring Boot backend is running on `http://localhost:8080`

## Development

### Project Structure

```
frontend/
├── src/
│   ├── components/        # React components
│   ├── services/          # API integration
│   ├── App.jsx           # Main app component
│   └── index.css         # Global styles
├── public/               # Static assets
├── package.json          # Dependencies
└── vite.config.js       # Vite configuration
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

## Features

### Upload Section
- **ZIP Upload**: Drag-and-drop or click to upload ZIP files
- **GitHub Integration**: Enter GitHub repository URL
- **File Validation**: Automatic validation of file types and URLs

### Results Display
- **Overview Tab**: Quick summary with scores and statistics
- **Diagrams Tab**: View generated flowcharts, sequence, and architecture diagrams
- **Documentation Tab**: Full technical documentation with syntax highlighting
- **Code Review Tab**: Detailed code review with filters and categorization

### UI Components
- Responsive design for mobile and desktop
- Loading states with progress indicators
- Error handling with user-friendly messages
- Modal views for full-size diagram viewing
- Copy-to-clipboard for documentation

## Styling

The project uses TailwindCSS with custom utility classes:

- `.btn` - Button styles
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary buttons
- `.card` - Card containers
- `.input` - Form inputs
- `.label` - Form labels

## API Integration

The frontend communicates with the backend through:

- `POST /api/v1/analyze/upload` - Upload ZIP file
- `POST /api/v1/analyze/github` - Analyze GitHub repo
- `GET /api/v1/analyze/health` - Health check

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, Vite will automatically try the next available port.

### CORS Errors

The backend already has CORS enabled. If you still see CORS errors:
1. Check backend is running
2. Verify API URL in `.env`
3. Check browser console for detailed errors

### Build Errors

1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Check Node.js version: `node -v` (should be 18+)

### Module Not Found

Run `npm install` to ensure all dependencies are installed.

## Production Build

### Build

```bash
npm run build
```

Output will be in the `dist` directory.

### Deploy

The `dist` directory can be served by any static file server:

- **Nginx**: Copy `dist` contents to web root
- **Apache**: Copy `dist` contents to `htdocs`
- **Netlify/Vercel**: Deploy `dist` directory
- **Docker**: Use nginx image to serve `dist`

### Example Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## Performance

- Code splitting with Vite
- Lazy loading for heavy components
- Optimized bundle size
- Fast refresh in development

## License

MIT

