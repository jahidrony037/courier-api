import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const verifyToken = (req, res, next) => {
  // Check if token exists
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
//   console.log('Authorization header:', req.headers.authorization); 
  
  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    // console.log('Decoded token:', decoded); // Debugging line to check the decoded token

    // Attach the user info to the request object for later use (e.g., customerId, role)
    req.user = decoded; 
    next(); // Proceed to the next middleware/route
  });
};

export default verifyToken;
