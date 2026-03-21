// =====================================================
// DOCTOR VERIFICATION CONTROLLER
// Handles doctor applications and approval workflow
// =====================================================

const { pool } = require('../config/db');

// GET /api/doctor-applications
async function getApplications(req, res) {
    try {
        const { status } = req.query;
        let query = 'SELECT * FROM doctor_applications';
        const params = [];

        if (status) {
            query += ' WHERE status = ?';
            params.push(status);
        }

        query += ' ORDER BY applied_at DESC';

        const [rows] = await pool.execute(query, params);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('getApplications error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// PUT /api/doctor-applications/:id/approve
async function approveApplication(req, res) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const appId = req.params.id;
        const adminId = req.user.id; // From authMiddleware

        // Check if application exists and is Pending
        const [appRows] = await connection.execute(
            'SELECT * FROM doctor_applications WHERE id = ?', [appId]
        );

        if (appRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        const app = appRows[0];
        if (app.status !== 'Pending' && app.status !== 'Suspended') {
            await connection.rollback();
            return res.status(400).json({ success: false, message: `Application is already ${app.status}` });
        }

        // 1. Update application status
        await connection.execute(
            'UPDATE doctor_applications SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?',
            ['Approved', adminId, appId]
        );

        // 2. Insert into doctors table (since they are now verified)
        // Using ON DUPLICATE KEY UPDATE to handle seeded data where the doctor might already exist
        await connection.execute(
            `INSERT INTO doctors (full_name, email, phone, specialization, license_number, experience_years, qualification, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')
             ON DUPLICATE KEY UPDATE status = 'Active'`,
            [app.full_name, app.email, app.phone, app.specialization, app.license_number, app.experience_years, app.qualification]
        );

        // 3. Log action
        await connection.execute(
            'INSERT INTO system_logs (admin_id, action, details) VALUES (?, ?, ?)',
            [adminId, 'APPROVED_DOCTOR', `Approved application #${appId} for ${app.full_name}`]
        );

        await connection.commit();
        res.json({ success: true, message: 'Doctor application approved successfully' });

    } catch (error) {
        await connection.rollback();
        console.error('approveApplication error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        connection.release();
    }
}

// PUT /api/doctor-applications/:id/reject
async function rejectApplication(req, res) {
    try {
        const appId = req.params.id;
        const adminId = req.user.id;
        const { reason } = req.body;

        const [result] = await pool.execute(
            'UPDATE doctor_applications SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP, review_notes = ? WHERE id = ? AND status = ?',
            ['Rejected', adminId, reason || 'No reason provided', appId, 'Pending']
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ success: false, message: 'Application not found or not pending' });
        }

        // Log action
        await pool.execute(
            'INSERT INTO system_logs (admin_id, action, details) VALUES (?, ?, ?)',
            [adminId, 'REJECTED_DOCTOR', `Rejected application #${appId}. Reason: ${reason || 'None'}`]
        );

        res.json({ success: true, message: 'Doctor application rejected' });

    } catch (error) {
        console.error('rejectApplication error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// PUT /api/doctor-applications/:id/suspend
async function suspendApplication(req, res) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const appId = req.params.id;
        const adminId = req.user.id;

        const [appRows] = await connection.execute('SELECT * FROM doctor_applications WHERE id = ?', [appId]);
        if (appRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        
        const app = appRows[0];
        if (app.status !== 'Approved') {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Only Approved doctors can be suspended' });
        }

        // Update application
        await connection.execute('UPDATE doctor_applications SET status = ?, reviewed_by = ?, reviewed_at = CURRENT_TIMESTAMP WHERE id = ?', ['Suspended', adminId, appId]);
        
        // Update doctor
        await connection.execute('UPDATE doctors SET status = ? WHERE email = ?', ['Suspended', app.email]);
        
        // Log action
        await connection.execute('INSERT INTO system_logs (admin_id, action, details) VALUES (?, ?, ?)', [adminId, 'SUSPENDED_DOCTOR', `Suspended doctor application #${appId} for ${app.full_name}`]);
        
        await connection.commit();
        res.json({ success: true, message: 'Doctor suspended successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('suspendApplication error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        connection.release();
    }
}

// DELETE /api/doctor-applications/:id/remove
async function removeApplication(req, res) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const appId = req.params.id;
        const adminId = req.user.id;

        const [appRows] = await connection.execute('SELECT * FROM doctor_applications WHERE id = ?', [appId]);
        if (appRows.length === 0) {
            await connection.rollback();
            return res.status(404).json({ success: false, message: 'Application not found' });
        }
        
        const app = appRows[0];
        
        // Delete doctor
        await connection.execute('DELETE FROM doctors WHERE email = ?', [app.email]);
        
        // Delete application
        await connection.execute('DELETE FROM doctor_applications WHERE id = ?', [appId]);
        
        // Log action
        await connection.execute('INSERT INTO system_logs (admin_id, action, details) VALUES (?, ?, ?)', [adminId, 'REMOVED_DOCTOR', `Removed doctor application #${appId} for ${app.full_name}`]);
        
        await connection.commit();
        res.json({ success: true, message: 'Doctor removed successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('removeApplication error:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    } finally {
        connection.release();
    }
}

module.exports = { getApplications, approveApplication, rejectApplication, suspendApplication, removeApplication };
