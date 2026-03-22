// =====================================================
// ACTIVITY LOG MIDDLEWARE - Platform Activity Tracking
// Automatically logs sensitive actions for auditing
// Author: Antigravity - Backend Logic Development
// =====================================================

const { pool } = require('../config/db');

/**
 * Higher-order middleware to log specific actions.
 * @param {string} actionType - The type of action (e.g., CREATE_DOCTOR, UPDATE_FINANCE)
 * @param {string} module - The system module involved
 */
function activityLogger(actionType, module) {
    return async (req, res, next) => {
        // Intercept the response finish event to capture outcome
        const originalSend = res.send;

        res.send = function (body) {
            // Restore original send and call it
            res.send = originalSend;
            const responseData = typeof body === 'string' ? JSON.parse(body) : body;

            // Only log if the action was successful (for sensitive actions)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const user_id = req.user ? req.user.id : null;
                const user_role = req.user ? req.user.role : 'System';
                const ip_address = req.ip || req.connection.remoteAddress;
                const user_agent = req.headers['user-agent'];
                
                // Structured data about the action
                const details = {
                    method: req.method,
                    path: req.originalUrl,
                    body: req.body, // Be careful with sensitive data like passwords! Consider sanitizing here.
                    response: responseData,
                    timestamp: new Date().toISOString()
                };

                // Remove sensitive info from logs
                if (details.body && details.body.password) details.body.password = '********';

                // Save to DB (async but don't wait for it to finish to prevent blocking response)
                pool.execute(`
                    INSERT INTO activity_logs (user_id, user_role, action_type, module, details, ip_address, user_agent)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [user_id, user_role, actionType, module, JSON.stringify(details), ip_address, user_agent])
                .catch(err => console.error('FAILED TO LOG ACTIVITY:', err.message));
            }

            return res.send(body);
        };

        next();
    };
}

module.exports = { activityLogger };
