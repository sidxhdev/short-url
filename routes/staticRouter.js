const express = require("express");
const URL = require("../models/url"); // <-- adjust path if needed


const router = express.Router();

router.get('/',async (req, res) => {
    if(!req.user) return res.redirect('/login')
    const allUrls = await URL.find({ createdBy: req.user.id});
    return res.render("home",{
        urls: allUrls,
    });
});

 router.get('/signup', (req, res) => {
    return res.render("signup");
 });
 router.get('/login', (req, res) => {
    return res.render("login");
 });

module.exports = router;