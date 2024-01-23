const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send("Access Dined");
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.body.user_id = verified._id;
        console.log(req.body);
        next();
    } catch (error) {
        return res.status(400).send("Invalid Token!");
    }
}

module.exports = verify;
