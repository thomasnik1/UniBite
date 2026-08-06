USE unibite;

-- Δημιουργία Πίνακα Χρηστών
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') DEFAULT 'student',
    credits INT DEFAULT 5
);

-- Δημιουργία Πίνακα Αγγελιών
CREATE TABLE IF NOT EXISTS ads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cook_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    photo_url VARCHAR(255) DEFAULT NULL,
    allergens TEXT,
    portions INT NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    pickup_time DATETIME NOT NULL,
    status ENUM('active', 'inactive', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cook_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Δημιουργία Πίνακα Αιτημάτων
CREATE TABLE IF NOT EXISTS requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_id INT NOT NULL,
    consumer_id INT NOT NULL,
    portions INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    is_picked_up BOOLEAN DEFAULT FALSE,
    rating INT CHECK (rating >= 1 AND rating <= 5) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pickup_time TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
    FOREIGN KEY (consumer_id) REFERENCES users(id) ON DELETE CASCADE
);
