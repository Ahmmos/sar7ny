import { errorCatch } from "../../middleware/errorCatch.js";
import { AppError } from "../../utilts/appError.js";






const home = errorCatch(async(req, res) => {

    res.render("home")
})


export {
    home
}