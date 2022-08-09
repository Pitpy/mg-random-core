const jwt = require("jsonwebtoken");

const tokenCheck = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];
  if (!token) return res.status(403).send("Not autherized");
  if (token.startsWith("Bearer ")) token = token.slice(7, token.length);
  try {
    jwt.verify(token, process.env.ACC_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.json({
          code: 103,
          message: err.message,
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    return res.json({
      code: 103,
      message: error.message,
    });
  }
};

module.exports = {
  tokenCheck
};
