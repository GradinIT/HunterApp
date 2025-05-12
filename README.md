# HunterApp
Mobile frontend to the Hunter Webb 

## Overview
HunterApp is a React-based frontend application.
provides hunters and hunting managers with tools to:

- Manage hunter profiles and blind locations
- Run blind lottery to assign hunters to specific locations
- Create and track observations during hunts
- Submit and manage maintenance reports for blinds
- Notify managers about maintenance needs

## Getting Started

### Prerequisites
- Node.js
- npm
- Backend API running (default: http://localhost:8080)

### Development
To get started, clone the repository, install the dependencies and then run the development server.
```
npm install
npm run dev
```
Set the proxy in [vite.config.js](vite.config.js) to point to your backend API.

### Configuration
The application connects to a backend API. You can set the api base URL in [src/config.js](src/config.js)

### Production Build
Build for production:
```
npm run build
```

Preview the production build:
```
npm run preview
```
