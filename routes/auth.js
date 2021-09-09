const express = require("express")
const router = express.Router()
const passport = require("passport")
const kakaoStrategy = require("passport-kakao").Strategy

passport.use("kakao", new kakaoStrategy({
    clientID: "baef0758c185a7bbf8b413c8443fe2f5",
    clientSecret: "",
    callbackURL: "http://localhost:8000/auth/kakao/callback"
}, (accessToken, refreshToken, profile, done) => {
    console.log(accessToken)
    console.log(refreshToken)
    console.log(profile)
}))

router.get("/", function (req, res, next) {
    res.render("login")
})

router.post("/", function (req, res, next) {
    res.render("")
})

router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', {failureRedirect: '/',}), (req, res) => {
    res.redirect('/');
});


module.exports = router