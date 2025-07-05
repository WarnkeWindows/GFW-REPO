# GFE API Endpoints

## Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/status` - Check auth status

## Quotes
- `GET /api/quotes` - Get all quotes
- `POST /api/quotes` - Create new quote
- `GET /api/quotes/{id}` - Get specific quote
- `PUT /api/quotes/{id}` - Update quote

## Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create new lead

## Products
- `GET /api/products` - Get product catalog
- `GET /api/products/{id}` - Get specific product

## AI Services
- `POST /api/ai/estimate` - Get AI estimation
- `POST /api/chat` - Chat with AI assistant

## Customer Portal
- `GET /api/customer/profile` - Get customer profile
- `PUT /api/customer/profile` - Update customer profile
- `GET /api/customer/projects` - Get customer projects
