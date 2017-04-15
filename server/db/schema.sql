/*Schema for the expenselyfy.me database*/

CREATE OR REPLACE DATABASE app;

USE app;

CREATE TABLE users(
    user_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
	password VARCHAR(20) NOT NULL,
    is_admin bool DEFAULT FALSE
);

CREATE UNIQUE INDEX name ON users(name);

INSERT INTO users (name, password) VALUES ('Ulysses', 'metis');
INSERT INTO users (name, password) VALUES ('Wint', '@dril');
INSERT INTO users (name, password, is_admin) VALUES ('Juno', 'gr8h8r', TRUE);

CREATE TABLE expenses (
	expense_id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    date_time DATE DEFAULT NULL,
    amount DECIMAL(12,2) DEFAULT NULL,
	description VARCHAR(200) DEFAULT NULL,
	owner_id SMALLINT UNSIGNED NOT NULL,
	CONSTRAINT `fk_expenses_users`
		FOREIGN KEY (owner_id) REFERENCES users (user_id)
		ON DELETE CASCADE
		ON UPDATE RESTRICT
);

INSERT INTO expenses (amount, description, owner_id) VALUES ('200', 'Food', 2);
INSERT INTO expenses (amount, description, owner_id) VALUES ('3600', 'Candles', 2);
INSERT INTO expenses (amount, description, owner_id) VALUES ('45.02', 'Composite Bow', 1);