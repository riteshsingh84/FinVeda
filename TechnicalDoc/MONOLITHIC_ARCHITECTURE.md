# FinVeda - Monolithic Architecture Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Setup Instructions](#setup-instructions)
5. [Development Workflow](#development-workflow)
6. [Build Process](#build-process)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Authentication & Security](#authentication--security)
10. [Deployment](#deployment)

---

## Architecture Overview

### What is Monolithic Architecture?

FinVeda follows a **monolithic architecture** pattern where both the React frontend (client) and Python backend (server) are combined into a single deployable bundle. This means:

- **Single Codebase**: Client and server code coexist in the same repository under `/src`
- **Single Deployment**: Both frontend and backend are deployed together
- **Shared Resources**: Built React application is served by the Python Flask/FastAPI server
- **Simplified Infrastructure**: One container/process to manage instead of multiple microservices

### Architecture Benefits

✅ **Simplified Development**: Single project setup, easier debugging  
✅ **Easier Deployment**: One bundle to build and deploy  
✅ **Better Performance**: No inter-service network latency  
✅ **Shared Context**: Easy to access shared utilities and configurations  
✅ **Unified Logging**: Centralized logging and monitoring  

### Architecture Layers

```
┌────────────────────────────────────────────┐
│          React Frontend (Client)           │
│  - Components, Pages, Services, Context    │
│  - Runs in Browser                         │
└────────────────────────────────────────────┘
                    ↓
          (REST/GraphQL API)
                    ↓
┌────────────────────────────────────────────┐
│       Python Backend (Server)              │
│  - API Routes, Business Logic              │
│  - Database Models, Services               │
│  - Authentication, Middleware              │
└────────────────────────────────────────────┘
                    ↓
         ┌────────────────────┐
         │   Database         │
         │   (PostgreSQL)     │
         └────────────────────┘
```

---

## Technology Stack

### Frontend (Client)
- **Framework**: React 18.x
- **Language**: JavaScript/TypeScript
- **State Management**: Context API / Redux (optional)
- **Styling**: CSS/SASS, CSS-in-JS
- **Build Tool**: Webpack (via CRA or Vite)
- **HTTP Client**: Axios / Fetch API
- **Testing**: Jest, React Testing Library

### Backend (Server)
- **Framework**: Flask or FastAPI (Python)
- **Language**: Python 3.9+
- **ORM**: SQLAlchemy / Django ORM
- **Database**: PostgreSQL / SQLite (development)
- **Authentication**: JWT, OAuth 2.0
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Pytest, unittest

### DevOps & Deployment
- **Containerization**: Docker
- **Orchestration**: Docker Compose (development), Kubernetes (production)
- **CI/CD**: GitHub Actions, GitLab CI

---

## Directory Structure

```
FinVeda/
├── src/
│   ├── client/                          # React Frontend Application
│   │   ├── public/                      # Static files
│   │   │   ├── index.html              # Main HTML entry point
│   │   │   ├── favicon.ico
│   │   │   └── manifest.json           # PWA manifest
│   │   │
│   │   ├── src/
│   │   │   ├── index.tsx               # React entry point
│   │   │   ├── App.tsx                 # Root component
│   │   │   ├── App.css                 # Global styles
│   │   │   │
│   │   │   ├── components/             # Reusable components
│   │   │   │   ├── Dashboard/
│   │   │   │   ├── Portfolio/
│   │   │   │   ├── Alerts/
│   │   │   │   ├── Risk/
│   │   │   │   ├── Tax/
│   │   │   │   ├── Projections/
│   │   │   │   ├── Behavioral/
│   │   │   │   ├── Goals/
│   │   │   │   ├── Transactions/
│   │   │   │   ├── NavBar/
│   │   │   │   ├── Footer/
│   │   │   │   └── Common/            # Button, Modal, Table, etc.
│   │   │   │
│   │   │   ├── pages/                  # Page components (routing)
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Portfolio.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   ├── Settings.tsx
│   │   │   │   ├── NotFound.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── services/               # API service layer
│   │   │   │   ├── api.ts              # Axios/Fetch configuration
│   │   │   │   ├── authService.ts
│   │   │   │   ├── portfolioService.ts
│   │   │   │   ├── dashboardService.ts
│   │   │   │   ├── transactionService.ts
│   │   │   │   ├── riskService.ts
│   │   │   │   ├── taxService.ts
│   │   │   │   ├── projectionService.ts
│   │   │   │   ├── alertService.ts
│   │   │   │   ├── goalService.ts
│   │   │   │   └── behavioralService.ts
│   │   │   │
│   │   │   ├── context/                # React Context (State Management)
│   │   │   │   ├── AuthContext.tsx
│   │   │   │   ├── ThemeContext.tsx
│   │   │   │   ├── PortfolioContext.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── hooks/                  # Custom React Hooks
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useFetch.ts
│   │   │   │   ├── useForm.ts
│   │   │   │   ├── useTheme.ts
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── styles/                 # Global styles & themes
│   │   │   │   ├── global.css
│   │   │   │   ├── variables.css
│   │   │   │   ├── theme.ts
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── utils/                  # Utility functions
│   │   │   │   ├── validators.ts
│   │   │   │   ├── formatters.ts
│   │   │   │   ├── calculations.ts
│   │   │   │   ├── localStorage.ts
│   │   │   │   └── ...
│   │   │   │
│   │   │   └── assets/                 # Images, icons, fonts
│   │   │       ├── images/
│   │   │       ├── icons/
│   │   │       └── fonts/
│   │   │
│   │   ├── package.json                # Frontend dependencies
│   │   ├── tsconfig.json               # TypeScript config
│   │   ├── .env.example                # Environment variables template
│   │   └── README.md                   # Frontend-specific docs
│   │
│   ├── server/                         # Python Flask/FastAPI Backend
│   │   ├── app/
│   │   │   ├── __init__.py             # Flask/FastAPI app factory
│   │   │   │
│   │   │   ├── api/                    # API endpoints
│   │   │   │   ├── __init__.py
│   │   │   │   ├── routes/
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── auth.py         # /api/auth/* routes
│   │   │   │   │   ├── portfolio.py    # /api/portfolio/* routes
│   │   │   │   │   ├── dashboard.py    # /api/dashboard/* routes
│   │   │   │   │   ├── transactions.py # /api/transactions/* routes
│   │   │   │   │   ├── alerts.py       # /api/alerts/* routes
│   │   │   │   │   ├── risk.py         # /api/risk/* routes
│   │   │   │   │   ├── tax.py          # /api/tax/* routes
│   │   │   │   │   ├── projections.py  # /api/projections/* routes
│   │   │   │   │   ├── goals.py        # /api/goals/* routes
│   │   │   │   │   ├── behavioral.py   # /api/behavioral/* routes
│   │   │   │   │   ├── user.py         # /api/user/* routes
│   │   │   │   │   └── settings.py     # /api/settings/* routes
│   │   │   │   └── middleware.py       # HTTP middleware setup
│   │   │   │
│   │   │   ├── models/                 # Database models (SQLAlchemy)
│   │   │   │   ├── __init__.py
│   │   │   │   ├── user.py             # User model
│   │   │   │   ├── portfolio.py        # Portfolio model
│   │   │   │   ├── transaction.py      # Transaction model
│   │   │   │   ├── alert.py            # Alert model
│   │   │   │   ├── goal.py             # Goal model
│   │   │   │   ├── risk_profile.py     # Risk profile model
│   │   │   │   ├── tax_record.py       # Tax record model
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── services/               # Business logic layer
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth_service.py     # Authentication logic
│   │   │   │   ├── portfolio_service.py
│   │   │   │   ├── dashboard_service.py
│   │   │   │   ├── transaction_service.py
│   │   │   │   ├── alert_service.py
│   │   │   │   ├── risk_service.py
│   │   │   │   ├── tax_service.py
│   │   │   │   ├── projection_service.py
│   │   │   │   ├── goal_service.py
│   │   │   │   ├── behavioral_service.py
│   │   │   │   ├── email_service.py
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── middleware/             # Custom middleware
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth_middleware.py  # JWT verification
│   │   │   │   ├── error_handler.py    # Error handling
│   │   │   │   ├── logging.py          # Request logging
│   │   │   │   ├── cors.py             # CORS configuration
│   │   │   │   └── ...
│   │   │   │
│   │   │   └── utils/                  # Utility functions
│   │   │       ├── __init__.py
│   │   │       ├── validators.py
│   │   │       ├── formatters.py
│   │   │       ├── calculations.py
│   │   │       ├── mail.py             # Email utilities
│   │   │       ├── jwt_utils.py        # JWT helpers
│   │   │       └── ...
│   │   │
│   │   ├── config/                     # Configuration files
│   │   │   ├── __init__.py
│   │   │   ├── settings.py             # Main settings
│   │   │   ├── database.py             # Database config
│   │   │   ├── logging.py              # Logging config
│   │   │   └── constants.py            # Constants
│   │   │
│   │   ├── tests/                      # Test suite
│   │   │   ├── __init__.py
│   │   │   ├── conftest.py             # Pytest fixtures
│   │   │   ├── unit/
│   │   │   │   ├── test_auth_service.py
│   │   │   │   ├── test_portfolio_service.py
│   │   │   │   └── ...
│   │   │   └── integration/
│   │   │       ├── test_auth_routes.py
│   │   │       ├── test_portfolio_routes.py
│   │   │       └── ...
│   │   │
│   │   ├── run.py                      # Application entry point
│   │   ├── requirements.txt            # Python dependencies
│   │   ├── .env.example                # Environment variables template
│   │   ├── Dockerfile                  # Docker configuration
│   │   └── README.md                   # Backend-specific docs
│   │
│   └── README.md                       # Src folder overview
│
├── docs/                               # Documentation
│   ├── API.md                          # API endpoints reference
│   ├── DATABASE.md                     # Database schema
│   ├── SETUP.md                        # Setup guide
│   └── DEPLOYMENT.md                   # Deployment guide
│
├── docker-compose.yml                  # Local development setup
├── Dockerfile                          # Production image
├── .github/
│   └── workflows/                      # CI/CD pipelines
│       ├── build.yml
│       ├── test.yml
│       └── deploy.yml
│
├── .gitignore
├── README.md
└── MONOLITHIC_ARCHITECTURE.md          # This file
```

---

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Python 3.9+
- PostgreSQL (or SQLite for development)
- Docker & Docker Compose (optional)

### 1. Install Dependencies

#### Backend Setup
```bash
cd src/server

# Create virtual environment
python -m venv venv

# Activate virtual environment
Windows: venv\Scripts\activate
Linux/Mac: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your configuration
```

#### Frontend Setup
```bash
cd src/client

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with API endpoint
```

### 2. Database Setup
```bash
cd src/server

# Create database tables
python -c "from app import create_app; from app import db; app = create_app(); app.app_context().push(); db.create_all()"

# (Optional) Load seed data
python scripts/seed_db.py
```

### 3. Run Development Servers

#### Terminal 1 - Backend Server
```bash
cd src/server
python run.py
# Server runs on http://localhost:5000
```

#### Terminal 2 - Frontend Development Server
```bash
cd src/client
npm start
# Client runs on http://localhost:3000
```

### 4. Using Docker Compose (Optional)
```bash
# From project root
docker-compose up -d

# Run migrations
docker-compose exec api python run.py

# Stop services
docker-compose down
```

---

## Development Workflow

### Feature Development Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Start Development Servers**
   - Run backend server (Terminal 1)
   - Run frontend dev server (Terminal 2)

3. **Backend Development**
   - Create/modify models in `src/server/app/models/`
   - Create/modify services in `src/server/app/services/`
   - Create/modify API routes in `src/server/app/api/routes/`
   - Test with Pytest

4. **Frontend Development**
   - Create/modify components in `src/client/src/components/`
   - Create/modify pages in `src/client/src/pages/`
   - Create/modify services in `src/client/src/services/`
   - Test with Jest/React Testing Library

5. **Testing**
   ```bash
   # Backend tests
   cd src/server
   pytest

   # Frontend tests
   cd src/client
   npm test
   ```

6. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add feature description"
   git push origin feature/feature-name
   ```

### API Development Guidelines

**Backend (Python)**
- All API routes should return JSON
- Use RESTful conventions
- Include proper error handling
- Document with docstrings and Swagger

**Frontend (React)**
- Create service files for API calls in `src/services/`
- Use Context API for state management
- Keep components focused and reusable
- Use TypeScript for type safety

### Example: Adding a New Feature

**1. Backend - Create Model** (`src/server/app/models/new_feature.py`)
```python
from app import db

class NewFeature(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    data = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

**2. Backend - Create Service** (`src/server/app/services/new_feature_service.py`)
```python
from app.models import NewFeature
from app import db

class NewFeatureService:
    @staticmethod
    def create_feature(user_id, data):
        feature = NewFeature(user_id=user_id, data=data)
        db.session.add(feature)
        db.session.commit()
        return feature
```

**3. Backend - Create Route** (`src/server/app/api/routes/new_feature.py`)
```python
from flask import Blueprint, jsonify, request
from app.services.new_feature_service import NewFeatureService

bp = Blueprint('new_feature', __name__, url_prefix='/api/new_feature')

@bp.route('/', methods=['POST'])
def create_feature():
    data = request.json
    feature = NewFeatureService.create_feature(user_id=1, data=data)
    return jsonify(feature.to_dict()), 201
```

**4. Frontend - Create Service** (`src/client/src/services/newFeatureService.ts`)
```typescript
import api from './api';

export const createFeature = async (data: any) => {
    const response = await api.post('/new_feature/', data);
    return response.data;
};
```

**5. Frontend - Create Component** (`src/client/src/components/NewFeature/NewFeature.tsx`)
```typescript
import React, { useState } from 'react';
import { createFeature } from '../../services/newFeatureService';

export const NewFeature = () => {
    const [data, setData] = useState('');

    const handleSubmit = async () => {
        await createFeature({ data });
    };

    return (
        <div>
            <input value={data} onChange={(e) => setData(e.target.value)} />
            <button onClick={handleSubmit}>Create</button>
        </div>
    );
};
```

---

## Build Process

### Frontend Build
```bash
cd src/client

# Create production build
npm run build
# Output: src/client/build/

# This creates optimized, minified files
```

### Backend Preparation
```bash
cd src/server

# Install production dependencies only
pip install -r requirements.txt --no-dev

# Collect static files
python manage.py collectstatic
```

### Monolithic Bundle Creation

The production build bundles both frontend and backend:

1. **Build React App**
   ```bash
   cd src/client
   npm run build
   ```

2. **Copy Built Frontend to Backend**
   ```bash
   cp -r src/client/build src/server/app/static/
   ```

3. **Configure Backend to Serve Frontend**
   Backend serves built React app at `/` and API at `/api/`

4. **Create Docker Image**
   ```bash
   docker build -t finveda:latest .
   ```

### Complete Build Script (`scripts/build.sh`)
```bash
#!/bin/bash
set -e

echo "Building Frontend..."
cd src/client
npm run build

echo "Copying frontend to backend..."
rm -rf ../server/app/static
cp -r build ../server/app/static

echo "Building Docker image..."
cd ../..
docker build -t finveda:latest .

echo "Build complete!"
```

---

## API Documentation

### API Structure

All API endpoints are prefixed with `/api/v1/`

### Authentication
- Uses JWT (JSON Web Tokens)
- Token in Authorization header: `Authorization: Bearer <token>`

### Main API Routes

#### Authentication (`/api/v1/auth/`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /refresh-token` - Refresh JWT token
- `POST /forgot-password` - Password reset request

#### User (`/api/v1/user/`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /settings` - Get user settings
- `PUT /settings` - Update user settings

#### Portfolio (`/api/v1/portfolio/`)
- `GET /` - List user portfolios
- `POST /` - Create new portfolio
- `GET /<id>` - Get portfolio details
- `PUT /<id>` - Update portfolio
- `DELETE /<id>` - Delete portfolio
- `POST /<id>/rebalance` - Rebalance portfolio

#### Dashboard (`/api/v1/dashboard/`)
- `GET /metrics` - Get dashboard metrics
- `GET /performance` - Get performance data
- `GET /allocation` - Get asset allocation

#### Transactions (`/api/v1/transactions/`)
- `GET /` - List transactions
- `POST /` - Add transaction
- `GET /<id>` - Get transaction details
- `PUT /<id>` - Update transaction
- `DELETE /<id>` - Delete transaction

#### Risk (`/api/v1/risk/`)
- `GET /profile` - Get risk profile
- `POST /profile/assess` - Assess risk tolerance
- `GET /analysis` - Get risk analysis

#### Tax (`/api/v1/tax/`)
- `GET /records` - Get tax records
- `POST /records` - Add tax record
- `GET /optimization` - Get tax optimization suggestions

#### Projections (`/api/v1/projections/`)
- `POST /calculate` - Calculate projections
- `GET /scenarios` - Get scenario analysis

#### Goals (`/api/v1/goals/`)
- `GET /` - List goals
- `POST /` - Create goal
- `PUT /<id>` - Update goal
- `GET /<id>/progress` - Get goal progress

#### Alerts (`/api/v1/alerts/`)
- `GET /` - List alerts
- `POST /` - Create alert
- `DELETE /<id>` - Delete alert

#### Behavioral (`/api/v1/behavioral/`)
- `GET /analysis` - Get behavioral analysis
- `POST /insights` - Get behavioral insights

---

## Database Schema

### Key Tables

**Users**
- id (PK)
- email (UNIQUE)
- password_hash
- first_name
- last_name
- created_at
- updated_at

**Portfolios**
- id (PK)
- user_id (FK)
- name
- description
- created_at
- updated_at

**Holdings**
- id (PK)
- portfolio_id (FK)
- symbol (ticker)
- quantity
- purchase_price
- purchase_date
- created_at

**Transactions**
- id (PK)
- user_id (FK)
- portfolio_id (FK)
- transaction_type (BUY/SELL/DIVIDEND)
- symbol
- quantity
- price
- date
- notes

**Alerts**
- id (PK)
- user_id (FK)
- alert_type
- condition
- threshold
- active
- created_at

**Goals**
- id (PK)
- user_id (FK)
- goal_type
- target_amount
- target_date
- current_amount
- created_at

**RiskProfiles**
- id (PK)
- user_id (FK)
- risk_score (1-10)
- profile_type
- created_at
- updated_at

**TaxRecords**
- id (PK)
- user_id (FK)
- tax_year
- capital_gains
- losses
- other_income

---

## Authentication & Security

### JWT Authentication Flow

```
1. User submits credentials
   POST /api/v1/auth/login { email, password }
   
2. Server validates and returns tokens
   { accessToken, refreshToken }
   
3. Client stores tokens
   localStorage or sessionStorage
   
4. Client includes accessToken in requests
   Authorization: Bearer <accessToken>
   
5. Server validates token in middleware
   Grants/denies access based on validity
   
6. Token expiry triggers refresh
   POST /api/v1/auth/refresh-token { refreshToken }
```

### Security Best Practices

**Backend**
- ✅ Hash passwords with bcrypt
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Validate all inputs
- ✅ Use CORS selectively
- ✅ Implement CSRF protection
- ✅ Log security events

**Frontend**
- ✅ Never store sensitive data in localStorage
- ✅ Use httpOnly cookies for tokens (if applicable)
- ✅ Validate user input
- ✅ Implement proper error handling
- ✅ Use Content Security Policy (CSP)
- ✅ Update dependencies regularly

### Environment Variables

**Backend `.env`**
```
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost/finveda
JWT_SECRET=your-jwt-secret
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-password
```

**Frontend `.env.local`**
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

---

## Deployment

### Production Deployment Steps

#### 1. Prepare Environment
```bash
# Set production environment variables
export FLASK_ENV=production
export DATABASE_URL=postgresql://prod-user:pass@prod-host/finveda
export SECRET_KEY=<strong-random-key>
```

#### 2. Build Application
```bash
# Build frontend
cd src/client
npm install
npm run build

# Copy to backend
cp -r build ../server/app/static

# Install backend dependencies
cd ../server
pip install -r requirements.txt
```

#### 3. Docker Deployment
```bash
# Build image
docker build -t finveda:1.0.0 .

# Run container
docker run -d \
  -e DATABASE_URL=postgresql://... \
  -e SECRET_KEY=... \
  -p 80:5000 \
  finveda:1.0.0
```

#### 4. Docker Compose for Production
```yaml
version: '3.8'
services:
  db:
    image: postgres:13
    environment:
      POSTGRES_DB: finveda
      POSTGRES_USER: finveda
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/postgresql/data

  api:
    build: .
    environment:
      DATABASE_URL: postgresql://finveda:${DB_PASSWORD}@db/finveda
      SECRET_KEY: ${SECRET_KEY}
    ports:
      - "80:5000"
    depends_on:
      - db

volumes:
  db_data:
```

### CI/CD Pipeline (GitHub Actions)

**`.github/workflows/deploy.yml`**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Frontend
        run: cd src/client && npm install && npm run build
      
      - name: Build Backend
        run: cd src/server && pip install -r requirements.txt
      
      - name: Run Tests
        run: cd src/server && pytest
      
      - name: Deploy to Production
        run: |
          docker build -t finveda:latest .
          docker push ${{ secrets.DOCKER_REGISTRY }}/finveda:latest
          # Deploy to production server
```

### Monitoring & Logging

- Use centralized logging: ELK Stack, Datadog, or CloudWatch
- Monitor application performance with APM tools
- Set up alerts for errors and performance issues
- Use structured logging for easier debugging

---

## Development Guidelines

### Code Standards

**Python**
- Follow PEP 8
- Use type hints where possible
- Use docstrings for functions/classes
- Maximum line length: 100 characters

**JavaScript/TypeScript**
- Use ESLint configuration
- Follow Airbnb style guide
- Use Prettier for formatting
- Use TypeScript for type safety

### Git Commit Messages

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add/update tests
chore: maintenance tasks
```

### Code Review Process

1. Create pull request with clear description
2. Request code review from team members
3. Address feedback and comments
4. Ensure all CI checks pass
5. Merge to main branch

### Testing Requirements

- Frontend: Minimum 70% code coverage
- Backend: Minimum 80% code coverage
- All tests must pass before merge

---

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

**Database Connection Error**
```bash
# Check PostgreSQL is running
psql --version

# Verify connection string in .env
# Test connection: psql $DATABASE_URL
```

**Frontend Can't Connect to Backend**
```bash
# Check backend is running
# Check REACT_APP_API_URL in .env.local
# Check CORS configuration in backend
```

**Dependencies Issue**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules
npm install

# Clear pip cache
pip cache purge
pip install -r requirements.txt
```

---

## Performance Optimization

### Frontend
- Implement code splitting
- Use React.lazy() for lazy loading
- Optimize images with WebP
- Implement service workers for caching
- Monitor bundle size

### Backend
- Add database indexing
- Implement caching (Redis)
- Use connection pooling
- Optimize queries with pagination
- Monitor API response times

### Deployment
- Use CDN for static files
- Enable gzip compression
- Implement load balancing
- Set up auto-scaling
- Monitor server resources

---

## Next Steps

1. **Initialize Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial monolithic architecture setup"
   ```

2. **Set Up CI/CD Pipeline**
   - Configure GitHub Actions
   - Set up automated testing
   - Enable automatic deployments

3. **Begin Feature Development**
   - Start with authentication system
   - Implement dashboard
   - Add portfolio management

4. **Deploy to Staging**
   - Test in staging environment
   - Gather user feedback
   - Fix issues before production

---

## Resources & References

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy ORM](https://www.sqlalchemy.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [REST API Best Practices](https://restfulapi.net/)
- [JWT Authentication](https://jwt.io/)

---

**Last Updated**: February 15, 2026  
**Architecture Version**: 1.0  
**Status**: Ready for Development
