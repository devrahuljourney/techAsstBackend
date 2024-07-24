const express = require("express");
const mySqlPool = require("./config/database");
const userRoute = require("./route/user")
const app = express();
const cors = require("cors");


require("dotenv").config();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000", 
    optionsSuccessStatus: 200,
    credentials: true
}));


const PORT = process.env.PORT || 8080;


app.use("/api/v1/user", userRoute);


mySqlPool.query('SELECT 1').then( () => {

    console.log("My sql db connected" )
    app.listen(PORT, () => {
        console.log(`Server running ${PORT}`)
    })
}).catch((e) => console.log(e))
