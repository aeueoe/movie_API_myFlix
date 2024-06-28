# MyFlix API

This application provides access to information about different movies, directors, and genres. Users can sign up, update their personal information, and create a list of their favorite movies.

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the API](#running-the-api)
- [Error Handling](#error-handling)
- [Authentication](#authentication)
- [Hosting](#hosting)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- MongoDB Atlas account or a local MongoDB instance
- Vercel account for hosting (optional)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/movie_API_myFlix.git
   cd myflix-api
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your MongoDB connection string:

   ```sh
   CONNECTION_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/myFlixDB?retryWrites=true&w=majority
   ```

4. Optionally, add a port to your `.env` file:
   ```sh
   PORT=8080
   ```

## Running the API

Start the server with the following command:

```sh
node index.js
```

By default, the server will run on `http://localhost:8080`.

## Endpoints

The API is hosted on VErcel at: [https://movieapi-aeueoes-projects.vercel.app/](https://movieapi-aeueoes-projects.vercel.app/)

### Movies

- **GET /movies**

  - Returns a list of all movies.
  - Authentication required.
  - Example: `https://movieapi-aeueoes-projects.vercel.app//movies`

- **GET /movies/:Title**

  - Returns data about a single movie by title.
  - Authentication required.
  - Example: `https://movieapi-aeueoes-projects.vercel.app/movies/Fight%20Club`


### Users

- **GET /users**

  - Returns a list of all users.
  - Authentication required.
  - Example: `https://movieapi-aeueoes-projects.vercel.app/users`

- **GET /users/:Username**

  - Returns data about a user by username.
  - Authentication required.
  - Example: `https://movieapi-aeueoes-projects.vercel.app/users/jerry`

- 
- **DELETE /users/:Username**
  - Allows existing users to deregister.
  - Authentication required.
  - Example: `https://movieapi-aeueoes-projects.vercel.app/users/jerry`

## Error Handling

Errors are handled by a centralized middleware function that captures errors and sends a JSON response with an appropriate status code and message.

## Authentication

This API uses JWT (JSON Web Token) for authentication. To access protected routes, you need to include a valid JWT token in the `Authorization` header of your requests.

### Login

To log in and receive a JWT token, use the following endpoint:

- **POST /login**
  - Request body parameters: `Username`, `Password`.
  - Example: `https://movieapi-aeueoes-projects.vercel.app/login`

## Hosting

The MyFlix API is hosted on Vercel. Live: [https://movieapi-aeueoes-projects.vercel.app/](https://movieapi-aeueoes-projects.vercel.app/)
