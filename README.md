#WebAura

This is a NextJS based project developed with the help of Gemini API.

To get started, take a look at src/app/page.tsx.

## Running Locally

To run this application on your local machine, follow these steps:

### 1. Install Dependencies

First, you need to install all the necessary packages. Open your terminal in the project's root directory and run:

```bash
npm install
```

### 2. Set Up Environment Variables

This project uses Google's Generative AI. You will need a Gemini API key to run the AI-powered features.

1.  Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).
2.  Create a new file named `.env` in the root of your project.
3.  Add your API key to the `.env` file like this:

    ```
    GEMINI_API_KEY=<YOUR_GEMINI_API_KEY>
    ```

    Replace `<YOUR_GEMINI_API_KEY>` with the key you obtained.

### 3. Run the Development Servers

This application requires two development servers to be running simultaneously: one for the Next.js frontend and one for the Genkit AI flows.

1.  **Start the Next.js server:**
    Open a terminal and run:

    ```bash
    npm run dev
    ```

    Your application will be available at `http://localhost:3000`.

2.  **Start the Genkit server:**
    Open a *second* terminal and run:

    ```bash
    npm run genkit:watch
    ```

    This command starts the Genkit flows and will automatically restart if you make any changes to the AI flow files.

Now you can access your application in your browser and all features should be working.
