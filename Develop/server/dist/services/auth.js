import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
// Function to decode and verify a JWT token from the Authorization header
export const getUserFromToken = (token) => {
    try {
        const secretKey = process.env.JWT_SECRET_KEY || '';
        const decoded = jwt.verify(token, secretKey);
        return decoded;
    }
    catch (err) {
        console.error('Token verification failed:', err);
        return null;
    }
};
export const signToken = (username, email, _id) => {
    const payload = { username, email, _id };
    const secretKey = process.env.JWT_SECRET_KEY || '';
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
