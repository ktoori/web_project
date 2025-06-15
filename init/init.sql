CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL  -- "user" или "admin"
);

CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    subject TEXT NOT NULL,
    lecturer TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    homework TEXT,
    date DATE,
    homework_due DATE
);
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    material_id INTEGER REFERENCES materials(id) ON DELETE CASCADE,
    user_email VARCHAR(255) NOT NULL,
    text TEXT,
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);