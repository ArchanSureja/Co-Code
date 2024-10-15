const User = require("../model/user");
const jwt = require("jsonwebtoken");
function generateToken(newUser)
{
    const token = jwt.sign({newUser},"JWT-SECRET-KEY")
    return token
}
async function createUser(req,res) {
   try {
     const { username , email , password} = req.body;

     const newUser = new User()
     newUser.username = username
     newUser.email = email
     newUser.password = password
     console.log(newUser)
     await newUser.save();
     const token = generateToken(newUser)
     res.status(201).json({"user" : newUser,
        "token":  token
     });

   }
   catch(error)
   {
    res.status(500).json({ error: error.message    
    });
   }
}
async function loginUser(req,res)
{
   const { email, password } = req.body;
   const user = await User.findOne({ email : email, password : password});
   if(!user)
   {

      res.status(404).json({ error: 'User not found' });
   }
   else
   {
      res.status(200).json({ user : user , token : generateToken(user)})
   }
  
}
async function checkUserByEmail(req,res)
{
   const email = req.params.email
   const user = await User.findOne({ email : email });
   if(!user)
   {
      res.status(404).json({ message: 'User not found' });
   }
   else
   {
      res.status(200).json({ user : user });
   }
}
module.exports = {createUser , loginUser , checkUserByEmail};
