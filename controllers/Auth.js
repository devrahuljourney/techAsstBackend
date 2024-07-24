const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = async (req, res) => {
    try {
        
        const { email, password } = req.body;

        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the details carefully',
            });
        }

        

        
        const [result] = await db.query(`SELECT * FROM user WHERE email = ?`, [email]);
        const user = result[0]; 

        console.log("user password ", user.password)

        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User is not registered',
            });
        }

        
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user.id, 
                
            };

            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined; 

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'User logged in successfully',
            });
        } else {
            
            return res.status(403).json({
                success: false,
                message: "Password incorrect",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Login failure',
            error: error.message
        });
    }
};




exports.signup = async (req, res) => {
    try {
        
        const { firstname, lastname, email, password, company } = req.body;
        console.log(firstname, lastname, email, password, company)

        
        const [existingUsers] = await db.query(`SELECT * FROM user WHERE email = ?`, [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }

        
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error in hashing password',
            });
        }

        
        const newUser = await db.query(`INSERT INTO user (firstname, lastname, email, password, company) VALUES (?,?,?,?,?) `, [firstname, lastname, email, hashedPassword, company])

        return res.status(200).json({
            success: true,
            message: 'User created successfully',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'User cannot be registered, please try again later',
            error: error.message
        });
    }
};

