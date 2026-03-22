// =====================================================
// LOGS CONTROLLER - Platform Activity Logs Manager
// Author: Antigravity - Backend Logic Development
// =====================================================

const { pool } = require('../config/db');

// GET /api/logs
// Get a paginated list of activity logs with filtering
async function getActivityLogs(req, res) {
    try {
        const { user_id, action_type, module, start_date, end_date, limit = 50, offset = 0 } = req.query;
        let query = 'SELECT * FROM activity_logs WHERE 1=1';
        let params = [];

        if (user_id) {
            query += ' AND user_id = ?';
            params.push(user_id);
        }
        if (action_type) {
            query += ' AND action_type = ?';
            params.push(action_type);
        }
        if (module) {
            query += ' AND module = ?';
            params.push(module);
        }
        if (start_date) {
            query += ' AND created_at >= ?';
            params.push(start_date);
        }
        if (end_date) {
            query += ' AND created_at <= ?';
            params.push(end_date);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await pool.execute(query, params);
        
        // Count total for pagination
        const [totalRows] = await pool.execute('SELECT COUNT(*) as total FROM activity_logs');
        const totalCount = totalRows[0].total;

        res.json({
            success: true,
            data: rows,
            pagination: {
                total: totalCount,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + rows.length) < totalCount
            }
        });

    } catch (error) {
        console.error('Error fetching activity logs:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error while fetching logs' });
    }
}

// GET /api/logs/system
// Get simple system logs for admin dashboard
async function getSystemLogs(req, res) {
    try {
        const [rows] = await pool.execute(`
            SELECT sl.id, sl.action, sl.details, sl.created_at, au.full_name as admin_name
            FROM system_logs sl
            LEFT JOIN admin_users au ON sl.admin_id = au.id
            ORDER BY sl.created_at DESC
            LIMIT 10
        `);

        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching system logs:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = {
    getActivityLogsByQuery: getActivityLogs,
    getSystemLogs
};
