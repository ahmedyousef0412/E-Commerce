const express = require('express');
const app = express();
const Joi = require('joi');

const dotenv = require("dotenv").config();
const dbConnect = require("./config/dbConnection");


const authRouter = require('./routes/auth');
const {errorHandler,notFound} = require("./middlewares/errorHandler")

dbConnect();




app.use(express.json());
app.use("/api/user",authRouter);


app.use(errorHandler);
app.use(notFound);
const port = process.env.PORT||3000;

app.listen(port,()=>{console.log(`Listen to port ${port}`);});