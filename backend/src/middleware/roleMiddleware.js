// Restrict route to a single role
export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ error: `Forbidden: Requires ${role}` });
    }
    next();
  };
}

// Restrict route to multiple roles
export function requireAnyRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: Requires one of ${roles.join(", ")}` });
    }
    next();
  };
}
