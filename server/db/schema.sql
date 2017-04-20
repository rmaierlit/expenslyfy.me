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
    date_time DATETIME DEFAULT NULL,
    amount DECIMAL(15,2) DEFAULT NULL,
	description VARCHAR(200) DEFAULT NULL,
	owner_id SMALLINT UNSIGNED NOT NULL,
	CONSTRAINT `fk_expenses_users`
		FOREIGN KEY (owner_id) REFERENCES users (user_id)
		ON DELETE CASCADE
		ON UPDATE RESTRICT
);

/*expenses for user Wint*/
INSERT INTO expenses (amount, date_time, description, owner_id) VALUES ('200', '2017-4-01 00:00:00', 'Food', 2);
INSERT INTO expenses (amount, date_time, description, owner_id) VALUES ('150', '2017-4-11 00:00:00', 'Data', 2);
INSERT INTO expenses (amount, date_time, description, owner_id) VALUES ('800', '2017-4-15 00:00:00', 'Rent', 2);
INSERT INTO expenses (amount, date_time, description, owner_id) VALUES ('3600', '2017-4-18 00:00:00', 'Candles', 2);
INSERT INTO expenses (amount, date_time, description, owner_id) VALUES ('150', '2017-4-19 00:00:00', 'Utility', 2);

/*expenses for user Ulysses*/
INSERT INTO expenses (amount, date_time, description, owner_id) VALUES ('60.5', '2017-1-15 16:07:00', 'Bow', 1);
INSERT INTO expenses (amount, date_time, description, owner_id) VALUES ('32.78', '2017-1-16 13:08:03', 'Arrows', 1);
INSERT INTO expenses (amount, date_time, description, owner_id) VALUES ('745.22', '2017-4-12 23:59:59', 'Wooden Horse', 1);

/*expenses for admin Juno*/
INSERT INTO expenses (amount, date_time, description, owner_id) VALUES ('44.02', '2017-3-15 00:00:00', 'Pills', 3);