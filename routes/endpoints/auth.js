const User = require('../../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('./sendMail');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const { auth } = require("../../middleware");

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const { CLIENT_URL } = process.env;
let routes = (app) => {
    app.post("/register", async (req, res) => {
        try {
            const {fullname , email, password } = req.body;

            if (!fullname || !email || !password )
                return res.status(400).json({ msg: "Please fill in all fields, one or more fileds are empty!" })

            if (!validateEmail(email))
                return res.status(400).json({ msg: "Please enter a valid email address!" })

            if (!validatePassword(password)) {
                return res.status(400).json({ msg: "Password should be Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:" });
            }

            if (password.length < 8)
                return res.status(400).json({ msg: "Password must be atleaast 8 characters long!" })

            
            const user = await User.findOne({ email })
            if (user) return res.status(400).json({ msg: "This email already exists, please use another email address!" })

            const passwordHash = await bcrypt.hash(password, 12)
            let name = fullname ;
            const newUser = {
                fullname, email, password: passwordHash
            }
            let user_ = new User(newUser);
            // const activation_token = createActivationToken(newUser)

            // const url = `${CLIENT_URL}/user/activate/${activation_token}`

            // sendMail(email, url, "Verify your email address")
            await user_.save();
            res.status(200).json({ msg: "Registration Successful, Please proceed to login" })

        }
        catch (err) {
            return res.status(500).json({ msg: err.message });
        }

    });



	
	app.post("/login", async (req, res) => {
		try {
			const { email, password } = req.body
			const user = await User.findOne({ email })
			if (!user) return res.status(400).json({ msg: "This email does not exist." })

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })

		

			res.json({
				msg: "Login success!",
				user
			})
		}
		catch (err) {
			res.status(500).send(err);
		}
	});

	

	




	app.post("/logout", async (req, res) => {
		try {
			res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
			return res.json({ msg: "Logged out." })
		}
		catch (err) {
			res.status(500).send(err);
		}
	});

};


function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};
function validatePassword(password) {
    const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/;
    return re.test(password);
};


module.exports = routes;
