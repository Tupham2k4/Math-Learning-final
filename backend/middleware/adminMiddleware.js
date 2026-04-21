const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({
        success: false,
        message: "Không có quyền truy cập. Yêu cầu quyền admin",
      });
  }
};

export default adminMiddleware;
