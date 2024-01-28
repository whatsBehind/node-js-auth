const router = require("express").Router();
const dotenv = require("dotenv");
const axios = require("axios");
const qs = require("querystring");
const jwt = require("jsonwebtoken");

dotenv.config();

router.get("/google", async (req, res) => {
    // get the code 
    const code = req.query.code;

    // get the id and token from the code
    const { id_token, access_token } = await getGoogleOauthToken(code);

    // get user with tokens
    const googleUser = await getGoogleUser({id_token, access_token});

    res.status(200).send(googleUser.email);
});

const getGoogleOauthToken = async (code) => {
    const url = "https://oauth2.googleapis.com/token"
    const values = {
        code,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
        grant_type: "authorization_code"
    }
    try {
        const res = await axios.post(
            url,
            qs.stringify(values),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        )
        return res.data;
    } catch (error) {
        console.error(error, "failed to fetch google oauth tokens");
    }

}

const getGoogleUser = async ({id_token, access_token}) => {
    try {
        const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
            header: {
                Authorization: `Bearer ${id_token}`
            }
        })
        return res.data;
    } catch (error) {
        console.error(error, "Failed to get google user");
    }
}

module.exports = router;
