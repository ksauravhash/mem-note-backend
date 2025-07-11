# MemNote Backend

MemNote Backend is the server-side component of the MemNote application, providing APIs for user authentication, spaced repetition logic, data storage, and Mynt file import functionality.

## Features

- 🌐 **REST API**: Provides endpoints for managing users, notebooks, notes, and contacts.
- 🔐 **JWT Authentication**: Secure user authentication with access and refresh tokens.
- 🛢️ **MongoDB Database**: Efficient storage for user data and flashcards.
- 🚀 **Express.js + TypeScript**: A robust and scalable backend framework.
- 🌍 **CORS Support**: Configurable to allow requests from the frontend.
- 📂 **Mynt File Import**: Supports importing notes from Mynt files.

## Tech Stack

- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JSON Web Tokens (JWT)](https://jwt.io/)
- [Mynt Handler](https://www.npmjs.com/package/mynt-handler) (for Mynt file import)

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
   PORT=port
   DB_NAME=your_db_name
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_CLUSTER_URL=your_mongodb_cluster_url
   JWT_KEY=your_jwt_secret_key
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   FRONTEND_URLS=frontend_server_url
   CLIENT_ID=your_client_id
   CLIENT_SECRET=your_client_secret
   USER_EMAIL=your_user_email
   REDIRECT_URI=your_redirect_uri
   REDIRECT_LINK_2=your_redirect_link_2
   FROM_EMAIL=your_from_email
   APP_PASSWORD=your_app_password
   ```

4. Start the development server:

   ```sh
   npm run dev  # or yarn dev
   ```

## API Endpoint Groups

- **User Endpoints (`/user`)**: Handles authentication, user registration, and profile management.
- **Notebook Endpoints (`/notebook`)**: Manages user notebooks for organizing notes.
- **Note Endpoints (`/note`)**: Provides CRUD operations for individual notes and Mynt file import.
- **Contact Endpoints (`/contact`)**: Handles user contact-related functionalities.
- **Test Endpoint (`/test`)**: A simple endpoint to test server connectivity.

## Mynt File Import

The backend supports importing Mynt files, allowing users to add notes from Mynt-formatted files seamlessly.

- The Mynt file is processed in chunks to optimize performance.
- Notes are extracted and stored in the database efficiently.

## Contributing

Contributions are welcome! If you'd like to improve MemNote Backend, feel free to submit a pull request or open an issue.

## License

MemNote Backend is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for more details.

## Contact

For questions or suggestions, feel free to reach out via GitHub issues or discussions.