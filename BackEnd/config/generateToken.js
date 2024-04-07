const jwt = require("jsonwebtoken");

const genrateToken  = (id,role) =>{
    return jwt.sign({id ,role},process.env.JWR_SECRET,{expiresIn:"10d"});
}

module.exports = {genrateToken};