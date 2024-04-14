INSERT INTO Members (first_name, last_name, password, email, join_date, address, phone_number, date_of_birth, gender, exercise_routines)
VALUES
('John', 'Doe', '123', 'john@member.com', '2023-04-01', '1234 Elm St', '123-456-7890', '1990-05-15', 'Male', 'Cardio every morning'),
('Jane', 'Smith', 'asd', 'jane@member.com', '2023-04-05', '5678 Maple St', '234-567-8901', '1985-08-25', 'Female', 'Strength training weekly'),
('Jim', 'Taylor', 'jim123', 'jim@member.com', '2023-04-10', '123 Oak Rd', '345-678-9012', '1975-03-18', 'Male', 'Running and swimming'),
('Lucy', 'Wilson', 'pass', 'lucy@member.com', '2023-04-15', '234 Pine Dr', '456-789-0123', '1993-12-05', 'Female', 'Yoga and pilates'),
('Tom', 'Brown', 'tompass', 'tom@member.com', '2023-04-20', '345 Birch Ave', '567-890-1234', '1989-11-11', 'Male', 'Cycling and aerobics'),
('Anna', 'Davis', 'anna987', 'anna@member.com', '2023-04-25', '456 Cedar Blvd', '678-901-2345', '1982-02-14', 'Female', 'Zumba dance'),
('Frank', 'Miller', 'frankie', 'frank@member.com', '2023-04-30', '789 Spruce St', '789-012-3456', '1978-09-09', 'Male', 'Bodybuilding'),
('Grace', 'Lee', 'graceful', 'grace@member.com', '2023-05-05', '890 Aspen Ct', '890-123-4567', '1986-06-06', 'Female', 'Mixed martial arts');

INSERT INTO Trainer (first_name, last_name, password, email, phone_number, date_of_birth, gender, start_hour, end_hour)
VALUES
('Alice', 'Johnson', '123', 'alice@trainer.com', '345-678-9012', '1980-12-12', 'Female', '09:00:00', '17:00:00'),
('Bob', 'Williams', 'bob', 'bob@trainer.com', '456-789-0123', '1975-07-07', 'Male', '11:00:00', '19:00:00'),
('Clara', 'Evans', 'secure123', 'clara@trainer.com', '234-567-8901', '1985-05-15', 'Female', '08:00:00', '16:00:00');

INSERT INTO Administrative_Staff (first_name, last_name, password, email, phone_number, date_of_birth)
VALUES
('Charlie', 'Brown', 'charlie', 'charlie@staff.com', '567-890-1234', '1982-09-09'),
('Daisy', 'Roberts', 'daisy', 'daisy@staff.com', '678-901-2345', '1979-01-22');

INSERT INTO Equipment (name, status)
VALUES
('Treadmill', 'Available'),
('Dumbbells', 'Available'),
('Stationary Bike', 'Available'),
('Elliptical Machine', 'Available'),
('Rowing Machine', 'Available'),
('Kettlebells', 'Available'),
('Exercise Ball', 'Available'),
('Resistance Bands', 'Available'),
('Medicine Ball', 'Available'),
('Pull-up Bar', 'Available');

INSERT INTO Room (max_space, room_name, start_hour, end_hour)
VALUES
(20, 'Aerobics Room', '14:00:00', '15:00:00'),
(15, 'Yoga Studio', '13:00:00', '14:00:00'),
(10, 'Spin Class Room', '10:00:00', '11:00:00'),
(12, 'Strength Training Room', '16:00:00', '17:00:00');

INSERT INTO Classes (description, space_left, day_of_the_week, start_time, end_time, trainer_id, room_id)
VALUES
('Yoga for Beginners', 15, 'Monday', '09:00:00', '10:30:00', 1, 2),
('Advanced Aerobics', 20, 'Wednesday', '11:00:00', '12:30:00', 2, 1),
('Beginner Session for Bycicle', 10, 'Tuesday', '10:00:00', '11:30:00', 3, 3),
('Strength and Conditioning', 12, 'Thursday', '16:00:00', '17:30:00', 1, 4),
('High-Intensity Interval Training', 10, 'Friday', '09:00:00', '10:00:00', 3, 1);