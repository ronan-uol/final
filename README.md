# Uol final project

## Instructions

To run this project, complete the following steps:

1. Run `npm install`
2. Run the database migrations with `npm run migrate:dev`
3. Create a .env file in the root directory and add to the .env file the following keys:

DATABASE_URL="file:./data.db?connection_limit=1"
COOKIE_SECRET=<COOKIE_SECRET> // Create a string to use here
OPENAI_KEY=<OPENAI_KEY> // Use an openai key
PEXEL_KEY=<PEXEL_KEY> // Use an api key from [pexels](https://www.pexels.com/api/)

4. Run `npm run dev`
5. Visit `localhost:5173` in your browser
