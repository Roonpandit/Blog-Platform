# Blog Platform

A full-stack blog platform built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (login, register, logout)
- Create, read, update, and delete blog posts
- Like and comment on posts
- User profiles with followers/following
- Admin dashboard for user and post management
- Responsive design with modern UI

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

## Project Structure

```
blog-platform/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   ├── store/       # Redux store
│   │   └── ...
│   └── package.json
└── backend/           # Node.js backend
    ├── controllers/   # Route controllers
    ├── models/        # MongoDB models
    ├── routes/        # API routes
    └── package.json
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update user profile

### Posts
- GET `/api/posts` - Get all posts
- GET `/api/posts/:id` - Get a single post
- POST `/api/posts` - Create a new post
- PUT `/api/posts/:id` - Update a post
- DELETE `/api/posts/:id` - Delete a post
- POST `/api/posts/:id/like` - Like/unlike a post

### Comments
- GET `/api/posts/:id/comments` - Get post comments
- POST `/api/posts/:id/comments` - Add a comment
- PUT `/api/comments/:id` - Update a comment
- DELETE `/api/comments/:id` - Delete a comment

### Users
- GET `/api/users/:id` - Get user profile
- POST `/api/users/:id/follow` - Follow a user
- POST `/api/users/:id/unfollow` - Unfollow a user

### Admin
- GET `/api/admin/users` - Get all users
- GET `/api/admin/posts` - Get all posts
- DELETE `/api/admin/users/:id` - Delete a user
- DELETE `/api/admin/posts/:id` - Delete a post
- PUT `/api/admin/users/:id/role` - Update user role

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.