
import { User } from "../../../database/models/user.model.js";
import { sendEmails } from "../../mailSender/mail.js";
import { errorCatch } from "../../middleware/errorCatch.js";
import bcrypt from "bcrypt";



const register = errorCatch(async (req, res) => {
    res.render("register", { error: req.query.error })
})
const logIn = errorCatch(async (req, res) => {
    res.render("login", { error: req.query.error, success: req.query.success })
})
const handleLogin = errorCatch(async (req, res) => {
   
    // Destructure email and password from the request body
    let { email, password } = req.body
    // check if the user is exist or not
    const user = await User.findOne({ email })
    if (!user) return res.redirect('/login?error=Email or password is incorrect');
    // check if the password is correct or not
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.redirect('/login?error=Email or password is incorrect');

    req.session.userId = user._id
    req.session.isLoggedIn = true
    req.session.userName = user.name

    res.redirect("/messages")
})
const handleRegister = errorCatch(async (req, res) => {

    // Destructure email, password, and confirmPassword from the request body
    let { email, password, confirmPassword } = req.body
    // check if the user is exist or not
    const isExsist = await User.findOne({ email })
    if (isExsist) return res.redirect('/register?error=Email already exists');

    // check if the password and confirm password are same or not
    if (password !== confirmPassword) return res.redirect("/register?error=Password and password confirmation doesn't match")

    let user = await User(req.body)

    // hash the password using bcrypt
    user.password = await bcrypt.hash(user.password, 8)

    // save the user to the database
    await user.save()
    user.password = undefined
    res.redirect("/login")
})


const logout = errorCatch(async (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err)
        } else {
            res.clearCookie('connect.sid')
            res.redirect('/')
        }
    })

})

const forget = errorCatch((req, res) => {
    res.render('forget', { error: req.query.error, success: req.query.success });
})

const forgetPassword = errorCatch(async (req, res) => {

    const { email } = req.body
    let user = await User.findOne({ email: email })
    if (!user) return res.redirect("/forget?error=email not found, please enter a valid email");

    user.resetPassword = true
    await user.save()

    const url = `${req.protocol}://${req.get('host')}/reset/${user._id}`
    sendEmails(email, url)

    return res.redirect(`/forget?success=messege sent successfully please check your email`);

})

const reset = errorCatch(async (req, res) => {
    res.render('reset', { error: req.query.error, success: req.query.success, id: req.params.id });
})
const resetPassword = errorCatch(async (req, res) => {

    const { newPassword } = req.body
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) return res.redirect(`/reset/${req.params.id}/?error=user not found`);

    if (user.resetPassword === false) return res.redirect(`/reset/${req.params.id}/?error=you are not allowed to reset this password, please contact the admin`);


    if (bcrypt.compareSync(newPassword, user.password)) return res.redirect(`/reset/${req.params.id}/?error=enter a new password, the new password should be different from the old one`);

    user.password = await bcrypt.hash(newPassword, 8)
    user.resetPassword = false

    await user.save()
    return res.redirect("/login?success=your password has been changed successfully, please login with your new password");
})



export {
    register,
    logIn,
    handleLogin,
    handleRegister,
    logout,
    forget,
    forgetPassword,
    resetPassword,
    reset
}