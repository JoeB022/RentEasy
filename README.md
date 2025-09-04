# RentEasy - Complete Real Estate Management Platform

A full-stack real estate management platform with role-based access for tenants, landlords, and administrators. Built with React frontend and Flask backend.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with automatic token refresh
- **Role-based access control** (Tenant, Landlord, Admin)
- **Protected routes** and secure API endpoints
- **Session management** with localStorage persistence

### 🏠 Property Management
- **Property listing** with detailed descriptions and amenities
- **Property search and filtering** capabilities
- **Image upload and management**
- **Property status tracking** (Available, Rented, Under Maintenance)

### 📅 Booking System
- **Tenant booking requests** with approval workflow
- **Booking status management** (Pending, Approved, Rejected, Cancelled)
- **Booking history** and status tracking
- **Real-time booking updates**

### 👥 User Management
- **Multi-role user system** (Tenant, Landlord, Admin)
- **User profile management**
- **Admin user creation** via CLI script
- **Role-based dashboards**

### 🎨 Modern UI/UX
- **Responsive design** with Tailwind CSS
- **Mobile-first approach**
- **Interactive components** with smooth animations
- **Form validation** with React Hook Form + Yup
- **Toast notifications** for user feedback

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with hooks
- **Vite 6.3.5** - Fast build tool and dev server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **React Router DOM 7.6.2** - Client-side routing
- **React Hook Form + Yup** - Form handling and validation
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications
- **JWT Decode** - Token parsing

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **Flask-JWT-Extended** - JWT authentication
- **Flask-CORS** - Cross-origin resource sharing
- **Flask-Migrate** - Database migrations
- **Werkzeug** - Password hashing and utilities
- **SQLite** - Lightweight database

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **Git**

### 1. Clone Repository
```bash
git clone https://github.com/JoeB022/RentEasy.git
cd RentEasy
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
export FLASK_APP=app_simple.py
export FLASK_ENV=development

# Run the application
python app_simple.py
```

The backend will run on `http://localhost:8000`

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Create Admin Account (Optional)
```bash
# From the backend directory
python create_admin.py --email admin@example.com --password admin123
```

## 🔧 Environment Configuration

### Backend Environment Variables
```bash
# Flask Configuration
FLASK_APP=app_simple.py
FLASK_ENV=development
FLASK_DEBUG=True

# Database Configuration
SQLALCHEMY_DATABASE_URI=sqlite:///test.db
```

### Frontend Environment Variables
Create `frontend/.env.local`:
```bash
# API Configuration
VITE_API_URL=http://localhost:8000
```

## 🚀 Development

### Backend Development
```bash
# Start development server
python app_simple.py

# Database operations
flask db init
flask db migrate
flask db upgrade

# Create admin user
python create_admin.py --email admin@example.com --password admin123
```

### Frontend Development
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

## 📁 Project Structure

```
RentEasy/
├── backend/
│   ├── app_simple.py          # Main Flask application (feature-rich)
│   ├── app.py                 # Production Flask skeleton
│   ├── config.py              # Configuration settings
│   ├── requirements.txt        # Python dependencies
│   ├── create_admin.py        # Admin user creation script
│   ├── models/
│   │   └── user.py            # User model and roles
│   ├── instance/
│   │   └── test.db            # SQLite database
│   └── venv/                  # Python virtual environment
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Auth.jsx       # Authentication modal
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── PropertyList.jsx
│   │   │   ├── BookingStatus.jsx
│   │   │   ├── Services.jsx
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── TenantDashboard.jsx
│   │   │   ├── LandlordDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── hooks/
│   │   │   └── useAuthFetch.js # Authenticated fetch hook
│   │   ├── utils/
│   │   │   └── auth.js         # Authentication utilities
│   │   ├── config/
│   │   │   └── api.js          # API configuration
│   │   └── App.jsx             # Main application component
│   ├── package.json            # Node.js dependencies
│   ├── vite.config.js          # Vite configuration
│   └── .env.local              # Environment variables
└── README.md                   # This file
```

