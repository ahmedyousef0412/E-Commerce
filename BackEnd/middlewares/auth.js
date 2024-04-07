
const jwt =require("jsonwebtoken");

const authMidd = (req,res,next) =>{
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send({ error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWR_SECRET);
        req.user = decoded;
        next();
    }
    catch (ex) {
      console.log(ex);
        return res.status(400).send({ error: 'Invalid token' });
    }

}

module.exports = {authMidd};