# API Routes

This folder contains backend endpoints.

Responsibilities:
- Receive requests
- Validate input
- Call services
- Return responses

Avoid:
- Database logic
- Large business logic
- Complex calculations

Example:

POST /api/auth/register
POST /api/auth/login
POST /api/transactions
GET  /api/balance