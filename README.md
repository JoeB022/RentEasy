# RentEasy - Complete Real Estate Management Platform

A full-stack real estate management platform with role-based access for tenants, landlords, and administrators. Built with React frontend and Flask backend.

## 🚀 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with automatic token refresh
- **Role-based access control** (Tenant, Landlord, Admin)
- **Protected routes** and secure API endpoints
- **Session management** with localStorage persistence
- **Admin approval system** for new user registrations
- **Phone number collection** during landlord signup
- **Account deletion** with cascade property removal

### 🏠 Property Management
- **Property listing** with detailed descriptions and amenities
- **Property search and filtering** capabilities
- **Image upload and management**
- **Property status tracking** (Available, Rented, Under Maintenance)
- **Location-based property search** with map integration
- **Amenities management** with multi-select options
- **Property deletion** with real-time updates
- **Newest properties** appear at the top of listings

### 📅 Booking System
- **Tenant booking requests** with approval workflow
- **Booking status management** (Pending, Approved, Rejected, Cancelled)
- **Booking history** and status tracking
- **Real-time booking updates**
- **Landlord contact integration** with WhatsApp, SMS, call, and email
- **Booking modal** with landlord details and communication options

### 👥 User Management
- **Multi-role user system** (Tenant, Landlord, Admin)
- **User profile management**
- **Admin user creation** via CLI script
- **Role-based dashboards**
- **Pending user approvals** for new registrations
- **User account deletion** with data cleanup

### 🎨 Modern UI/UX
- **Responsive design** with Tailwind CSS
- **Mobile-first approach**
- **Interactive components** with smooth animations
- **Form validation** with React Hook Form + Yup
- **Toast notifications** for user feedback
- **Enhanced property cards** with modern styling
- **Location navigation** with map integration
- **Visual amenity indicators** with icons and styling
- **Improved property forms** with comprehensive validation

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
- **Redis** - Session storage and caching
- **PostgreSQL** - Production database option

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
export FLASK_APP=app.py
export FLASK_ENV=development

# Initialize database
python manage.py db init
python manage.py db migrate
python manage.py db upgrade

# Run the application
python app.py
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
python manage.py create-admin --email admin@example.com --password admin123
```

## 🔧 Environment Configuration

### Backend Environment Variables
```bash
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=development
FLASK_DEBUG=True

# Database Configuration
SQLALCHEMY_DATABASE_URI=sqlite:///instance/app.db

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-here
JWT_ACCESS_TOKEN_EXPIRES=3600

# Redis Configuration (Optional)
REDIS_URL=redis://localhost:6379/0
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
python app.py

# Database operations
python manage.py db init
python manage.py db migrate
python manage.py db upgrade

# Create admin user
python manage.py create-admin --email admin@example.com --password admin123

# Run tests
python -m pytest
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
│   ├── app.py                 # Main Flask application
│   ├── manage.py              # Flask CLI management script
│   ├── config.py              # Configuration settings
│   ├── requirements.txt        # Python dependencies
│   ├── models/
│   │   ├── user.py            # User model and roles
│   │   ├── property.py        # Property model
│   │   ├── lease.py           # Lease model
│   │   └── payment.py         # Payment model
│   ├── routes/
│   │   ├── auth.py            # Authentication routes
│   │   ├── properties.py      # Property management routes
│   │   └── health.py          # Health check routes
│   ├── auth/
│   │   └── utils.py           # Authentication utilities
│   ├── migrations/            # Database migrations
│   ├── instance/
│   │   └── app.db             # SQLite database
│   └── venv/                  # Python virtual environment
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Auth.jsx       # Authentication modal
│   │   │   ├── PropertyCard.jsx
│   │   │   ├── PropertyList.jsx
│   │   │   ├── PropertyManager.jsx
│   │   │   ├── PropertyMap.jsx
│   │   │   ├── BookingModal.jsx
│   │   │   ├── PendingUserApprovals.jsx
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
- `phone`: Phone number (for landlords)
- `role`: User role (tenant, landlord, admin)
- `approval_status`: User approval status (pending, approved, rejected)

### Properties Table
- `id`: Primary key
- `name`: Property name
- `description`: Property description
- `price`: Monthly rent
- `location`: Property location
- `property_type`: Type of property (apartment, house, etc.)
- `bedrooms`: Number of bedrooms
- `bathrooms`: Number of bathrooms
- `square_feet`: Property size
- `amenities`: JSON array of amenities
- `images`: JSON array of image URLs
- `latitude`: GPS latitude
- `longitude`: GPS longitude
- `available`: Availability status
- `landlord_id`: Foreign key to users table

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
python app.py

# Or using Gunicorn for production
gunicorn -c gunicorn.conf.py wsgi:application
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
- `POST /auth/delete-account` - Delete user account
- `POST /auth/admin/approve-user/<id>` - Approve pending user (Admin only)
- `POST /auth/admin/reject-user/<id>` - Reject pending user (Admin only)

### Properties
- `GET /api/properties` - Get all available properties
- `GET /api/properties/<id>/landlord` - Get landlord details for property
- `GET /api/landlord/properties` - Get landlord's properties (Landlord only)
- `POST /api/landlord/properties` - Create new property (Landlord only)
- `PUT /api/landlord/properties/<id>` - Update property (Landlord only)
- `DELETE /api/landlord/properties/<id>` - Delete property (Landlord only)

### Admin
- `GET /auth/admin/users/pending` - Get pending users (Admin only)

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

## 🆕 Recent Updates

### Latest Features (v2.0)
- **Admin Approval System**: New users require admin approval before login
- **Phone Number Integration**: Landlords provide phone numbers during signup
- **Enhanced Booking Modal**: Direct communication with landlords via WhatsApp, SMS, call, and email
- **Property Management**: Complete CRUD operations with real-time updates
- **Location Services**: Map integration for property location selection and navigation
- **Cascade Deletion**: User account deletion removes all associated properties
- **Modern UI**: Enhanced property cards with improved styling and user experience
- **Database Migrations**: Proper schema management with Alembic migrations

### Key Improvements
- **Security**: Enhanced JWT token handling with automatic refresh
- **Performance**: Optimized database queries and frontend rendering
- **User Experience**: Intuitive property forms with comprehensive validation
- **Mobile Support**: Responsive design for all device sizes
- **Error Handling**: Comprehensive error boundaries and user feedback

## 📊 Current Status

✅ **Fully Functional Application**
- Complete authentication system with JWT
- Property management for landlords with CRUD operations
- Booking system with landlord contact integration
- Admin user management with approval workflow
- Phone number collection for landlords
- Property deletion with cascade cleanup
- Location-based property search with map integration
- Enhanced property cards with modern styling
- Responsive UI with Tailwind CSS
- Database persistence with migrations
- Error handling and validation
- WhatsApp/SMS/call/email integration for bookings

🔄 **In Development**
- Payment integration
- Email notifications
- Advanced property search filters
- Mobile app version
- Real-time notifications

---

**RentEasy** - Making property management easy and efficient! 🏠✨
