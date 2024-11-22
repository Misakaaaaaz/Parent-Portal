const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/utils'); // Adjust the path as needed

// Mock process.env
process.env.JWT_SECRET = 'test_secret';


//---- Normal Case -----
describe('generateToken', () => {
  it('should generate a valid JWT token', () => {
    const user = {
      name: 'Test User',
      email: 'test@example.com'
    };

    const token = generateToken(user);

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(decoded).toHaveProperty('name', user.name);
    expect(decoded).toHaveProperty('email', user.email);
    expect(decoded).toHaveProperty('exp');
  });

  it('should generate a token that expires in 30 days', () => {
    const user = {
      name: 'Test User',
      email: 'test@example.com'
    };

    const token = generateToken(user);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
    const thirtyDaysFromNow = Math.floor(Date.now() / 1000) + thirtyDaysInSeconds;

    // Allow for a small time difference (e.g., 5 seconds) due to execution time
    expect(decoded.exp).toBeCloseTo(thirtyDaysFromNow, -1);
  });
// ---- Abnormal Case------
  it('should throw an error if JWT_SECRET is not defined', () => {
    // Temporarily remove JWT_SECRET from process.env
    const originalSecret = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;

    const user = {
      name: 'Test User',
      email: 'test@example.com'
    };

    expect(() => generateToken(user)).toThrow('JWT_SECRET is not defined in environment variables');

    // Restore JWT_SECRET
    process.env.JWT_SECRET = originalSecret;
  });

  it('should handle a user object with additional properties', () => {
    const user = {
      name: 'Test User',
      email: 'test@example.com',
      role: 'admin',
      age: 30
    };

    const token = generateToken(user);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(decoded).toHaveProperty('name', user.name);
    expect(decoded).toHaveProperty('email', user.email);
    expect(decoded).not.toHaveProperty('role');
    expect(decoded).not.toHaveProperty('age');
  });

  it('should handle a user object with missing properties', () => {
    const user = {
      name: 'Test User',
      email: ''
    };
  
    const token = generateToken(user);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    expect(decoded).toHaveProperty('name', user.name);
    expect(decoded).toHaveProperty('email', '');
  });
  // ----- Edge case ------
  it('should throw an error for an empty user object', () => {
    const user = {};

    expect(() => generateToken(user)).toThrow("User must have at least a name or an email");
  });

  it('should throw an error for non-object user input', () => {
    expect(() => generateToken('not an object')).toThrow("Invalid user input");
    expect(() => generateToken(123)).toThrow("Invalid user input");
    expect(() => generateToken(null)).toThrow("Invalid user input");
    expect(() => generateToken(undefined)).toThrow("Invalid user input");
  });

  it('should generate unique tokens for different users', () => {
    const user1 = { name: 'User 1', email: 'user1@example.com' };
    const user2 = { name: 'User 2', email: 'user2@example.com' };

    const token1 = generateToken(user1);
    const token2 = generateToken(user2);

    expect(token1).not.toBe(token2);
  });
});