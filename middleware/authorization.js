import jwt from "jsonwebtoken";
import config from "config";

//Basic function to check if token is valid
export function authorize(req, res, next) {
  // Check if the token is present in the request header
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied. No token provided.");

  try {
    const decoded = jwt.verify(token, config.get("jwt_private_key"));
    req.user = decoded;

    next();
  } catch (error) {
    res.status(400).send("Invalid Token.");
  }
}

//Role-based authorization middleware
//Usage: authorizeRole(["admin"]) or authorizeRole(["admin", user])

export function authorizeRole(allowedRoles = []) {
  return (req, res, next) => {
    //First authorize the user (verify token)
    authorize(req, res, () => {
      //If token is valid, Check role i.e. next function in authorize has been called
      if (!req.user || !req.user.role) {
        return res
          .status(403)
          .send("Access denied: Role information not provided");
      }

      //Check if the role is in the allowed roles array
      if (allowedRoles.includes(req.user.role)) {
        return next(); //Role is authorized (Allow access to protected route)
      }

      return res.status(403).send("Access denied: Insufficient priviledges");
    });
  };
}
