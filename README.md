# SACCO Application

## Introduction

This project is a comprehensive SACCO (Savings and Credit Cooperative) application designed to manage member information, savings, loans, transactions, and reporting. It consists of a robust backend built with Django Rest Framework and a user-friendly frontend developed using React.

## Installation

### Backend (Django)

1.  **Clone the repository:**
```
bash
    git clone <repository-url>
    cd sacco_backend
    
```
2.  **Create and activate a virtual environment:**
```
bash
    python3 -m venv venv
    source venv/bin/activate  # On Linux/macOS
    venv\Scripts\activate  # On Windows
    
```
3.  **Install dependencies:**
```
bash
    pip install -r config/requirements/development.txt
    
```
4.  **Set up the database:**
```
bash
    python manage.py migrate
    
```
5.  **Create a superuser:**
```
bash
    python manage.py createsuperuser
    
```
6.  **Run the development server:**
```
bash
    python manage.py runserver
    
```
### Frontend (React)

1.  **Navigate to the frontend directory:**
```
bash
    cd ../sacco_frontend
    
```
2.  **Install dependencies:**
```
bash
    npm install  # or yarn install
    
```
3.  **Start the development server:**
```
bash
    npm start  # or yarn start
    
```
## Usage

### Backend (Django)

*   Access the Django admin panel at `http://127.0.0.1:8000/admin/` and log in with the superuser credentials.
*   Explore the API endpoints documented in `sacco_backend/docs/api.md`.
*   Use tools like Postman or curl to interact with the API.

### Frontend (React)

*   Open your web browser and go to `http://localhost:5173/` (or the port specified by the frontend development server).
*   Navigate through the application using the provided user interface.
*   Login using your member details or login in as the admin.

## Contributing

We welcome contributions to enhance this SACCO application! Here's how you can contribute:

1.  **Fork the repository.**
2.  **Create a new branch for your feature or bug fix:**
```
bash
    git checkout -b feature/your-feature-name
    
```
or
```
bash
    git checkout -b bugfix/your-bug-fix-name
    
```
3.  **Make your changes and commit them:**
```
bash
    git commit -am 'Add some feature'
    
```
4.  **Push to the branch:**
```
bash
    git push origin feature/your-feature-name
    
```
5.  **Submit a pull request.**

Please ensure your code adheres to the project's coding style and that all tests pass before submitting a pull request.