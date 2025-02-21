const verifyAdmin = (req, res, next) => {
  if (
    !req.session ||
    !req.session.user ||
    !req.session.user.role ||
    !req.session.user.role ||
    req.session.user.role.toLowerCase() !== "admin"
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

const verifySession = (req, res, next) => {
  if (!req.session || !req.session.user || !req.session.user) {
    req.session.destroy((err) => {
      if (err) console.error("Session destroy error:", err);
    });
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

module.exports = { verifyAdmin, verifySession };
