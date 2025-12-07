Fibo Scene Generator : 

A web application that generates scenes and visuals based on user prompts using OpenAI APIs. Built for hackathon projects with a modern React + Tailwind frontend and Node + Express backend.



Features

Generate scene descriptions from user prompts
Demo mode for safe testing without exposing API keys
JSON-based output for scene rendering
History of generated scenes stored in-memory
Modular frontend and backend for easy expansion

Tech Stack

Frontend:
React 18 + Vite
Tailwind CSS

Backend:
Node.js + Express
OpenAI API integration

Other Tools:
npm / yarn
Git & GitHub

Installation 
Clone the repository:

git clone https://github.com/VijayPawar09/Fibo_Scene_Generator.git
cd Fibo_Scene_Generator

Server Setup
cd server
npm install
cp .env.example .env   # Create your own .env file
npm run dev


Client Setup
cd ../client
npm install
npm run dev


Usage

Open the app in your browser
Enter a prompt describing the scene you want
Click Generate to get the JSON-based scene output
View history in the History panel


License

This project is open-source and available under the MIT License.