-- =====================================================
-- SEED DATA UPDATE (v2) - Financial & Activity Data
-- =====================================================

USE u626152625_curelexDb;

-- Seed Financial Transactions
INSERT INTO financial_transactions (type, category, amount, description, transaction_date) VALUES 
('Revenue', 'Service Fee', 45000.00, 'Monthly service subscriptions', '2026-01-15 10:00:00'),
('Revenue', 'Consultation', 12500.00, 'Doctor consultation fees share', '2026-01-20 14:30:00'),
('Expense', 'Payroll', 30000.00, 'Admin staff salaries', '2026-01-28 09:00:00'),
('Revenue', 'Service Fee', 48000.00, 'Monthly service subscriptions', '2026-02-15 10:00:00'),
('Revenue', 'Consultation', 15000.00, 'Doctor consultation fees share', '2026-02-22 15:45:00'),
('Expense', 'Maintenance', 5000.00, 'Server and cloud maintenance', '2026-02-25 11:00:00'),
('Revenue', 'Service Fee', 52000.00, 'Monthly service subscriptions', '2026-03-10 10:00:00'),
('Revenue', 'Consultation', 18500.00, 'Doctor consultation fees share', '2026-03-18 16:20:00'),
('Expense', 'Marketing', 12000.00, 'Digital ads campaign', '2026-03-20 08:00:00');

-- Seed System Analytics Metrics
INSERT INTO system_analytics_metrics (metric_name, metric_value, metric_unit) VALUES 
('cpu_usage', 24.5, '%'),
('memory_usage', 1450.0, 'MB'),
('active_sessions', 128.0, 'count'),
('request_latency', 45.0, 'ms');

-- Seed Activity Logs (Sample)
INSERT INTO activity_logs (user_id, user_role, action_type, module, details, ip_address) VALUES 
(1, 'Admin', 'LOGIN', 'Auth', '{"method": "POST", "path": "/api/auth/login"}', '127.0.0.1'),
(1, 'Admin', 'APPROVE_DOCTOR', 'DoctorVerification', '{"id": 5, "status": "Approved"}', '127.0.0.1'),
(2, 'Admin', 'EXPORT_FINANCE', 'Finance', '{"format": "EXCEL", "period": "Q1"}', '192.168.1.5');
