const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT;
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const app = express();
const nodemailer = require('nodemailer');
const cors = require('cors')
app.use(cors())
app.get('/',(req,res)=>{
  res.send('server is up and runnig ready to send the emails');
})
app.use(express.json());
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });
  
 


  app.post('/send-room-code', (req, res) => {
    const { email,roomCode,creator} = req.body;
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: `Your Access Code for the Room by creator: ${creator}`,
      html: `
        <p>Dear Participant,</p>
        <p>We are pleased to inform you that you have been granted access to the coding room</p>
        <p>Please use the following code to access the collaborative envirnoment:</p>
        <p>Room Code: <strong> ${roomCode}</strong></p>
        <p><br>The Co-Code Team</p>
        <p><em>*Please note: This is an automated message. Do not reply to this email.*</em></p>
      `,
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email' });
      }
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    });
  });



  // for the sdp_project 
  app.post('/send-quiz-code', (req, res) => {
    const { email, quizCode, quizName } = req.body;
  
    
    const mailOptions = {
      from: 'flutter.quiz.app.no.reply@gmail.com',
      to: email,
      subject: `Your Access Code for the Quiz: ${quizName}`,
      html: `
        <p>Dear Participant,</p>
        
        <p>We are pleased to inform you that you have been granted access to the quiz "<strong>${quizName}</strong>".</p>
        
        <p>Please use the following code to access the quiz:</p>
        <p>Quiz Code: <strong> ${quizCode}</strong></p>
        
        <p>Ensure to enter this code when prompted during the quiz. If you have any questions or encounter any issues, please do not hesitate to reach out to us.</p>
        
        <p>Best regards,<br>The QuizApp Team</p>
        <p><em>*Please note: This is an automated message. Do not reply to this email.*</em></p>
      `,
    };
  
    
  
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send email' });
      }
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    });
  });
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
