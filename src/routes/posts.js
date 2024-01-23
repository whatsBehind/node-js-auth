const router = require("express").Router();
const verifyToken = require("./verify-token");

router.get("/", verifyToken, (req, res) => {
    res.json({
        posts: {
            title: "Hello World",
            description: "Nothing to say"
        }
    })
})


module.exports = router;
