# RentEasy Frontend

A modern, responsive real estate management platform built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **User Authentication** - JWT-based auth with automatic token refresh
- **Role-Based Access** - Tenant, Landlord, and Admin dashboards
- **Property Management** - List, view, and manage properties
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Form Validation** - React Hook Form + Yup validation
- **Error Handling** - Global error boundaries and fallback UI
- **Performance** - Lazy loading and code splitting
- **Image Optimization** - Responsive images with fallback handling

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 3.4.1
- **Routing**: React Router DOM 7.6.2
- **Forms**: React Hook Form + Yup
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Chart.js + React Chart.js 2

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd RentEasy/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# API Configuration
VITE_API_URL=http://localhost:8000/api

# App Configuration
VITE_APP_NAME=RentEasy
VITE_APP_VERSION=1.0.0
```

## 🚀 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**: Connect your GitHub repository to Vercel
2. **Environment Variables**: Set `VITE_API_URL` in Vercel dashboard
3. **Build Settings**: Vercel will automatically detect Vite configuration
4. **Deploy**: Push to main branch to trigger automatic deployment

### Netlify Deployment

1. **Connect Repository**: Connect your GitHub repository to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables**: Set `VITE_API_URL` in Netlify dashboard
4. **Deploy**: Push to main branch to trigger automatic deployment

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy dist/ folder to your hosting provider
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── forms/          # Form components (TextInput, SelectInput, etc.)
│   ├── Header.jsx      # Navigation header
│   ├── Auth.jsx        # Authentication modal
│   └── ...
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── TenantDashboard.jsx
│   ├── LandlordDashboard.jsx
│   └── AdminDashboard.jsx
├── hooks/              # Custom React hooks
│   └── useAuthFetch.js # Authenticated fetch hook
├── utils/              # Utility functions
│   └── auth.js         # Authentication utilities
└── App.jsx             # Main application component
```

## 🔐 Authentication

The app uses JWT tokens with automatic refresh:

- **Access Token**: Short-lived token for API requests
- **Refresh Token**: Long-lived token for getting new access tokens
- **Automatic Refresh**: Tokens are refreshed before expiry
- **Route Protection**: Protected routes check authentication and roles

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Custom Colors**: RentEasy brand colors (#003B4C, #007C99)
- **Component Library**: Consistent form and UI components

## 📱 Responsive Design

- **Mobile**: Single column layout, touch-friendly controls
- **Tablet**: Two-column grid, optimized spacing
- **Desktop**: Multi-column layout, hover effects

## 🚨 Error Handling

- **Error Boundaries**: Catches React component errors
- **Fallback UI**: User-friendly error messages
- **Loading States**: Skeleton screens and spinners
- **Form Validation**: Real-time validation with error messages

## 🔧 Performance Optimizations

- **Code Splitting**: Lazy loading of dashboard pages
- **Bundle Optimization**: Manual chunk splitting for vendor libraries
- **Image Optimization**: Lazy loading and responsive images
- **Tree Shaking**: Unused code elimination

## 📊 Build Output

The build process creates optimized bundles:

- **Vendor**: React, React DOM
- **Router**: React Router DOM
- **UI**: Headless UI, Framer Motion
- **Charts**: Chart.js libraries
- **App**: Main application code

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates

Keep dependencies updated:

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update to latest versions (use with caution)
npm install -g npm-check-updates
ncu -u
npm install
```
