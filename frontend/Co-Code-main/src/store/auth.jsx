import { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>
{
   const [loggedInUser,setloggedInUser] = useState(JSON.parse(localStorage.getItem("user")))
   const [token,settoken] = useState(localStorage.getItem("token"))
   const isLoggedIn = !!token 
   function logoutUser()
   {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setloggedInUser({})
      settoken("")
   }
   function loginUser(user,token)
   {
      let jsonobj = JSON.stringify(user)
      localStorage.setItem("token",token)
      localStorage.setItem("user",jsonobj)
      setloggedInUser(user)
      settoken(token)
   }
   console.log(isLoggedIn)
   console.log(loggedInUser)
   return <AuthContext.Provider value={{ isLoggedIn,logoutUser,loginUser,loggedInUser,}}>
      {children}
   </AuthContext.Provider>
}
export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
       throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};