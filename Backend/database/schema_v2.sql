-- =====================================================
-- CURELEX ADMIN PORTAL - DATABASE SCHEMA UPDATE (v2)
-- Adding Financial Tracking, Analytics, and Enhanced Logging
-- =====================================================

USE u626152625_curelexDb;

-- =====================================================
-- TABLE 6: financial_transactions
-- Tracks all monetary activities (revenue/expenses)
-- =====================================================

CREATE TABLE IF NOT EXISTS financial_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('Revenue', 'Expense') NOT NULL,
    category ENUM('Service Fee', 'Consultation', 'Medication', 'Payroll', 'Maintenance', 'Insurance', 'Marketing', 'Other') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    description TEXT,
    reference_id VARCHAR(100), -- ID from appointments, salary IDs etc.
    recorded_by INT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_type (type),
    INDEX idx_transaction_date (transaction_date),
    FOREIGN KEY (recorded_by) REFERENCES admin_users(id) ON DELETE SET NULL
);

-- =====================================================
-- TABLE 7: system_analytics_metrics
-- Tracks snapshots of system performance and usage
-- =====================================================

CREATE TABLE IF NOT EXISTS system_analytics_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15, 2) NOT NULL,
    metric_unit VARCHAR(50), -- e.g., 'count', 'ms', 'MB', '%'
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_metric_name (metric_name),
    INDEX idx_timestamp (timestamp)
);

-- =====================================================
-- TABLE 8: activity_logs
-- Tracks more detailed user/system activities than basic system_logs
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, 
    user_role ENUM('Admin', 'Doctor', 'Patient', 'System') NOT NULL,
    action_type VARCHAR(100) NOT NULL, -- e.g., 'LOGIN', 'LOGOUT', 'CREATE_RECORD', 'UPDATE_PROFILE', 'DELETE_RECORD'
    module VARCHAR(50), -- e.g., 'Auth', 'Finance', 'Analytics', 'Doctors'
    details JSON, -- Store structured data about the action
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id, user_role),
    INDEX idx_action_module (action_type, module),
    INDEX idx_created_at (created_at)
);


-- =====================================================
-- DATABASE OPTIMIZATION: Additional Indexes for existing tables
-- =====================================================

-- Optimization for doctors
ALTER TABLE doctors ADD INDEX IF NOT EXISTS idx_status (status);
ALTER TABLE doctors ADD INDEX IF NOT EXISTS idx_specialization (specialization);

-- Optimization for patients
ALTER TABLE patients ADD INDEX IF NOT EXISTS idx_patient_status (status);
ALTER TABLE patients ADD INDEX IF NOT EXISTS idx_is_new (is_new_patient);
ALTER TABLE patients ADD INDEX IF NOT EXISTS idx_gender (gender);

-- Optimization for doctor applications
ALTER TABLE doctor_applications ADD INDEX IF NOT EXISTS idx_app_status (status);
ALTER TABLE doctor_applications ADD INDEX IF NOT EXISTS idx_applied_at (applied_at);

-- Optimization for system logs
ALTER TABLE system_logs ADD INDEX IF NOT EXISTS idx_log_created (created_at);
