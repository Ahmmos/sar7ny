
import { User } from "../../../database/models/user.model.js";
import { sendEmails } from "../../mailSender/mail.js";
import { errorCatch } from "../../middleware/errorCatch.js";
import bcrypt from "bcrypt";
import crypto from "crypto";



const register = errorCatch(async (req, res) => {
    let { userName, userId, isLoggedIn } = req.session

    // if the user is logged in, redirect to  messages page
    if (isLoggedIn) return res.redirect("/messages")
    res.render("register", { error: req.query.error, isLoggedIn, userName, userId })
})
const logIn = errorCatch(async (req, res) => {
    let { userName, userId, isLoggedIn } = req.session
    res.render("login", { error: req.query.error, success: req.query.success, isLoggedIn, userName, userId })
})
const handleLogin = errorCatch(async (req, res) => {
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
    let { userName, userId, isLoggedIn } = req.session
    // if the user is logged in, redirect to  messages page
    if (isLoggedIn) return res.redirect("/messages")

    res.render('forget', { error: req.query.error, success: req.query.success, isLoggedIn, userName, userId });
})



const reset = errorCatch(async (req, res) => {
    let { userName, userId, isLoggedIn } = req.session
    const { id, token } = req.params

    // if the user is logged in, redirect to messages page
    if (isLoggedIn) return res.redirect("/messages")

    res.render('reset', { error: req.query.error, success: req.query.success, id, token, userName, userId, isLoggedIn });
})

const forgetPassword = errorCatch(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.redirect("/forget?error=user not found, please enter a valid email");

    // Generate token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour

    await user.save();

    const url = `${req.protocol}://${req.get('host')}/reset/${user._id}/${token}`; // Include token in the URL
    sendEmails(email, url)

    return res.redirect("/forget?success=reset email sent successfully, please check your email");
});

const resetPassword = errorCatch(async (req, res) => {
    const { newPassword } = req.body
    const { id, token } = req.params

    // Find user with matching token and not expired
    const user = await User.findOne({
        _id: id,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.redirect(`/reset/${req.params.id}/${token}?error=user not found or token expired, please request a new password reset`);

    // Validate new password
    if (bcrypt.compareSync(newPassword, user.password)) return res.redirect(`/reset/${req.params.id}/${token}?error=enter a new password, the new password should be different from the old one`);

    user.password = await bcrypt.hash(newPassword, 8)
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
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