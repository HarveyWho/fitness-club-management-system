CREATE TABLE IF NOT EXISTS Members (
    member_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password VARCHAR(50),
    email VARCHAR(100),
    join_date DATE,
    address VARCHAR(255),
    phone_number VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    exercise_routines TEXT
);

CREATE TABLE IF NOT EXISTS Trainer (
    trainer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password VARCHAR(50),
    email VARCHAR(100),
    phone_number VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS Administrative_Staff (
    administrative_staff_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password VARCHAR(50),
    email VARCHAR(100),
    phone_number VARCHAR(20),
    date_of_birth DATE
);

CREATE TABLE IF NOT EXISTS Fitness_Goals (
    member_id INT REFERENCES Members(member_id),
    weight_goal FLOAT,
    heart_rate_goal INT,
    blood_pressure_goal VARCHAR(20),
    BMI_goal FLOAT,
    duration_days  INT
);

CREATE TABLE IF NOT EXISTS Health_Statistics (
    member_id INT REFERENCES members(member_id),
    height FLOAT,
    weight FLOAT,
    heart_rate INT,
    blood_pressure VARCHAR(20),
    body_mass_index FLOAT
);

CREATE TABLE IF NOT EXISTS Room (
    room_id SERIAL PRIMARY KEY,
    max_space INT,
    room_name VARCHAR(100),
    start_hour TIME,
    end_hour TIME
);

CREATE TABLE IF NOT EXISTS Classes (
    class_id SERIAL PRIMARY KEY,
    description TEXT,
    space_left INT,
    date DATE,
    start_time TIME,
    end_time TIME,
    trainer_id INT REFERENCES Trainer(trainer_id),
    room_id INT REFERENCES Room(Room_id)
);


CREATE TABLE IF NOT EXISTS Class_members (
    class_id INT REFERENCES Classes(class_id),
    member_id INT REFERENCES Members(member_id),
    first_name VARCHAR(50),
    last_name VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Equipment (
    equipment_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    status VARCHAR(50)
);


CREATE TABLE IF NOT EXISTS Payments (
    payment_id SERIAL PRIMARY KEY,
    member_id INT REFERENCES members(member_id),
    amount FLOAT,
    payment_date DATE
);

INSERT INTO Members (first_name, last_name, password, email, join_date, address, phone_number, date_of_birth, gender, exercise_routines)
VALUES
('John', 'Doe', '123', 'john@member.com', '2023-04-01', '1234 Elm St', '123-456-7890', '1990-05-15', 'Male', 'Cardio every morning'),
('Jane', 'Smith', 'asd', 'jane@member.com', '2023-04-05', '5678 Maple St', '234-567-8901', '1985-08-25', 'Female', 'Strength training weekly');


INSERT INTO Trainer (first_name, last_name, password, email, phone_number, date_of_birth, gender)
VALUES
('Alice', 'Johnson', '123', 'alice@trainer.com', '345-678-9012', '1980-12-12', 'Female'),
('Bob', 'Williams', 'bob', 'bob@trainer.com', '456-789-0123', '1975-07-07', 'Male');


INSERT INTO Administrative_Staff (first_name, last_name, password, email, phone_number, date_of_birth)
VALUES
('Charlie', 'Brown', 'charlie', 'charlie@staff.com', '567-890-1234', '1982-09-09');

INSERT INTO Fitness_Goals (member_id, weight_goal, heart_rate_goal, blood_pressure_goal, BMI_goal, duration_days)
VALUES
(1, 180.0, 70, '120/80', 22.0, 90),
(2, 130.0, 75, '115/75', 20.0, 120);

INSERT INTO Health_Statistics (member_id, height, weight, heart_rate, blood_pressure, body_mass_index)
VALUES
(1, 5.9, 195, 72, '130/85', 27.5),
(2, 5.5, 140, 68, '118/78', 23.2);


INSERT INTO Room (max_space, room_name, start_hour, end_hour)
VALUES
(20, 'Aerobics Room', '14:00:00', '15:00:00'),
(15, 'Yoga Studio', '13:00:00', '14:00:00');


INSERT INTO Classes (description, space_left, date, start_time, end_time, trainer_id, room_id)
VALUES
('Yoga for Beginners', 15, '2023-04-10', '09:00:00', '10:30:00', 1, 2),
('Advanced Aerobics', 20, '2023-04-10', '11:00:00', '12:30:00', 2, 1);


INSERT INTO Class_members (class_id, member_id, first_name, last_name)
VALUES
(1, 1, 'John', 'Doe'),
(2, 2, 'Jane', 'Smith');


INSERT INTO Equipment (name, status)
VALUES
('Treadmill', 'Available'),
('Dumbbells', 'Available');

INSERT INTO Payments (member_id, amount, payment_date)
VALUES
(1, 50.0, '2023-04-01'),
(2, 45.0, '2023-04-02');
