# Co-Code

## Home Page

![Home Page](/frontend/Co-Code-main/public/ScreenShots/Home.png)

## Chat Page

![Chat Page](/frontend/Co-Code-main/public/ScreenShots/Chat1.png)

## Editor Page

![Editor Page](/frontend/Co-Code-main/public/ScreenShots/AfterFileOpen.png)

## Code Runner Page

![Code Runner Page](/frontend/Co-Code-main/public/ScreenShots/CodeRunner.png)

## Setting Page

![Setting Page](/frontend/Co-Code-main/public/ScreenShots/Setting.png)

## Login Page

![Login Page](/frontend/Co-Code-main/public/ScreenShots/login.png)

## Register Page

![Register Page](/frontend/Co-Code-main/public/ScreenShots/register.png)

## Create Room Page

![Create Room Page](/frontend/Co-Code-main/public/ScreenShots/CreateRoom.png)

## Join Room Page

![Join Room Page](/frontend/Co-Code-main/public/ScreenShots/JoinRoom.png)

## About
**Co-Code** is a real-time collaborative code editor and chat application built with the MERN stack (MongoDB, Express, React, Node.js). It allows multiple users to edit code simultaneously, see each other’s changes in real-time, and communicate via integrated chat.User can Run Code online also.

## Features
- **Real-Time Code Collaboration**: Users can collaborate on code in real time.
- **Language Support**: Select from multiple programming languages.
- **Integrated Chat**: Collaborate through built-in chat for easy communication.
- **Run Code**: Execute the code in various languages within the editor.
- **Copy Room ID**: Share the room ID to invite others to join.
- **Responsive Design**: Optimized for various screen sizes.

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **WebSockets**: Socket.io for real-time communication
- **Database**: MongoDB for user data and session storage
- **Code Execution**: API integration for running code in multiple languages (e.g., Piston API)
- **Mail System**: Sending Room Code using user's mail to allow participate User using **NodeMailer**
 
## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/Vipullakum007/CoCode.git
   ```
2. Navigate to the project directory:
   ```bash
   cd CoCode
   ```
3. Install dependencies for the backend and frontend:
   ```bash
   cd backend_server && npm install
   cd ../frontend && npm install
   ```
4. Start the backend server:
   ```bash
   cd backend_server && npm start
   ```
5. Start the frontend:
   ```bash
   cd frontend && npm start
   ```
6. Start websocket Server
   ```bash
   cd webSocket_server && npm start
   ```
7. Start Mail Server
   ```bash
   cd email && npm start
   ```

## How to Use
1. Register or log in with a username.
2. Create a new room or join an existing room using the room ID.
3. Start collaborating on code with others in real-time.
4. Use the chat feature to communicate.
5. Select the programming language and execute the code directly.

## Contributing
Feel free to submit issues or pull requests to improve the project.

## License
[MIT License](LICENSE)
