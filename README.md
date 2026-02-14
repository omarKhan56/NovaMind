NovaMind – AI Chat Assistant
<div align="center">
Show Image
A clean, modern AI chatbot powered by Google Gemini API, built with React.js.
Ask anything. Get instant answers. No setup hassle.
<br>
<img width="874" height="869" alt="Screenshot 2026-02-01 025021" src="https://github.com/user-attachments/assets/59fceb4f-fa0c-436b-8b1d-e37b9abd03bd" />

</div>

✨ Features 

Real-time AI Chat — Instant responses powered by Google Gemini API

Multi-turn Conversations — Maintains full context across the entire chat

Markdown Rendering — Supports bold, italic, code blocks, and lists in responses

Typing Indicator — Animated dots show when the AI is generating a response

Stop Generation — Cancel a response mid-way with the stop button

Suggestion Chips — Quick-start prompts on the welcome screen

Responsive UI — Clean dark-themed design that works on all screen sizes

Auto-scroll — Chat automatically scrolls to the latest message


📂 Folder Structure

novamind/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx          ← Entry point, renders NovaMind
│   ├── App.css          ← Empty (styles are inside NovaMind)
│   ├── main.jsx         ← React root
│   └── NovaMind.jsx     ← Main app component (all logic + styles)
├── .env                 ← Your secret Gemini API key (not pushed to GitHub)
├── .gitignore
├── package.json
├── README.md
└── vite.config.js

🛠️ Tech Stack
TechnologyPurposeReact.jsUI framework and component structureJavaScriptApp logic and API handlingGoogle Gemini APIAI model powering the chatbotViteProject bundler and dev serverCSS3Styling and animationsREST APICommunication with Gemini endpoint
