const router = require("express").Router();
const User = require("../model/user");
const validateUser = require("../model/validator/user-validator");
const validateUserLogin = require("../model/validator/user-login-validator")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    // Validate payload
    const error = validateUser(req);
    if (error) return res.status(401).send(error);

    // Check if email exists
    const userExist = await User.findOne({
        email: req.body.email
    });
    if (userExist) {
        return res.status(400).send("Email already exist!");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send({userId: user._id});
    } catch (error) {
        res.status(400).send(error);
    }

});

router.post("/login", async (req, res) => {
        // Validate payload
        const error = validateUserLogin(req);
        if (error) return res.status(401).send(error);
    
        // Check if user exists
        const user = await User.findOne({
            email: req.body.email
        });
        if (!user) {
            return res.status(400).send("Email doesn't exist!");
        };
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send("Invalid password!");
        }

        const token = jwt.sign({
            _id: user._id
        }, 
        process.env.JWT_SECRET,
        {
            expiresIn: "1m"
        });

        res.status(200).header("auth-token", token).send({
            token: token
        });
});

module.exports = router;