-- =====================================================
-- CURELEX ADMIN PORTAL - DATABASE SCHEMA
-- Database: curelex_admin
-- Author: Aditya (Backend Development)
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS curelex_admin;
USE curelex_admin;


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

