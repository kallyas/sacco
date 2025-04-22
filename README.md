# SACCO Application

![GitHub last commit](https://img.shields.io/github/last-commit/kallyas/sacco)
![GitHub repo size](https://img.shields.io/github/repo-size/kallyas/sacco)
![GitHub language count](https://img.shields.io/github/languages/count/kallyas/sacco)
![GitHub top language](https://img.shields.io/github/languages/top/kallyas/sacco)

## Overview

This project is a comprehensive SACCO (Savings and Credit Cooperative) application designed to manage member information, savings, loans, transactions, and reporting. It consists of the following components:

- A robust **backend** built using Django Rest Framework.
- A modern **frontend** developed with React and TypeScript.
- A **mobile application** built with Flutter for cross-platform compatibility.

---

## Table of Contents

1. [Features](#features)
2. [System Architecture](#system-architecture)
3. [Tech Stack](#tech-stack)
4. [Installation](#installation)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
   - [Mobile Application Setup](#mobile-application-setup)
5. [Configuration](#configuration)
6. [Usage](#usage)
   - [Backend](#backend-usage)
   - [Frontend](#frontend-usage)
   - [Mobile Application](#mobile-application-usage)
7. [API Documentation](#api-documentation)
8. [Roadmap](#roadmap)
9. [Frequently Asked Questions](#frequently-asked-questions)
10. [Contributing](#contributing)
11. [License](#license)
12. [Contact](#contact)

---

## Features

### Core Functionality
- **Member Management**: Complete registration, KYC verification, and profile management
- **Savings Management**: Track deposits, withdrawals, and account balances
- **Loan Processing**: Application, approval workflows, repayment tracking, and interest calculation
- **Transaction Management**: Secure recording and tracking of all financial transactions
- **Reporting & Analytics**: Comprehensive financial reports and member statistics

### Backend Capabilities
- **Secure Authentication**: JWT-based authentication with role-based access control
- **RESTful API Design**: Well-documented endpoints following best practices
- **Advanced Permissions**: Granular permission system for admins, staff, and members
- **Automatic Notifications**: Email and SMS integration for important updates
- **Audit Trail**: Complete logging of all system activities for compliance

### Frontend Features
- **Responsive Dashboard**: Clean, intuitive interface that works on all screen sizes
- **Real-time Updates**: Live data refreshing without page reloads
- **Advanced Filtering**: Powerful search and filter options for data management
- **Interactive Charts**: Visual representation of financial data
- **Dark/Light Modes**: Support for user preference and accessibility

### Mobile Application Highlights
- **Biometric Authentication**: Secure login with fingerprint/face recognition
- **Offline Capability**: Basic functionality even without internet connection
- **Push Notifications**: Real-time alerts for account activities
- **QR Code Integration**: Easy payments and information sharing
- **Low Data Usage**: Optimized for areas with limited connectivity

---

## System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │◄────┤   Django REST   │◄────┤   PostgreSQL    │
│  (TypeScript)   │     │     Backend     │     │    Database     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         ▲                      ▲
         │                      │
         ▼                      │
┌─────────────────┐             │
│                 │             │
│ Flutter Mobile  │◄────────────┘
│ (iOS & Android) │
│                 │
└─────────────────┘
```

---

## Tech Stack

### Backend
- **Language**: Python 3.10+
- **Framework**: Django 4.x, Django Rest Framework 3.x
- **Authentication**: JWT, OAuth2
- **Testing**: Pytest, Django Test Suite
- **Task Queue**: Celery with Redis
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Language**: TypeScript 4.x
- **Framework**: React 18.x with Hooks
- **Build Tool**: Vite
- **State Management**: Redux Toolkit or React Query
- **UI Library**: Material UI or Tailwind CSS
- **Testing**: Jest, React Testing Library

### Mobile Application
- **Framework**: Flutter 3.x
- **Language**: Dart 2.x
- **State Management**: Provider or Riverpod
- **Local Storage**: Hive or SQLite
- **API Client**: Dio or HTTP package

### Database & Storage
- **Primary Database**: PostgreSQL 14+
- **Cache**: Redis
- **File Storage**: AWS S3 or local storage

### DevOps & Deployment
- **CI/CD**: GitHub Actions
- **Containerization**: Docker, Docker Compose
- **Hosting Options**: AWS, Digital Ocean, Heroku
- **Monitoring**: Sentry for error tracking

---

## Installation

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/kallyas/sacco.git
   cd sacco/sacco_backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # Linux/macOS
   venv\Scripts\activate     # Windows
   ```

3. Install dependencies:
   ```bash
   pip install -r config/requirements/development.txt
   ```

4. Set up environment variables (create a `.env` file based on `.env.example`):
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and other settings
   ```

5. Set up the database:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Run the development server:
   ```bash
   python manage.py runserver
   ```

For more details, see the [Backend README](sacco_backend/README.md).

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../sacco_frontend
   ```

2. Install dependencies:
   ```bash
   npm install  # or yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API URL and other settings
   ```

4. Start the development server:
   ```bash
   npm run dev  # or yarn dev
   ```

For more details, see the [Frontend README](sacco_frontend/README.md).

### Mobile Application Setup
1. Navigate to the mobile directory:
   ```bash
   cd ../sacco_mobile
   ```

2. Install Flutter dependencies:
   ```bash
   flutter pub get
   ```

3. Set up environment configuration:
   ```bash
   cp lib/config/env.example.dart lib/config/env.dart
   # Edit env.dart with your API URL and other settings
   ```

4. Run the application:
   ```bash
   flutter run
   ```

For more details, see the [Mobile README](sacco_mobile/README.md).

## Configuration

### Backend Configuration
The backend can be configured through environment variables in the `.env` file:

```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:password@localhost:5432/sacco_db
ALLOWED_HOSTS=localhost,127.0.0.1
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@example.com
EMAIL_HOST_PASSWORD=your-email-password
```

### Frontend Configuration
Configure the frontend via environment variables in `.env.local`:

```
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=SACCO App
VITE_ENABLE_ANALYTICS=false
```

### Mobile Configuration
Configure the mobile app via `lib/config/env.dart`:

```dart
class Environment {
  static const String apiUrl = 'http://10.0.2.2:8000/api';
  static const bool enableAnalytics = false;
  static const String appName = 'SACCO Mobile';
}
```

---

## Usage

### Backend Usage
- Access the Django admin panel at `http://127.0.0.1:8000/admin/` and log in with superuser credentials
- API endpoints are available at `http://127.0.0.1:8000/api/`
- Swagger documentation is at `http://127.0.0.1:8000/api/docs/`

**Common Management Commands:**

```bash
# Create database backups
python manage.py dbbackup

# Generate reports
python manage.py generate_monthly_reports

# Run tests
python manage.py test
```

### Frontend Usage
- Open your browser and navigate to `http://localhost:5173/`
- Login using admin or member credentials
- Dashboard navigation:
  - **Overview**: General statistics and activity feed
  - **Members**: Member management and profiles
  - **Savings**: Deposit and withdrawal tracking
  - **Loans**: Loan application review and management
  - **Reports**: Generate financial and membership reports
  - **Settings**: System configuration

### Mobile Application Usage
- Install the app on your Android or iOS device
- Log in using your member credentials
- Main features:
  - View account balance and transaction history
  - Make savings deposits via mobile money integration
  - Apply for loans and track approval status
  - Receive transaction notifications
  - Update personal information

---

## API Documentation

Full API documentation is available via Swagger UI. When the backend server is running, visit:
`http://localhost:8000/api/docs/`

Key API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login/` | POST | Authenticate users and receive JWT |
| `/api/members/` | GET, POST | List or create members |
| `/api/members/{id}/` | GET, PUT, DELETE | Retrieve, update or delete member |
| `/api/savings/` | GET, POST | List or create savings transactions |
| `/api/loans/` | GET, POST | List or create loan applications |
| `/api/reports/` | GET | Generate various financial reports |

---

## Roadmap

### Q3 2025
- [ ] Multi-language support
- [ ] Advanced reporting features
- [ ] Mobile money integration

### Q4 2025
- [ ] Biometric authentication
- [ ] Bulk transaction processing
- [ ] AI-powered loan risk assessment

---

## Frequently Asked Questions

### General Questions

**Q: Can this application be used by multiple SACCOs?**
A: Yes, the system is designed with multi-tenancy in mind. Each SACCO can have its own isolated data.

**Q: Is there a cloud-hosted option available?**
A: Not yet, but we plan to offer a SaaS version in the future.

### Technical Questions

**Q: Can I use MySQL instead of PostgreSQL?**
A: Yes, the application supports multiple database backends through Django's ORM.

**Q: How do I deploy this to production?**
A: Check out our [production deployment guide](docs/deployment.md) for details.

---

## Contributing

We welcome contributions to enhance this SACCO application! Here's how you can contribute:

1. Fork the repository
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -am 'Add some feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Submit a pull request

### Development Guidelines
- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) for Python code
- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Add tests for new features
- Update documentation as necessary

Please check out our [Contributing Guide](CONTRIBUTING.md) for more detailed information.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

- **Project Maintainer**: [Kallyas](https://github.com/kallyas) (info@tumuhirwe.dev)
- **GitHub Issues**: For bug reports and feature requests, please use [GitHub Issues](https://github.com/kallyas/sacco/issues)
