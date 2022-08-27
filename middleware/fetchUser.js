const jwt = require('jsonwebtoken')

const PRIVATE_JWT_KEY = "reactBackend";
const fetchUser = async(req,res,next) =>{

    const token = req.header('auth-token');
    if(!token){
        return res.status(401).json({ errors: "Authentication Failed"});
    }
    try {
        const data = jwt.verify(token,PRIVATE_JWT_KEY);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({ errors: "Authentication Failed"});
    }

}
module.exports = fetchUser