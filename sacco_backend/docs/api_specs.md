# SACCO System API Documentation

## Authentication
### Register Member
- **POST** `/api/auth/register`
- **Body**: Member registration details
- **Response**: Member details with auth tokens

### Login
- **POST** `/api/auth/login`
- **Body**: `{username, password}`
- **Response**: Auth tokens

## Member Management
### Create Member
- **POST** `/api/members`
- **Headers**: Authorization token
- **Body**: Member details
- **Response**: Created member object

### Update Member
- **PUT** `/api/members/{id}`
- **Headers**: Authorization token
- **Body**: Updated member details
- **Response**: Updated member object

## Loan Management
### Apply for Loan
- **POST** `/api/loans/apply`
- **Headers**: Authorization token
- **Body**: Loan application details
- **Response**: Loan application status

### Get Loan Status
- **GET** `/api/loans/{id}`
- **Headers**: Authorization token
- **Response**: Loan details with status

## Savings Management
### Create Account
- **POST** `/api/savings`
- **Headers**: Authorization token
- **Body**: Account details
- **Response**: Created account object

### Make Transaction
- **POST** `/api/transactions`
- **Headers**: Authorization token
- **Body**: Transaction details
- **Response**: Transaction confirmation
