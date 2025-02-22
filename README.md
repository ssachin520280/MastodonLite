# MastodonLite

A powerful, user-friendly Mastodon post search application built for FossHack 2025. Search across multiple Mastodon instances using AI-powered hashtag suggestions.

## Demo
- 🌐 [Live Website](https://mastodon-lite.vercel.app)
- 🎥 [Demo Video](https://youtu.be/f_FCf3D47mw)

## Features

### 🔍 Smart Search
- AI-powered hashtag suggestions using Google's Gemini API
- Real-time search across multiple Mastodon instances
- Intelligent query enhancement for better search results

### 🌐 Multi-Instance Support
- Search across popular Mastodon instances:
  - mastodon.social
  - infosec.exchange
  - mas.to
- Customizable instance selection
- Parallel search processing for faster results

### 📱 Modern UI/UX
- Clean, responsive design
- Rich post cards with full post content
- Support for embedded links and cards
- Interactive engagement metrics
- User-friendly interface with real-time updates

## Tech Stack

- **Frontend**: Next.js 13+ with TypeScript
- **UI Framework**: Tailwind CSS
- **State Management**: React Hooks + SWR
- **API Integration**: Axios
- **AI Integration**: Google Gemini 1.5
- **API Routes**: Next.js API Routes

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/ssachin520280/mastodonlite.git
cd mastodonlite
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
HUGGINGFACE_API_KEY=your_hugging_face_api_key
GEMINI_API_KEY=your_gemini_api_key
```

4. Run the development server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Architecture

### Core Components
- `page.tsx`: Main application interface with search functionality
- `PostCard.tsx`: Reusable component for displaying Mastodon posts
- `api/search/`: API routes for hashtag generation and post fetching
- Custom types for TypeScript support

### API Endpoints
- `/api/search`: Generates hashtag suggestions using Gemini AI
- `/api/search/posts`: Fetches posts from selected Mastodon instances

## Future Roadmap 🚀

### Offline-First Architecture
- **Local-First Storage**: Implementation of IndexedDB for offline data persistence
- **P2P Communication**: WebRTC integration for direct device-to-device communication
- **Sync Management**: WebSocket-based synchronization when internet connectivity returns
- **Ephemeral Content**: Snapchat-style temporary content with customizable retention periods

### Use Cases
- **Travel Mode**: Perfect for trips where internet access is limited
  - Cache content before going offline
  - Create and queue posts while offline
  - Sync automatically when connection is restored
  
- **Local Network Communication**: Share and interact within local networks
  - Direct device-to-device communication
  - Local content discovery
  - Reduced dependency on central servers

- **Privacy-Focused Features**
  - Self-destructing messages and media
  - Local-only content options
  - Encrypted P2P communication

### Technical Implementation Plans
- WebRTC for peer discovery and direct communication
- IndexedDB for robust offline storage
- Service Workers for background sync
- WebSocket for real-time updates when online
- Conflict resolution for offline-online synchronization

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the [MIT License](./LICENSE).

## Acknowledgments

- Mastodon API for enabling federated post search
- Hugging Face Models and Google Gemini API for powering hashtag suggestions
- The FOSS community for inspiration and support

## FossHack 2025

This project was created as part of FossHack 2025, demonstrating the power of open-source social media tools and AI integration.