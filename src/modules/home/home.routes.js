import { Router } from "express";
import { home } from "./home.controller.js";


const homeRoute = Router()



homeRoute.get('/', home)



export default homeRoute