# Code Analyzer Frontend

A modern React frontend for the Code Analyzer AI Demo application, built with Vite, TailwindCSS, and React.

## Features

- 🎨 **Modern UI** - Clean, intuitive interface with TailwindCSS
- 📤 **File Upload** - Drag-and-drop ZIP file upload
- 🔗 **GitHub Integration** - Analyze repositories directly from GitHub URLs
- 📊 **Visual Results** - View diagrams, documentation, and code reviews
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Fast & Lightweight** - Built with Vite for optimal performance

## Prerequisites

- Node.js 18+ and npm/yarn
- Backend server running on `http://localhost:8080`

## Installation

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Configuration

### API URL

By default, the frontend connects to `http://localhost:8080/api/v1`. To change this:

1. Create a `.env` file in the `frontend` directory
2. Add:
   ```
   VITE_API_URL=http://your-backend-url/api/v1
   ```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Header.jsx
│   │   ├── UploadSection.jsx
│   │   ├── ResultsSection.jsx
│   │   ├── DiagramViewer.jsx
│   │   ├── DocumentationViewer.jsx
│   │   ├── CodeReviewViewer.jsx
│   │   └── LoadingSpinner.jsx
│   ├── services/            # API service layer
│   │   └── api.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Components

### UploadSection
Handles file upload (ZIP) and GitHub URL input with tabbed interface.

### ResultsSection
Displays analysis results with tabs for:
- Overview: Summary and quick stats
- Diagrams: Generated flowcharts, sequence, and architecture diagrams
- Documentation: Technical documentation in markdown
- Code Review: Issues, suggestions, and strengths

### DiagramViewer
Displays generated diagrams with support for:
- Mermaid diagram files
- Online image URLs
- Full-screen modal view

### DocumentationViewer
Renders markdown documentation with:
- Syntax highlighting for code blocks
- Proper formatting for headings, lists, tables
- Copy to clipboard functionality

### CodeReviewViewer
Shows code review results with:
- Filterable issues by severity and category
- Color-coded severity badges
- Improvement suggestions
- Code strengths

## Styling

The project uses TailwindCSS with custom components defined in `index.css`. Custom utility classes:

- `.btn` - Button base styles
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.card` - Card container
- `.input` - Input field
- `.label` - Form label

## API Integration

The frontend communicates with the backend through the `api.js` service:

- `analyzeZipFile(file)` - Upload and analyze ZIP file
- `analyzeGitHubUrl(url)` - Analyze GitHub repository
- `checkHealth()` - Health check endpoint

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure the backend has CORS enabled for `http://localhost:3000`.

### API Connection Failed

1. Verify backend is running on port 8080
2. Check `VITE_API_URL` in `.env` if using custom URL
3. Check browser console for detailed error messages

### Build Errors

1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Check Node.js version: `node -v` (should be 18+)

## License

MIT

