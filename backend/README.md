# Portfolio Backend API

Backend API for Arwa's Portfolio Contact Form built with Node.js, Express, and MongoDB.

## Features

- 📧 Contact form submission
- 📊 Message management and statistics
- 🔒 Rate limiting to prevent spam
- ✅ Data validation and sanitization
- 📱 RESTful API design
- 🗄️ MongoDB integration with Mongoose

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - API rate limiting

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB connection string

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Contact Form
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact messages (admin)
- `GET /api/contact/:id` - Get single contact message
- `PATCH /api/contact/:id/status` - Update contact status
- `DELETE /api/contact/:id` - Delete contact message
- `GET /api/contact/stats/summary` - Get contact statistics

### Health Check
- `GET /api/health` - Check API status

## Contact Form Submission

```javascript
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "Hello, I'm interested in your services...",
  "phone": "+1234567890", // optional
  "company": "Company Name" // optional
}
```

## Response Format

```javascript
{
  "success": true,
  "message": "Thank you for your message! I will get back to you soon.",
  "data": {
    "id": "contact_id",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "submittedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

## Rate Limiting

- Contact form submissions are limited to 3 requests per 15 minutes per IP
- This helps prevent spam and abuse

## Database Schema

The Contact model includes:
- **name** (required) - Contact person's name
- **email** (required) - Contact email address
- **subject** (required) - Message subject
- **message** (required) - Message content
- **phone** (optional) - Phone number
- **company** (optional) - Company name
- **status** - Message status (new, read, replied, archived)
- **isRead** - Read status
- **readAt** - When message was read
- **timestamps** - Created and updated dates

## Development Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
NODE_ENV=development
PORT=9999
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/portfolio-contacts
```

## Production Deployment

1. Build the frontend from the repository root:
   ```bash
   npm install
   npm run build
   ```
2. In the `backend` directory, install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Set `NODE_ENV=production` and a production `MONGODB_URI`.
4. If the frontend is served from the same host, use `VITE_API_URL=/api` in the frontend `.env`.
5. Set `CORS_ORIGIN` to your deployed app origin(s), or leave it with the localhost defaults for local testing.
6. Start the backend server:
   ```bash
   npm start
   ```

## Security Features

- Input validation and sanitization
- Rate limiting for contact form
- CORS configuration
- Error handling without exposing sensitive data
- IP address logging for security monitoring

## Future Enhancements

- [ ] Email notifications for new messages
- [ ] Admin authentication
- [ ] Email templates for auto-responses
- [ ] Message categories/tags
- [ ] Attachment support
- [ ] Admin dashboard

## Author

**Arwa MohamedSalah** - ITI Frontend & Cross-Platform Development Graduate

## License

MIT License