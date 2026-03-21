-- =====================================================
-- CURELEX ADMIN PORTAL - SEED DATA
-- Run this AFTER schema.sql to populate sample data
-- Author: Aditya (Backend Development)
-- =====================================================

USE curelex_admin;


-- =====================================================
-- SEED: Admin Users (passwords will be hashed by the app)
-- Default password for all: Admin@123
-- =====================================================

-- Note: These passwords are bcrypt hashes of "Admin@123"
-- Generated using bcryptjs with 10 salt rounds

INSERT INTO admin_users (full_name, email, password, role) VALUES
('ceo', 'ceo@curelex.com', '$2a$12$mcT..cDtjsktLiTznEPVY.mSxkeANeN2UJLd53J13Gh6KdaedwB.G', 'CEO'),
('coo', 'coo@curelex.com', '$2a$12$jCquI7wq45evfoOAdf4tEObtNpibqdq/DHn9B8zNyx1BVeyurP..S', 'COO'),
('cto', 'cto@curelex.com', '$2a$12$/qhnfzvwFFDmko8yxbM0..d8HqndsHpjqC05fQPBhGGK1YT3Iw7ru', 'CTO'),
('cfo', 'cfo@curelex.com', '$2a$12$FHqB2AkLiosli5ubkBrOHOuHYIFh1IVRaIwbB2dB67/BzryETAaT.', 'CFO'),
('clo', 'clo@curelex.com', '$2a$12$EACkc9TQ0CDAVL/v1gHS5uPi88kvi8aydIaorNBk3WP.Y.OvYvA36', 'CLO'),
('chro', 'chro@curelex.com', '$2a$12$v5L9.4Qf5bXXn3H7.zdCJO7g.v70xAyj2d/HI9cQ23lX2K9zytFZy', 'CHRO'),
('community', 'community@curelex.com', '$2a$12$XNJROACR/B4Bwz/VbAG1eut8fe1KbVlP.cIanuWbqVsYTGwPpaO4a', 'Community');


-- =====================================================
-- SEED: Sample Doctors (simulating Public Portal data)
-- =====================================================

INSERT INTO doctors (full_name, email, phone, specialization, license_number, experience_years, qualification, status) VALUES
('Dr. Sarah Chen', 's.chen@mail.com', '9876543210', 'Cardiology', 'MC-2024-8891', 8, 'MD Cardiology', 'Active'),
('Dr. James Okoro', 'j.okoro@mail.com', '9876543211', 'Neurology', 'MC-2024-7723', 5, 'MD Neurology', 'Suspended'),
('Dr. Priya Sharma', 'p.sharma@mail.com', '9876543212', 'Pediatrics', 'MC-2024-6654', 7, 'MD Pediatrics', 'Active'),
('Dr. Marcus Webb', 'm.webb@mail.com', '9876543213', 'Orthopedics', 'MC-2024-5512', 10, 'MS Orthopedics', 'Active'),
('Dr. Lena Müller', 'l.muller@mail.com', '9876543214', 'Dermatology', 'MC-2024-4401', 6, 'MD Dermatology', 'Suspended');


-- =====================================================
-- SEED: Sample Patients (simulating Public Portal data)
-- =====================================================

INSERT INTO patients (full_name, email, phone, age, gender, status, last_visit, is_new_patient) VALUES
('Alice Johnson', 'alice@mail.com', '9123456780', 34, 'Female', 'Active', '2026-03-13', FALSE),
('Bob Williams', 'bob@mail.com', '9123456781', 52, 'Male', 'Active', '2026-03-12', FALSE),
('Charlie Brown', 'charlie@mail.com', '9123456782', 28, 'Male', 'Active', '2026-03-14', TRUE),
('Diana Ross', 'diana@mail.com', '9123456783', 45, 'Female', 'Inactive', '2026-02-20', FALSE),
('Ethan Hunt', 'ethan@mail.com', '9123456784', 38, 'Male', 'Active', '2026-03-15', TRUE),
('Fiona Apple', 'fiona@mail.com', '9123456785', 62, 'Female', 'Active', '2026-03-10', FALSE),
('George Martin', 'george@mail.com', '9123456786', 71, 'Male', 'Active', '2026-03-08', FALSE),
('Hannah Lee', 'hannah@mail.com', '9123456787', 22, 'Female', 'Active', '2026-03-16', TRUE),
('Ivan Petrov', 'ivan@mail.com', '9123456788', 55, 'Male', 'Active', '2026-03-11', FALSE),
('Jasmine Kaur', 'jasmine@mail.com', '9123456789', 19, 'Female', 'Active', '2026-03-17', TRUE);


-- =====================================================
-- SEED: Sample Doctor Applications (from Public Portal)
-- =====================================================

INSERT INTO doctor_applications (full_name, email, phone, specialization, license_number, experience_years, qualification, status, applied_at) VALUES
('Dr. Sarah Chen', 's.chen@mail.com', '9876543210', 'Cardiology', 'MC-2024-8891', 8, 'MD Cardiology', 'Pending', '2026-03-14 10:30:00'),
('Dr. James Okoro', 'j.okoro@mail.com', '9876543211', 'Neurology', 'MC-2024-7723', 5, 'MD Neurology', 'Pending', '2026-03-13 14:15:00'),
('Dr. Priya Sharma', 'p.sharma@mail.com', '9876543212', 'Pediatrics', 'MC-2024-6654', 7, 'MD Pediatrics', 'Approved', '2026-03-12 09:00:00'),
('Dr. Marcus Webb', 'm.webb@mail.com', '9876543213', 'Orthopedics', 'MC-2024-5512', 10, 'MS Orthopedics', 'Pending', '2026-03-12 11:45:00'),
('Dr. Lena Müller', 'l.muller@mail.com', '9876543214', 'Dermatology', 'MC-2024-4401', 6, 'MD Dermatology', 'Approved', '2026-03-11 16:20:00');
