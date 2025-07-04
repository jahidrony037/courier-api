

export const isCustomer = (req, res, next) => {

    const user = req.user;  
    // console.log('Authorization header:', user); // Debugging line to check the authorization header
    // console.log('User in isCustomer middleware:', user); // Debugging line to check user
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.role !== 'customer') {
    return res.status(403).json({ message: 'Access denied. Only customers can perform this action.' });
  }
  next();
};

// isAgent Middleware (roleMiddleware.js)
export const isAgent = (req, res, next) => {
  const user = req.user;  // The user should be attached to req by the auth middleware

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== 'agent') {
    return res.status(403).json({ message: 'Access denied. Only agents can perform this action.' });
  }

  next();  // Proceed to the next middleware/route
};


export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Only admins can perform this action.' });
  }
  next();
};
