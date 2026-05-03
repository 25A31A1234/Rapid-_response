
🚨 RapidResponse – Emergency Alert System

📌 Overview

RapidResponse is a real-time emergency alert system that allows users to instantly send distress messages along with their location to emergency contacts and nearby help centers. It uses Twilio for SMS communication and a Node.js backend to ensure fast and reliable alert delivery during critical situations.

🚀 Features

- 🚨 One-click emergency alert system
- 📩 SMS notifications using Twilio
- 📍 Location sharing support
- 🏥 Nearby hospital/help center integration
- ⚡ Fast and lightweight backend

🛠 Tech Stack

- Backend: Node.js, Express
- Frontend: HTML, CSS, JavaScript
- API: Twilio SMS API
- Tools: Git, GitHub

📁 Project Structure

RapidResponse/
│── public/ (Frontend files)
│── server.js (Backend server)
│── test-twilio.js (Twilio testing)
│── package.json (Dependencies)
│── QUICK_START.md (Setup guide)
│── TWILIO_SETUP.md (Twilio setup)
│── .gitignore

⚙️ Installation

1. Clone the repository
   git clone https://25a31a1234.github.io/Rapid-_response/
   cd RapidResponse

2. Install dependencies
   npm install

3. Configure Twilio
   Create a .env file and add:
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=your_number

4. Run the project
   node server.js

🧪 Testing

node test-twilio.js

📖 Usage

Open the frontend from the public folder, click on “Send Emergency Alert,” and the system will send an SMS with location details to registered contacts instantly.

💡 Future Enhancements

- Google Maps integration
- Mobile application version
- AI-based emergency detection
- Voice-triggered alerts

👩‍💻 Author

Keerthi Supriya

📄 License

This project is for educational and hackathon purposes.
