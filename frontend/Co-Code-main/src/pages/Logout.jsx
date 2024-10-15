import React from 'react'
import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from "../store/auth"
export default function Logout() {
  const authContext= useAuth();

  useEffect(() => {
    authContext. logoutUser()
  }, [authContext])
  return (
    <Navigate to="/login" />
  )
}
