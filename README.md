# ChatApp Frontend

A modern real-time chat application frontend built with React, TypeScript, Vite, Tailwind CSS, and WebSockets.

## Features

* Real-time messaging
* WebSocket integration
* Room-based chat system
* Responsive UI
* TypeScript support
* Tailwind CSS styling
* Instant message updates
* Clean and modern design

## Tech Stack

* React
* TypeScript
* Vite
* Tailwind CSS
* WebSocket API

## Project Structure

```bash
src/
├── App.tsx
├── main.tsx
├── index.css
└── assets/
```

## Installation

Clone the repository:

```bash
git clone https://github.com/anjeetsingh7155/ChatAppFrontend.git
```

Navigate to the project:

```bash
cd ChatAppFrontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will run on:

```bash
http://localhost:5173
```

## WebSocket Connection

Update the WebSocket URL if required:

```ts
const ws = new WebSocket("ws://localhost:8080");
```

Make sure the backend server is running before starting the frontend.

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Future Improvements

* User authentication
* Multiple chat rooms
* Online user status
* Message timestamps
* Typing indicators
* Chat history persistence
* File sharing
* Emoji support

## Author

Anjeet Singh

GitHub:
https://github.com/anjeetsingh7155
