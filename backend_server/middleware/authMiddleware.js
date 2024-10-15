// handle authnetication here 
// authMiddleware.js
const jwt = require("jsonwebtoken");
function authMiddleware (req, res, next) {
  try {
   
    const authHeader = req.headers["authorization"];
    console.log("token is ",authHeader)
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

   
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token format is incorrect" });
    }

  
    jwt.verify(token,"JWT-SECRET-KEY", (err, user) => {
      if (err) {
        console.log("token problem")
        return res.status(403).json({ error: "Invalid token" });
      }
      console.log("Authiticated user : ",user)
     
      req.user = user;
      console.log("this is might be bug",req.user)
      next(); 
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong with authentication" });
  }
};

module.exports = authMiddleware;
