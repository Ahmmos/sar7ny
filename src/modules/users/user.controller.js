import { ensureDbConnection } from "../../../database/dbConnection.js";
import { Messege } from "../../../database/models/messegs.model.js";
import { errorCatch } from "../../middleware/errorCatch.js";






const user = errorCatch(async (req, res) => {
    let { userName, userId } = req.session
    res.render("user", { userName, userId, error: req.query.error, success: req.query.success })
})

const sendMessege = errorCatch(async (req, res) => {
    // Ensure the database connection is established
    await ensureDbConnection();

    req.body.user = req.params.id
    const messege = await Messege(req.body)
    if (messege.messege.length < 4) return res.redirect(`/user/${req.params.id}/?error=messege must be at least 4 characters long`);
    if (messege.messege.length > 500) return res.redirect(`/user/${req.params.id}/?error=messege must be at less than 500 characters long`);
    await messege.save()

    return res.redirect(`/user/${req.params.id}/?success=messege sent successfully do you want to send another messege?`);

})


export {
    user,
    sendMessege
}