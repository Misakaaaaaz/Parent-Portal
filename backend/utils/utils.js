const jwt = require('jsonwebtoken'); // Use require instead of import for CommonJS

const generateToken = (user) => {
  if (typeof user !== 'object' || user === null) {
    throw new Error("Invalid user input");
  }

  if (!user.name && !user.email) {
    throw new Error("User must have at least a name or an email");
  }
  // Ensure the JWT secret is defined
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET, // JWT secret from environment variables
    {
      expiresIn: '30d', // Token expiry time
    }
  );
};

module.exports = { generateToken }; // Use CommonJS export

// export const isAuth = (req, res, next) => {
//   const authorization = req.headers.authorization;
//   if (authorization) {
//     const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
//     jwt.verify(
//       token,
//       process.env.JWT_SECRET || 'somethingsecret',
//       (err, decode) => {
//         if (err) {
//           res.status(401).send({ message: 'Invalid Token' });
//         } else {
//           req.user = decode;
//           next();
//         }
//       }
//     );
//   } else {
//     res.status(401).send({ message: 'No Token' });
//   }
// };