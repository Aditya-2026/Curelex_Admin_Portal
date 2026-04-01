-- =====================================================
-- CURELEX ADMIN PORTAL - DATABASE SCHEMA
-- Database: curelex_admin
-- Author: Aditya (Backend Development)
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS curelexDb;
USE curelexDb;


-- =====================================================
-- TABLE 1: admin_users
-- Stores admin/leadership login credentials and roles
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('CEO', 'COO', 'CTO', 'CFO', 'CLO', 'CHRO', 'Community') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- =====================================================
-- TABLE 2: doctors
-- Doctor profiles - populated by Public Portal
-- Admin Portal only READS from this table
-- =====================================================

CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(20),
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    experience_years INT DEFAULT 0,
    qualification VARCHAR(200),
    status ENUM('Active', 'Suspended', 'Inactive') DEFAULT 'Active',
    profile_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- =====================================================
-- TABLE 3: patients
-- Patient profiles - populated by Public Portal
-- Admin Portal only READS from this table
-- =====================================================

CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    address TEXT,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    last_visit DATE,
    is_new_patient BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- =====================================================
-- TABLE 4: doctor_applications
-- Doctor registration requests from Public Portal
-- Admin (CEO/COO/CTO) can approve or reject
-- =====================================================

CREATE TABLE IF NOT EXISTS doctor_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    experience_years INT DEFAULT 0,
    qualification VARCHAR(200),
    documents_url VARCHAR(255),
    status ENUM('Pending', 'Approved', 'Rejected', 'Suspended') DEFAULT 'Pending',
    reviewed_by INT,
    review_notes TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    INDEX idx_reviewed_by (reviewed_by)
);


-- =====================================================
-- TABLE 5: system_logs
-- Tracks all admin actions on the platform
-- =====================================================

CREATE TABLE IF NOT EXISTS system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT,
    action VARCHAR(200) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_admin_id (admin_id)
);


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
ALTER TABLE doctors ADD INDEX idx_status (status);
ALTER TABLE doctors ADD INDEX idx_specialization (specialization);

-- Optimization for patients
ALTER TABLE patients ADD INDEX idx_patient_status (status);
ALTER TABLE patients ADD INDEX idx_is_new (is_new_patient);
ALTER TABLE patients ADD INDEX idx_gender (gender);

-- Optimization for doctor applications
ALTER TABLE doctor_applications ADD INDEX idx_app_status (status);
ALTER TABLE doctor_applications ADD INDEX idx_applied_at (applied_at);

-- Optimization for system logs
ALTER TABLE system_logs ADD INDEX idx_log_created (created_at);
