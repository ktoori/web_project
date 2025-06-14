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