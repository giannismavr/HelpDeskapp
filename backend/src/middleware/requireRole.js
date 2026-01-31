//https://www.w3schools.com/nodejs/nodejs_middleware.asp
module.exports = (...roles) =>
  (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
