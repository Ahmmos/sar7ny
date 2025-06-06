import { errorCatch } from "../../middleware/errorCatch.js";
import { AppError } from "../../utilts/appError.js";






const home = errorCatch(async (req, res) => {
    let { userName, userId, isLoggedIn } = req.session

    res.render("home", { userName, userId, isLoggedIn })
})


export {
    home
}