const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  try {
    
    if (!req.headers.authorization) {
      return res.status(403).send({message : "Access Denied" });
    } else {
      const authHeader = req.headers["authorization"];

      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];        
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) { 
              return res
                .status(403)
                .json({ message: "Failed to authenticate token." });
            }
            req.user = decoded.id;
            next();
          });
      }else{
        return res.status(403).send({message : "Invalid token"})
      }
        
    }
  } catch (error) {
    console.log(error);
    return res.status(403).send({ message: "Invalid token" });
  }
}

module.exports = authenticateToken;
