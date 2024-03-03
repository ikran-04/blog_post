import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1]; // Extract token from header

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.SECRETKEY); // Verify token
    // req.user = decoded.user; // Attach user data to request object
    req.user = { id: decoded.id }; // Attach user data to request object

    console.log("---------------------------------------------------");
    console.log(decoded);

    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default auth;
