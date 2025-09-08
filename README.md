# re:space 🏠✨

An AI-powered interior design and space transformation tool that lets you reimagine any room using natural language prompts. Built with React, TypeScript, and Google's Gemini AI.

## Features

- **AI-Powered Transformations**: Use natural language to describe how you want to change a space
- **Interactive Timeline**: Navigate through your editing history with an intuitive timeline interface
- **Smart Prompts**: Get contextual suggestions based on your uploaded image
- **Dual View Mode**: Compare original and edited images side by side
- **Template Gallery**: Start with pre-loaded example spaces or upload your own
- **Real-time Preview**: See your changes instantly with a responsive viewer

## How It Works

1. **Upload or Select**: Choose an image from the template gallery or upload your own interior photo
2. **Describe Changes**: Use natural language to describe your desired transformations (e.g., "Make the walls painted white", "Add a large monstera plant in the corner")
3. **AI Magic**: Gemini AI processes your request and generates the transformed space
4. **Iterate**: Continue making changes and build up a history of transformations

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- A Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd re-space
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment:
   - Create a `.env.local` file in the root directory
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm run deploy` - Deploy to GitHub Pages

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **AI Service**: Google Gemini API
- **3D Viewer**: Three.js, Photo Sphere Viewer
- **Styling**: CSS Modules
- **Deployment**: GitHub Pages

## Project Structure

```
re-space/
├── components/          # React components
│   ├── Capture.tsx     # Image capture functionality
│   ├── ControlPanel.tsx # Main editing controls
│   ├── Header.tsx      # App header
│   ├── ImageUploader.tsx # File upload component
│   ├── Timeline.tsx    # History navigation
│   ├── Viewer.tsx      # Image display component
│   └── icons/          # SVG icon components
├── services/           # API services
│   └── geminiService.ts # Gemini AI integration
├── constants.ts        # App constants and templates
├── types.ts           # TypeScript type definitions
└── App.tsx            # Main application component
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