## 🔐 Authentication Flow

1. **User Registration/Login**: JWT tokens are generated
2. **Token Storage**: Tokens stored in localStorage
3. **API Requests**: Access token included in Authorization header
4. **Token Refresh**: Automatic refresh before expiry
5. **Route Protection**: Protected routes check authentication and roles

## 🏠 Property Management Flow

### Landlord Side
1. **Login** to landlord dashboard
2. **Add Property** with details, images, and amenities
3. **Manage Properties** - edit, update, or remove listings
4. **View Bookings** - see tenant booking requests

### Tenant Side
1. **Browse Properties** - view available listings
2. **Book Property** - submit booking request
3. **Manage Bookings** - approve, reject, or cancel bookings
4. **View Services** - access additional services

## 📅 Booking System

### Booking Statuses
- **Pending**: Initial booking request
- **Approved**: Tenant approved the booking
- **Rejected**: Tenant rejected the booking
- **Cancelled**: Booking was cancelled

### Booking Workflow
1. Tenant books a property → Status: Pending
2. Tenant can approve/reject → Status: Approved/Rejected
3. Landlord can view all booking requests
4. Bookings persist across page refreshes

## 🎨 UI Components

### Property Cards
- **Property images** with fallback handling
- **Amenities display** with styled pills
- **Booking buttons** with role-based visibility
- **Responsive design** for all screen sizes

### Forms
- **Validation** with real-time feedback
- **Error handling** with user-friendly messages
- **Loading states** with spinners
- **Success notifications** with toast messages

## 🚨 Error Handling

### Frontend
- **Error boundaries** for React component errors
- **API error handling** with retry mechanisms
- **Form validation** with detailed error messages
- **Loading states** and skeleton screens

### Backend
- **Exception handling** with proper HTTP status codes
- **Database error handling** with rollback mechanisms
- **JWT validation** with proper error responses
- **CORS configuration** for cross-origin requests

## 🔧 Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `email`: Unique email address
- `password_hash`: Hashed password
- `role`: User role (tenant, landlord, admin)

### Properties Table
- `id`: Primary key
- `title`: Property title
- `description`: Property description
- `price`: Monthly rent
- `location`: Property location
- `amenities`: JSON array of amenities
- `landlord_id`: Foreign key to users table
- `status`: Property status

### Bookings Table
- `id`: Primary key
- `property_id`: Foreign key to properties table
- `tenant_id`: Foreign key to users table
- `status`: Booking status
- `created_at`: Booking creation timestamp

## 🚀 Deployment

### Backend Deployment
```bash
# Production build
pip install -r requirements.txt
python app_simple.py
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting provider
```

## 🧪 Testing

### Backend Testing
```bash
# Run tests (when implemented)
python -m pytest

# Run with coverage
python -m pytest --cov=.
```

### Frontend Testing
```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh

### Properties
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create new property (Landlord only)
- `PUT /api/properties/<id>` - Update property (Landlord only)
- `DELETE /api/properties/<id>` - Delete property (Landlord only)

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create booking (Tenant only)
- `PUT /api/bookings/<id>` - Update booking status

## 🔄 Updates & Maintenance

### Keep Dependencies Updated
```bash
# Backend
pip list --outdated
pip install -U package_name

# Frontend
npm outdated
npm update
```

### Database Migrations
```bash
# Create migration
flask db migrate -m "Description"

# Apply migration
flask db upgrade
```

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📊 Current Status

✅ **Fully Functional Application**
- Complete authentication system
- Property management for landlords
- Booking system for tenants
- Admin user management
- Responsive UI with modern design
- Database persistence
- Error handling and validation

🔄 **In Development**
- Enhanced admin dashboard
- Advanced property search
- Payment integration
- Email notifications
- Mobile app version

---

**RentEasy** - Making property management easy and efficient! 🏠✨
