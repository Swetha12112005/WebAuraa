# **App Name**: Action Planner

## Core Features:

- Instruction Parser: Parses natural language instructions into actionable steps using a local LLM tool.
- Action Planner: Breaks down complex instructions into a sequence of tasks for browser automation.
- Browser Automation: Automates browser tasks (search, navigation, data extraction) using Playwright.
- Result Extraction: Extracts structured data (text, links) from web pages.
- Data Presentation: Displays extracted data in a clean, user-friendly format (console table or JSON).
- Error Handling: Implements error handling for common issues such as failed searches and missing results.
- Task History: Maintains a short history of recent user instructions to improve context awareness. A local vector store holds embeddings of prior instructions. New prompts and the existing history are concatenated into an updated prompt for the LLM tool.

## Style Guidelines:

- Primary color: Vivid blue (#4285F4) to convey intelligence and focus.
- Background color: Light gray (#F5F5F5) for a clean, modern look.
- Accent color: Teal (#009688) to highlight important information and calls to action.
- Body and headline font: 'Inter', a sans-serif font for a modern, machined, objective feel.
- Simple, line-based icons to represent actions and data types.
- Clean, minimalist layout with clear separation of input, processing, and output sections.
- Subtle animations to indicate processing and loading states.