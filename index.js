// use dto handel in error in the code 
process.on("uncaughtException", (err) => {
    console.log("error in code", err)
})
import express from 'express'
import homeRoute from './src/modules/home/home.routes.js'
import authRoute from './src/modules/auth/auth.router.js'
import messagesRouter from './src/modules/messages/message.routes.js'
import userRouter from './src/modules/users/user.route.js'
import { globalError } from './src/middleware/globalErrorHandling.js'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv';
dotenv.config();

// used to create authentication and authrization for the app 
import session from 'express-session'
// to connect mongodb and save sessions inside it
import mongoSession from 'connect-mongodb-session'

const connectionString = process.env.DB_URI;
if (!connectionString) {
    console.error('FATAL ERROR: DB_URI is not defined in environment variables for session store.');
    process.exit(1); // Exit the application if DB_URI is not set
}


let MongoDBStore = mongoSession(session);

let store = new MongoDBStore({
    uri: connectionString,
    collection: 'mySessions'
});

const app = express()
const port = process.env.PORT || 3000

app.use(session({
    secret: 'session creator',
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hour
    },
    resave: false,
    saveUninitialized: false,
    store
}))

app.set("views", path.resolve() + "/views") // used to set the views folder to the views folder in the src folder)
// to set the view engine to ejs and you dont need to add the .ejs in the file name 
app.set("view engine", "ejs")

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(path.resolve(), 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(globalError)

app.use(homeRoute)
app.use(authRoute)
app.use(messagesRouter)
app.use(userRouter)



// used to handel errors outside the express app like (db Connection)
process.on("unhandeledRejection", (err) => {
    console.log("internal error", err)
})

app.get('/', (req, res) => res.send('Hello to my Sara7a App!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))