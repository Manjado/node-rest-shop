const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1]
    console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    next()
  } catch (error) {
    return res.status(401).json({
      message: "Auth faild",
    })
  }
}
