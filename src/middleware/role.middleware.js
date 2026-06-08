const roleMiddleware = (roles = []) => {
    return (req, res, next) => {
        if (!req.userRole) {
            return res.status(401).json({ message: 'Unauthorized: User info not found' });
        }
        if (!roles.includes(req.userRole)) {

            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};

module.exports = roleMiddleware;
