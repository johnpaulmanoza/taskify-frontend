# Taskify

Taskify is a powerful task management application inspired by Kanban boards. It helps teams organize work, track progress, and boost productivity through a visual, intuitive interface.

![Taskify Screenshot](https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80)

## Features

- **Intuitive Board Management**: Create and organize boards for different projects or workflows
- **Drag-and-Drop Interface**: Easily move tasks between different stages of completion
- **Card System**: Create detailed cards with descriptions, labels, and more
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **User Authentication**: Secure login and registration system

## Tech Stack

- **Frontend**: React, TypeScript, Redux Toolkit
- **Styling**: Tailwind CSS
- **Drag and Drop**: react-beautiful-dnd
- **Icons**: Lucide React
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/taskify.git
   cd taskify
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
taskify/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── auth/        # Authentication components
│   │   ├── boards/      # Board-related components
│   │   ├── cards/       # Card-related components
│   │   ├── layout/      # Layout components (Header, Footer)
│   │   ├── lists/       # List-related components
│   │   └── ui/          # Generic UI components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── store/           # Redux store and slices
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Entry point
├── .gitignore           # Git ignore file
├── index.html           # HTML entry point
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Development

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check for code issues

## Deployment

This project can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

```bash
# Build the project
npm run build

# The output will be in the 'dist' directory
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [Lucide](https://lucide.dev/)
- UI inspiration from various Kanban board applications