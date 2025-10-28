-- Sample SQL file that violates L009 (missing newline at end of file)
SELECT
    customer_id,
    customer_name,
    email
FROM customers
WHERE status = 'active';