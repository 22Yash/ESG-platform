"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies?.token || (req.headers.authorization?.split(' ')[1]);
        if (!token)
            return res.status(401).json({ error: 'Not authenticated' });
        const payload = (0, jwt_1.verifyToken)(token);
        req.userId = payload.userId;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authMiddleware = authMiddleware;
