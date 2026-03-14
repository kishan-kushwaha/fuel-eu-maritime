INSERT INTO routes (
    route_id,
    vessel_type,
    fuel_type,
    year,
    ghg_intensity,
    fuel_consumption,
    distance,
    total_emissions,
    is_baseline
) VALUES
('R001', 'Container', 'HFO', 2024, 91.0000, 5000.00, 12000.00, 4500.00, FALSE),
('R002', 'BulkCarrier', 'LNG', 2024, 88.0000, 4800.00, 11500.00, 4200.00, FALSE),
('R003', 'Tanker', 'MGO', 2024, 93.5000, 5100.00, 12500.00, 4700.00, FALSE),
('R004', 'RoRo', 'HFO', 2025, 89.2000, 4900.00, 11800.00, 4300.00, TRUE),
('R005', 'Container', 'LNG', 2025, 90.5000, 4950.00, 11900.00, 4400.00, FALSE);

INSERT INTO ship_compliance (ship_id, year, cb_gco2eq) VALUES
('R001', 2024, -34112000.00),
('R002', 2024, 260169600.00),
('R003', 2024, -870593400.00),
('R004', 2025, 27552000.00),
('R005', 2025, -236775600.00);

INSERT INTO bank_entries (ship_id, year, amount_gco2eq, entry_type) VALUES
('R002', 2024, 100000000.00, 'banked'),
('R004', 2025, 15000000.00, 'banked');

INSERT INTO pools (id, year) VALUES
(1, 2025),
(2, 2025);

INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after) VALUES
(1, 'R004', 27552000.00, 15000000.00),
(1, 'R005', -236775600.00, -194223600.00),
(2, 'R002', 260169600.00, 180000000.00),
(2, 'R003', -870593400.00, -790423800.00);