export const isInstructor = (req, res, next) => {
  if (req.user.role !== "instructor" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Instructors only." });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

export const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied. Students only." });
  }
  next();
};
