/*Schema for the expenselyfy.me database*/

CREATE OR REPLACE DATABASE app;

USE app;

CREATE OR REPLACE TABLE users(
    user_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(20) DEFAULT NULL,
    is_admin bool DEFAULT FALSE
);

INSERT INTO users (name) VALUES ('Ulysses');
INSERT INTO users (name, is_admin) VALUES ('JUNO', TRUE);

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

INSERT INTO expenses (amount, description, owner_id) VALUES ('3600.02', 'Candles', 1);