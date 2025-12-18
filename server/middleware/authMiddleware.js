import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // 1. Get the token from the standard 'Authorization' header
  const authHeader = req.header('authorization');

  // 2. Check if the header exists
  if (!authHeader) {
    return res.status(401).json({ msg: 'No authorization header, access denied' });
  }

  // 3. UniFix uses the "Bearer <token>" format.
  const tokenParts = authHeader.split(' ');

  // 4. Validate the structure
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ msg: 'Token format invalid. Access denied' });
  }

  const token = tokenParts[1];

  if (!token) {
    return res.status(401).json({ msg: 'No token found, authorization denied' });
  }

  // 5. Verify the token against your campus secret
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    /**
     * The 'decoded.user' payload contains:
     * { id: String, role: 'Student'|'Staff', department: ObjectId }
     */
    req.user = decoded.user; 
    
    next(); // Valid pass! Proceed to the route.
  } catch (err) {
    res.status(401).json({ msg: 'Token is invalid or has expired' });
  }
};

export default authMiddleware;