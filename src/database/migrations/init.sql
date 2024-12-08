CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS students;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL
);

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(100) NOT NULL,
    lastname1 VARCHAR(100) NOT NULL,
    lastname2 VARCHAR(100) NOT NULL,
    dateofbirth DATE NOT NULL,
    gender VARCHAR(50) NOT NULL
);

-- Add indexes
CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_students_name ON students (name);