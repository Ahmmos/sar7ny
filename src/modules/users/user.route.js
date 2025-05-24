import { Router } from "express";
import { sendMessege, user } from "./user.controller.js";


const userRouter = Router()



userRouter.get('/user/:id', user)
userRouter.post('/postMsg/:id', sendMessege)



export default userRouter