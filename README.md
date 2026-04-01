# 🎮 GameLearn - AI-Powered Game-Based Learning Platform

A modern, gamified educational platform designed for students in grades 5-10, featuring AI-powered adaptive learning, interactive games, and a beautiful user interface.

## ✨ Features

### 🎯 Core Features
- **Guest Mode**: Explore without creating an account (no Firebase auth required)
- **Gamified Learning**: XP system, levels, badges, and achievements
- **Interactive Games**: Math, Science, Language, Logic, and more
- **Beautiful UI**: Modern design with animations and responsive layout
- **Progress Tracking**: Visual charts and statistics
- **Avatar System**: Customizable user avatars
- **Real-time Feedback**: Toast notifications and progress updates

### 🎨 UI/UX Features
- **Glassmorphism Design**: Beautiful backdrop blur effects
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Dark Theme**: Eye-friendly dark gradient backgrounds
- **Interactive Elements**: Hover effects and micro-interactions

### 🚀 Technical Features
- **TypeScript**: Full type safety
- **React 18**: Latest React features
- **Vite**: Fast development and building
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Local Storage**: Guest mode data persistence

## 🏗️ Project Structure

```
full_stack/
├── apps/
│   ├── client/                          # React Frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── auth/                # Authentication components
│   │   │   │   ├── dashboard/           # Dashboard components
│   │   │   │   ├── profile/             # Profile components
│   │   │   │   └── ui/                  # Reusable UI components
│   │   │   ├── contexts/                # React contexts
│   │   │   ├── App.tsx                  # Main app component
│   │   │   └── index.tsx                # Entry point
│   │   ├── package.json                 # Frontend dependencies
│   │   └── tailwind.config.js           # Tailwind CSS config
│   │
│   └── server/                          # Node.js Backend
│       ├── src/
│       │   └── server.ts                # Main server file
│       ├── package.json                 # Backend dependencies
│       └── tsconfig.json                # TypeScript config
│
├── README.md                            # Project documentation
└── LICENSE                              # License file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd full_stack
   ```

2. **Install client dependencies**
   ```bash
   cd apps/client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

### Development

1. **Start the client (frontend)**
   ```bash
   cd apps/client
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

2. **Start the server (backend) - Optional**
   ```bash
   cd apps/server
   npm run dev
   ```
   The server will be available at `http://localhost:5000`

### Building for Production

1. **Build the client**
   ```bash
   cd apps/client
   npm run build
   ```

2. **Build the server**
   ```bash
   cd apps/server
   npm run build
   npm start
   ```

## 🎮 How to Use

### Guest Mode (Recommended for Testing)
1. Open the application
2. Click on "Guest Mode" tab
3. Optionally enter a display name
4. Click "Start as Guest" or "Quick Start"
5. Explore the dashboard and games

### Regular Account
1. Click "Sign Up" tab
2. Enter your email, password, and optional display name
3. Create your account
4. Sign in and start learning

### Features Available
- **Dashboard**: View your progress, XP, level, and recent games
- **Games**: Play educational games in various subjects
- **Profile**: Customize your avatar and view statistics
- **Badges**: Earn achievements by completing challenges

## 🎨 Customization

### Adding New Games
1. Add game data to `GameGrid.tsx`
2. Create game component in `components/games/`
3. Implement game logic and scoring

### Customizing UI
- Colors: Modify Tailwind classes in components
- Animations: Adjust Framer Motion properties
- Layout: Update CSS classes and grid systems

### Adding Features
- New badges: Update `BadgeDisplay.tsx`
- Additional stats: Modify `QuickStats.tsx`
- New avatar options: Update `AvatarSelector.tsx`

## 🔧 Technical Details

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Local Storage** for data persistence

### State Management
- **React Context** for global state
- **Local Storage** for guest mode persistence
- **Custom hooks** for reusable logic

### Styling
- **Tailwind CSS** utility classes
- **Glassmorphism** design patterns
- **Responsive** design principles
- **Dark theme** with gradients

## 🚀 Deployment

### Client Deployment
The client can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

### Server Deployment
The server can be deployed to:
- Heroku
- Railway
- DigitalOcean
- AWS EC2

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify Node.js version compatibility
4. Create an issue with detailed information

## 🎯 Roadmap

- [ ] Real educational games implementation
- [ ] AI-powered difficulty adjustment
- [ ] Multiplayer features
- [ ] Teacher dashboard
- [ ] Progress reports
- [ ] Mobile app
- [ ] Offline support
- [ ] Internationalization

---

**Happy Learning! 🎮✨**
