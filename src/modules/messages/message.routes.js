import { Router } from "express";
import { deleteMsg, messages } from "./message.controller.js";


const messagesRouter = Router()



messagesRouter.get('/messages', messages)
messagesRouter.get('/deleteMsg/:id', deleteMsg)



export default messagesRouter