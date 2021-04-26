CREATE TABLE measurements(
    id SERIAL PRIMARY KEY,
    temperature FLOAT,
    humidity FLOAT,
    heatindex FLOAT,
    created TIMESTAMP DEFAULT NOW()
);