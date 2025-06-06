import { Messege } from "../../../database/models/messegs.model.js";
import { errorCatch } from "../../middleware/errorCatch.js";
import QRCode from 'qrcode'






const messages = errorCatch(async (req, res) => {

    // get url automatically
    const url = `${req.protocol}://${req.get('host')}/user/${req.session.userId}`
    const msgUrl = `${req.protocol}://${req.get('host')}/messages`


    // generate qrCode With async/await
    let qrCode = await QRCode.toDataURL(url)

    let messages = await Messege.find({ user: req.session.userId })

    // check if the user is logged in or not
    if (req.session.isLoggedIn) {
        let { userName, userId, isLoggedIn } = req.session
        res.render("messages", { userName, userId, url, msgUrl, qrCode, messages, isLoggedIn, error: req.query.error, success: req.query.success })
    } else {
        return res.redirect("/login")
    }


})
const deleteMsg = errorCatch(async (req, res) => {

    const message = await Messege.findByIdAndDelete(req.params.id)
    if (!message) return res.redirect('/messages?error=message not found');

    return res.redirect(`/messages?success=messege deleted successfully`);
})


export {
    messages,
    deleteMsg
}




