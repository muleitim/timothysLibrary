// lib/auth.js
import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  const token = req.cookies.token;
  if (!token) throw new Error("Unauthorized");
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function withRole(handler, allowedRoles) {
  return async (req, res) => {
    try {
      const user = verifyToken(req);
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = user;
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
}
