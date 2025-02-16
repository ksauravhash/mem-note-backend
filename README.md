# MemNote Backend

MemNote Backend is the server-side component of the MemNote application, providing APIs for user authentication, spaced repetition logic, and data storage.

## Features

- 🌐 **REST API**: Provides endpoints for managing users, notebooks, and notes.
- 🔐 **JWT Authentication**: Secure user authentication with access and refresh tokens.
- 🛢️ **MongoDB Database**: Efficient storage for user data and flashcards.
- 🚀 **Express.js + TypeScript**: A robust and scalable backend framework.
- 🌍 **CORS Support**: Configurable to allow requests from the frontend.

## Tech Stack

- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JSON Web Tokens (JWT)](https://jwt.io/)

## Getting Started

### Prerequisites
Make sure you have the following installed:
- Node.js (v22+ recommended)
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/ksauravhash/mem-note-backend.git
   cd mem-note-backend
   ```

2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=5000
   DB_NAME=your_db_name
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_CLUSTER_URL=your_mongodb_cluster_url
   JWT_KEY=your_jwt_secret_key
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   FRONTEND_URLS=http://localhost:5173
   ```

4. Start the development server:
   ```sh
   npm run dev  # or yarn dev
   ```

## API Endpoint Groups

- **User Endpoints**: Handles authentication, user registration, and profile management.
- **Notebook Endpoints**: Manages user notebooks for organizing notes.
- **Note Endpoints**: Provides CRUD operations for individual notes.
- **Test Endpoint**: A simple endpoint to test server connectivity.

## Contributing

Contributions are welcome! If you'd like to improve MemNote Backend, feel free to submit a pull request or open an issue.

## License

MemNote Backend is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for more details.

## Contact

For questions or suggestions, feel free to reach out via GitHub issues or discussions.

