DROP TABLE IF EXISTS pool_members CASCADE;
DROP TABLE IF EXISTS pools CASCADE;
DROP TABLE IF EXISTS bank_entries CASCADE;
DROP TABLE IF EXISTS ship_compliance CASCADE;
DROP TABLE IF EXISTS routes CASCADE;

CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    route_id VARCHAR(50) UNIQUE NOT NULL,
    vessel_type VARCHAR(100) NOT NULL,
    fuel_type VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    ghg_intensity NUMERIC(10,4) NOT NULL,
    fuel_consumption NUMERIC(12,2) NOT NULL,
    distance NUMERIC(12,2) NOT NULL,
    total_emissions NUMERIC(12,2) NOT NULL,
    is_baseline BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ship_compliance (
    id SERIAL PRIMARY KEY,
    ship_id VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    cb_gco2eq NUMERIC(18,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ship_compliance_route
        FOREIGN KEY (ship_id) REFERENCES routes(route_id) ON DELETE CASCADE
);

CREATE TABLE bank_entries (
    id SERIAL PRIMARY KEY,
    ship_id VARCHAR(50) NOT NULL,
    year INT NOT NULL,
    amount_gco2eq NUMERIC(18,2) NOT NULL,
    entry_type VARCHAR(20) DEFAULT 'banked',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bank_entries_route
        FOREIGN KEY (ship_id) REFERENCES routes(route_id) ON DELETE CASCADE
);

CREATE TABLE pools (
    id SERIAL PRIMARY KEY,
    year INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pool_members (
    id SERIAL PRIMARY KEY,
    pool_id INT NOT NULL,
    ship_id VARCHAR(50) NOT NULL,
    cb_before NUMERIC(18,2) NOT NULL,
    cb_after NUMERIC(18,2) NOT NULL,
    CONSTRAINT fk_pool_members_pool
        FOREIGN KEY (pool_id) REFERENCES pools(id) ON DELETE CASCADE,
    CONSTRAINT fk_pool_members_route
        FOREIGN KEY (ship_id) REFERENCES routes(route_id) ON DELETE CASCADE
);