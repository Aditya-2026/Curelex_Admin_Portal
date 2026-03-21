// =====================================================
// RBAC MIDDLEWARE - Role-Based Access Control
// Restricts routes to specific admin roles
//
// Usage in routes:
//   router.get('/some-route', authMiddleware, rbac('CEO', 'COO', 'CTO'), controller)
//
// This checks if req.user.role (set by authMiddleware) is
// one of the allowed roles. If not, returns 403 Forbidden.
// =====================================================


function rbac(...allowedRoles) {

    return (req, res, next) => {

        // authMiddleware must run before rbac (sets req.user)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // Check if user's role is in the allowed list
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. This action requires one of these roles: ${allowedRoles.join(', ')}`
            });
        }

        // User has the required role, proceed
        next();
    };
}

module.exports = rbac;
