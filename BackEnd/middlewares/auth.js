
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).send({ error: 'No token provided' });
    }
 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (ex) {
        console.log(ex);
        return res.status(400).send({ error: 'Invalid token' });
    }

}

const isAdmin = (req, res, next) => {

    if (req.user.role !== "Admin") return res.status(403).send({ message: 'Access Denied' });

    next();
}

module.exports = { authMiddleware, isAdmin };