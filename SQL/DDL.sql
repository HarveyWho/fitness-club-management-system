CREATE TABLE Members (
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

CREATE TABLE Trainer (
    trainer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password VARCHAR(50),
    email VARCHAR(100),
    phone_number VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    start_hour TIME,
    end_hour TIME
);

CREATE TABLE Administrative_Staff (
    administrative_staff_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    password VARCHAR(50),
    email VARCHAR(100),
    phone_number VARCHAR(20),
    date_of_birth DATE
);

CREATE TABLE Fitness_Goals (
    member_id INT REFERENCES Members(member_id),
    weight_goal FLOAT,
    heart_rate_goal INT,
    blood_pressure_goal VARCHAR(20),
    BMI_goal FLOAT,
    duration_days  INT
);

CREATE TABLE Health_Statistics (
    member_id INT REFERENCES members(member_id),
    height FLOAT,
    weight FLOAT,
    heart_rate INT,
    blood_pressure VARCHAR(20),
    body_mass_index FLOAT
);

CREATE TABLE Room (
    room_id SERIAL PRIMARY KEY,
    max_space INT,
    room_name VARCHAR(100),
    start_hour TIME,
    end_hour TIME
);

CREATE TABLE Classes (
    class_id SERIAL PRIMARY KEY,
    description TEXT,
    space_left INT,
    day_of_the_week VARCHAR(20),
    start_time TIME,
    end_time TIME,
    trainer_id INT REFERENCES Trainer(trainer_id),
    room_id INT REFERENCES Room(Room_id)
);


CREATE TABLE Class_members (
    class_id INT REFERENCES Classes(class_id),
    member_id INT REFERENCES Members(member_id),
    first_name VARCHAR(50),
    last_name VARCHAR(50)
);

CREATE TABLE Equipment (
    equipment_id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    status VARCHAR(50)
);


CREATE TABLE Payments (
    payment_id SERIAL PRIMARY KEY,
    member_id INT REFERENCES members(member_id),
    amount FLOAT,
    payment_date DATE
);
