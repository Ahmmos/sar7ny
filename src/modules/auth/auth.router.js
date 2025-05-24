import { Router } from "express";
import {
    forget,
    forgetPassword,
    handleLogin,
    handleRegister,
    logIn,
    logout,
    register,
    reset,
    resetPassword
} from "./auth.controller.js";




const authRoute = Router()



authRoute.get('/login', logIn)
authRoute.get('/register', register)
authRoute.get('/logout', logout)
authRoute.get('/forget', forget)
authRoute.get('/reset/:id', reset)

authRoute.post('/handleLogin', handleLogin)
authRoute.post('/forget', forgetPassword)
authRoute.post('/reset/:id', resetPassword)
authRoute.post('/handleRegister', handleRegister)



export default authRoute