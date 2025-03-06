# Real-time Chat Frontend

Modern React-based chat interface with real-time messaging capabilities and animated interactions.

## Features

- 💬 WebSocket-based real-time messaging (STOMP)
- 😊 Emoji picker integration
- 🔔 Toast notifications system
- 🛣️ Client-side routing
- 📱 Responsive design with Tailwind CSS
- 🔄 API integration with Axios

## Tech Stack

**Core:**
- React 19
- Vite 6
- TypeScript
- Tailwind CSS 3
- Styled Components

**Key Libraries:**
- `@stomp/stompjs` + `sockjs-client` - WebSocket communication
- `axios` - HTTP client
- `react-router-dom` - Routing
- `emoji-picker-react` - Emoji selection
- `react-hot-toast` - Notifications

## Installation

1. Clone the repository:
   git clone https://github.com/Av899/ChatWebAppFront-end-repo.git
   cd chat-app/frontend-chat
   
2. Install dependencies:
   npm install
   
3. Create `.env` file:
   VITE_API_URL=http://localhost:8080/api
   VITE_WS_URL=ws://localhost:8080/chat

4. Start development server:
   npm run dev

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run lint` - Run ESLint code analysis
- `npm run preview` - Preview production build

## Configuration

Ensure your backend is running and update these environment variables as needed:

| Variable         | Description                | Example Value              |
|------------------|----------------------------|----------------------------|
| VITE_API_URL     | Backend API base URL       | http://localhost:8080/api  |
| VITE_WS_URL      | WebSocket endpoint         | ws://localhost:8080/chat   |

## Development Notes

- Uses React 19's new features including React Compiler
- Styling combines Tailwind CSS with Styled Components
- Implements WebSocket reconnection logic
- Includes responsive design breakpoints
- Features animated route transitions

##ScreenShots
![image](https://github.com/user-attachments/assets/9268fed8-b6b7-43ed-b528-66dc30a68c95)
![image](https://github.com/user-attachments/assets/6e2af851-e1be-4f3c-bb5f-a9917eeb3013)
![image](https://github.com/user-attachments/assets/f261535a-e492-43b6-ab85-76c7bbd0e154)
![image](https://github.com/user-attachments/assets/a5b171dc-1877-42c8-827d-af67c1777912)





## License

[MIT](https://choosealicense.com/licenses/mit/)
