

const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.auth = (req,res,next) => {
    try {
        
        console.log("cookie",req.cookies.token );
        console.log("body",req.body.token);
        console.log("bearer",req.header("Authorization").replace("Bearer ",""))
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");
        

        if(!token){
            return res.status(401).json({
                success:false,
                message:'token missing'
            })
        }

        
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
            next();
        } catch (error) {
            console.log("Error in decoding the token:", error); 
            return res.status(401).json({
                success: false,
                message: "Token is invalid: " + error.message
            });
        }
        

        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"something went wrong while verify  the token"
        })
    }
}


exports.isStudent = (req,res,next) =>{
    try {
        if(req.user.role !== "Student")
        {
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user role can not be verified"
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try {
        if(req.user.role !== "Admin")
        {
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin"
            })
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user role can not be verified"
        })
    }
}