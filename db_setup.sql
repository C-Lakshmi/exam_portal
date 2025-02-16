-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 16, 2025 at 06:20 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `exam_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `dashboard`
--

CREATE TABLE `dashboard` (
  `result_id` int(11) NOT NULL,
  `stud_id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `score` int(11) NOT NULL,
  `total_qs` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dashboard`
--

INSERT INTO `dashboard` (`result_id`, `stud_id`, `exam_id`, `score`, `total_qs`) VALUES
(1, 29, 11, 2, 7),
(2, 29, 11, 3, 7),
(3, 29, 11, 7, 7),
(4, 22, 7, 6, 7),
(5, 22, 8, 5, 7),
(6, 22, 1, 0, 4),
(7, 27, 7, 5, 7);

-- --------------------------------------------------------

--
-- Table structure for table `exams`
--

CREATE TABLE `exams` (
  `exam_id` int(11) NOT NULL,
  `exam_name` text NOT NULL,
  `dept` text NOT NULL,
  `slot` datetime NOT NULL,
  `fees` bigint(20) NOT NULL,
  `duration` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exams`
--

INSERT INTO `exams` (`exam_id`, `exam_name`, `dept`, `slot`, `fees`, `duration`) VALUES
(1, 'Math Midterm', 'Mathematics', '2025-02-14 18:28:59', 500, 90),
(2, 'Physics Final', 'Physics', '2025-02-12 19:07:00', 700, 120),
(3, 'Chemistry Quiz', 'Chemistry', '2025-02-25 10:00:00', 300, 60),
(4, 'Biology Exam', 'Biology', '2025-02-12 20:30:00', 600, 45),
(5, 'English Test', 'Literature', '2025-03-05 11:00:00', 400, 150),
(6, 'History Quiz', 'Social Science', '2025-03-10 10:00:00', 450, 180),
(7, 'Computer Science Exam', 'Computer Science', '2025-02-12 20:30:00', 800, 100),
(8, 'Economics Test', 'Economics', '2025-02-12 02:40:00', 350, 110),
(9, 'Philosophy Final', 'Social Science', '2025-03-25 13:00:00', 500, 75),
(10, 'Statistics Exam', 'Mathematics', '2025-03-30 11:00:00', 600, 95),
(11, 'Social Science', 'Social Science', '2025-02-11 22:55:00', 200, 60),
(12, 'English Literature Quiz', 'Literature', '2025-02-12 14:40:00', 300, 60),
(13, 'Mathematics Quiz', 'Mathematics', '2025-05-12 16:40:00', 600, 60);

-- --------------------------------------------------------

--
-- Table structure for table `exam_portal`
--

CREATE TABLE `exam_portal` (
  `exam_id` int(11) NOT NULL,
  `stud_id` int(11) NOT NULL,
  `ques_id` int(11) NOT NULL,
  `time_spent` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `exam_portal`
--

INSERT INTO `exam_portal` (`exam_id`, `stud_id`, `ques_id`, `time_spent`) VALUES
(11, 29, 13, '00:00:02'),
(11, 29, 14, '00:00:01'),
(11, 29, 46, '00:00:02'),
(11, 29, 47, '00:00:00'),
(11, 29, 48, '00:00:00'),
(11, 29, 49, '00:00:00'),
(11, 29, 50, '00:00:00'),
(11, 29, 13, '00:00:02'),
(11, 29, 14, '00:00:01'),
(11, 29, 46, '00:00:01'),
(11, 29, 47, '00:00:02'),
(11, 29, 48, '00:00:02'),
(11, 29, 49, '00:00:04'),
(11, 29, 50, '00:00:02'),
(7, 22, 15, '00:00:07'),
(7, 22, 16, '00:00:19'),
(7, 22, 51, '00:00:05'),
(7, 22, 52, '00:00:02'),
(7, 22, 53, '00:00:04'),
(7, 22, 54, '00:00:06'),
(7, 22, 55, '00:00:08'),
(8, 22, 17, '00:00:10'),
(8, 22, 18, '00:00:05'),
(8, 22, 56, '00:00:04'),
(8, 22, 57, '00:00:05'),
(8, 22, 58, '00:00:05'),
(8, 22, 59, '00:00:03'),
(8, 22, 60, '00:00:07'),
(1, 22, 1, '00:00:05'),
(1, 22, 3, '00:00:00'),
(1, 22, 6, '00:00:00'),
(1, 22, 8, '00:00:00'),
(7, 27, 15, '00:00:07'),
(7, 27, 16, '00:00:07'),
(7, 27, 51, '00:00:05'),
(7, 27, 52, '00:00:23'),
(7, 27, 53, '00:00:04'),
(7, 27, 54, '00:00:12'),
(7, 27, 55, '00:00:30');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `stud_id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `payment_date` datetime DEFAULT current_timestamp(),
  `fees` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `stud_id`, `exam_id`, `payment_date`, `fees`) VALUES
(1, 1, 2, '2025-01-30 22:42:12', 100.00),
(5, 11, 2, '2025-02-08 16:05:07', 700.00),
(6, 11, 4, '2025-02-08 16:05:15', 600.00),
(8, 11, 3, '2025-02-08 16:09:55', 300.00),
(15, 11, 7, '2025-02-08 16:13:35', 800.00),
(22, 11, 1, '2025-02-08 16:21:41', 500.00),
(23, 22, 1, '2025-02-08 16:27:58', 500.00),
(24, 22, 6, '2025-02-08 16:43:35', 450.00),
(25, 22, 11, '2025-02-08 21:30:00', 200.00),
(26, 27, 1, '2025-02-12 14:26:21', 500.00);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `ques_id` int(11) NOT NULL,
  `ques` text NOT NULL,
  `opt1` varchar(50) NOT NULL,
  `opt2` varchar(50) NOT NULL,
  `opt3` varchar(50) NOT NULL,
  `opt4` varchar(50) NOT NULL,
  `ans` varchar(50) NOT NULL,
  `dept` varchar(255) DEFAULT NULL,
  `difficulty` text NOT NULL,
  `exam_id` int(11) DEFAULT NULL,
  `topic` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`ques_id`, `ques`, `opt1`, `opt2`, `opt3`, `opt4`, `ans`, `dept`, `difficulty`, `exam_id`, `topic`) VALUES
(1, 'What is 2+2?', '3', '4', '5', '6', '4', 'Mathematics', 'Easy', 1, 'Arithmetic'),
(2, 'What is the capital of France?', 'Berlin', 'Madrid', 'Paris', 'Rome', 'Paris', 'Social Science', 'Easy', 9, 'Geography'),
(3, 'Solve: 5x = 25', '3', '5', '10', '25', '5', 'Mathematics', 'Easy', 1, 'Algebra'),
(4, 'Who wrote \"Hamlet\"?', 'Shakespeare', 'Dickens', 'Austen', 'Hemingway', 'Shakespeare', 'Literature', 'Easy', 5, 'Literature'),
(5, 'What is H2O?', 'Hydrogen', 'Oxygen', 'Water', 'Helium', 'Water', 'Chemistry', 'Easy', 3, 'Chemistry'),
(6, 'What is 10/2?', '3', '5', '6', '7', '5', 'Mathematics', 'Easy', 1, 'Arithmetic'),
(7, 'Which planet is known as the Red Planet?', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Mars', 'Physics', 'Easy', 4, 'Astronomy'),
(8, 'Find the derivative of x^2.', '2x', 'x^2', 'x', '1', '2x', 'Mathematics', 'Easy', 1, 'Calculus'),
(9, 'Who painted the Mona Lisa?', 'Van Gogh', 'Picasso', 'Da Vinci', 'Monet', 'Da Vinci', 'Social Science', 'Easy', 6, 'Literature'),
(10, 'What is the boiling point of water?', '90°C', '100°C', '110°C', '120°C', '100°C', 'Physics', 'Easy', 2, 'Physics'),
(11, 'What is the powerhouse of the cell?', 'Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Body', 'Mitochondria', 'Biology', 'Easy', 4, 'Cell Biology'),
(12, 'What is the basic unit of life?', 'Atom', 'Molecule', 'Cell', 'Organ', 'Cell', 'Biology', 'Easy', 4, 'Cell Biology'),
(13, 'Who is known as the Father of the Indian Constitution?', 'Mahatma Gandhi', 'Jawaharlal Nehru', 'B.R. Ambedkar', 'Subhash Chandra Bose', 'B.R. Ambedkar', 'Social Science', 'Easy', 11, 'History'),
(14, 'What is the primary role of the legislature?', 'Interpret laws', 'Enforce laws', 'Make laws', 'Evaluate laws', 'Make laws', 'Social Science', 'Medium', 11, 'Human Anatomy'),
(15, 'What does HTTP stand for?', 'HyperText Transfer Protocol', 'HyperText Transmission Process', 'HyperText Transfer Program', 'Hyper Transfer Protocol', 'HyperText Transfer Protocol', 'Computer Science', 'Easy', 7, 'Web Development'),
(16, 'What is the binary representation of the decimal number 10?', '1010', '1100', '1001', '1110', '1010', 'Computer Science', 'Easy', 7, 'Number Systems'),
(17, 'What is the term for an extended period of economic downturn?', 'Recession', 'Inflation', 'Stagflation', 'Depression', 'Recession', 'Economics', 'Easy', 8, 'Macroeconomics'),
(18, 'What does GDP stand for?', 'Gross Domestic Product', 'Global Development Progress', 'Gross Development Product', 'Global Domestic Production', 'Gross Domestic Product', 'Economics', 'Easy', 8, 'Macroeconomics'),
(19, 'Who wrote \"Pride and Prejudice\"?', 'Jane Austen', 'Emily Bronte', 'Virginia Woolf', 'Mary Shelley', 'Jane Austen', 'Literature', 'Medium', 5, 'Literature'),
(20, 'What is a sonnet?', 'A short story', 'A type of play', 'A 14-line poem', 'A type of essay', 'A 14-line poem', 'Literature', 'Medium', 5, 'Literature'),
(21, 'What is the square root of 144?', '12', '14', '16', '18', '12', 'Mathematics', 'Easy', 3, 'Arithmetic'),
(22, 'If x = 3, what is the value of 2x + 5?', '9', '11', '15', '17', '11', 'Mathematics', 'Easy', 3, 'Arithmetic'),
(23, 'What is the area of a circle with radius 7?', '154', '49', '77', '94', '154', 'Mathematics', 'Medium', 3, 'Geometry'),
(24, 'What is the derivative of sin(x)?', 'cos(x)', '-cos(x)', 'tan(x)', 'sec(x)', 'cos(x)', 'Mathematics', 'Medium', 3, 'Calculus'),
(25, 'Solve: 2x - 4 = 10', '5', '6', '7', '8', '7', 'Mathematics', 'Easy', 3, 'Arithmetic'),
(26, 'What is the speed of light in a vacuum?', '3x10^8 m/s', '3x10^6 m/s', '3x10^9 m/s', 'None', '3x10^8 m/s', 'Physics', 'Easy', 6, 'Optics'),
(27, 'What is Newton\'s First Law?', 'F = ma', 'Objects remain at rest or in motion unless acted u', 'Action = Reaction', 'None', 'Objects remain at rest or in motion unless acted u', 'Physics', 'Medium', 6, 'Mechanics'),
(28, 'What is the SI unit of force?', 'Joule', 'Pascal', 'Newton', 'Watt', 'Newton', 'Physics', 'Easy', 6, 'Mechanics'),
(29, 'What is the formula for kinetic energy?', '1/2mv^2', 'mv', 'mg', 'v^2/2', '1/2mv^2', 'Physics', 'Easy', 6, 'Thermodynamics'),
(30, 'What is the acceleration due to gravity on Earth?', '9.8 m/s^2', '10 m/s^2', '8.5 m/s^2', '9.2 m/s^2', '9.8 m/s^2', 'Physics', 'Easy', 6, 'Gravitation'),
(31, 'What is the chemical symbol for water?', 'HO', 'H2O', 'O2', 'CO2', 'H2O', 'Chemistry', 'Easy', 9, 'Basic Chemistry'),
(32, 'What is the pH of pure water?', '0', '7', '10', '14', '7', 'Chemistry', 'Easy', 9, 'Basic Chemistry'),
(33, 'What is the formula for methane?', 'CH4', 'C2H6', 'CH3', 'C2H4', 'CH4', 'Chemistry', 'Easy', 9, 'Organic Chemistry'),
(34, 'What is Avogadro\'s number?', '6.02 x 10^23', '6.022 x 10^23', '6.00 x 10^23', '6.20 x 10^23', '6.022 x 10^23', 'Chemistry', 'Medium', 9, 'Physical Chemistry'),
(35, 'Which element has the atomic number 1?', 'Oxygen', 'Hydrogen', 'Helium', 'Carbon', 'Hydrogen', 'Chemistry', 'Easy', 9, 'Physical Chemistry'),
(36, 'What is the smallest unit of heredity?', 'Gene', 'Chromosome', 'Nucleus', 'Cell', 'Gene', 'Biology', 'Medium', 4, 'Heredity and Evolution'),
(37, 'What organ pumps blood throughout the body?', 'Brain', 'Heart', 'Lungs', 'Liver', 'Heart', 'Biology', 'Easy', 4, 'Circulatory System'),
(38, 'What is the process of converting glucose to energy called?', 'Photosynthesis', 'Respiration', 'Fermentation', 'Digestion', 'Respiration', 'Biology', 'Medium', 4, 'Cell Biology'),
(39, 'Which organelle is responsible for photosynthesis?', 'Mitochondria', 'Chloroplast', 'Nucleus', 'Golgi Apparatus', 'Chloroplast', 'Biology', 'Medium', 4, 'Prose'),
(40, 'What is the basic unit of the nervous system?', 'Neuron', 'Axon', 'Cell', 'Synapse', 'Neuron', 'Biology', 'Medium', 4, 'Nervous System'),
(41, 'Who wrote \"The Great Gatsby\"?', 'F. Scott Fitzgerald', 'Ernest Hemingway', 'John Steinbeck', 'Mark Twain', 'F. Scott Fitzgerald', 'Literature', 'Medium', 5, 'Prose'),
(42, 'What is the rhyme scheme of a Shakespearean sonnet?', 'ABABCDCDEFEFGG', 'AABBCCDD', 'ABABABAB', 'ABCDEFABCDEF', 'ABABCDCDEFEFGG', 'Literature', 'Medium', 5, 'Poetry'),
(43, 'Who wrote \"To Kill a Mockingbird\"?', 'Harper Lee', 'Jane Austen', 'George Orwell', 'Mark Twain', 'Harper Lee', 'Literature', 'Medium', 5, 'Prose'),
(44, 'What is a metaphor?', 'A type of rhyme', 'A comparison without using \"like\" or \"as\"', 'A story', 'A poem', 'A comparison without using \"like\" or \"as\"', 'Literature', 'Easy', 5, 'Prose'),
(45, 'Who is the author of \"Macbeth\"?', 'Shakespeare', 'Milton', 'Chaucer', 'Dickens', 'Shakespeare', 'Literature', 'Easy', 5, 'Prose'),
(46, 'What is democracy?', 'Rule by one', 'Rule by the majority', 'Rule by a monarch', 'Rule by military', 'Rule by the majority', 'Social Science', 'Easy', 11, 'Politics'),
(47, 'What is the study of the Earth called?', 'Astronomy', 'Geography', 'Geology', 'Anthropology', 'Geography', 'Social Science', 'Easy', 11, 'Social Science'),
(48, 'Who is the Father of Sociology?', 'Karl Marx', 'Max Weber', 'Auguste Comte', 'Emile Durkheim', 'Auguste Comte', 'Social Science', 'Medium', 11, 'History'),
(49, 'What does GDP measure?', 'Economic performance', 'Political stability', 'Military strength', 'Social welfare', 'Economic performance', 'Social Science', 'Medium', 11, 'Macroeconomics'),
(50, 'What is the capital of India?', 'Mumbai', 'Kolkata', 'Delhi', 'Chennai', 'Delhi', 'Social Science', 'Easy', 11, 'Geography'),
(51, 'What is an algorithm?', 'A coding language', 'A step-by-step problem-solving process', 'A type of program', 'A type of bug', 'A step-by-step problem-solving process', 'Computer Science', 'Easy', 7, 'Algorithms'),
(52, 'What does RAM stand for?', 'Random Access Memory', 'Read Access Memory', 'Rapid Access Memory', 'Run Access Memory', 'Random Access Memory', 'Computer Science', 'Easy', 7, 'Computer Architecture'),
(53, 'What is the base of the binary number system?', '2', '8', '10', '16', '2', 'Computer Science', 'Easy', 7, 'Number Systems'),
(54, 'What is the full form of CPU?', 'Central Process Unit', 'Central Processing Unit', 'Computer Processing Unit', 'Central Performance Unit', 'Central Processing Unit', 'Computer Science', 'Easy', 7, 'Computer Architecture'),
(55, 'What is an operating system?', 'Hardware', 'System software', 'A type of virus', 'A type of database', 'System software', 'Computer Science', 'Medium', 7, 'Operating Systems'),
(56, 'What is inflation?', 'Decrease in prices', 'Increase in prices', 'No change in prices', 'Random price fluctuations', 'Increase in prices', 'Economics', 'Medium', 8, 'Macroeconomics'),
(57, 'What is the primary sector?', 'Agriculture', 'Manufacturing', 'Services', 'IT', 'Agriculture', 'Economics', 'Easy', 8, 'Economics'),
(58, 'What is supply and demand?', 'Market forces determining prices', 'Government regulations', 'Economic growth rates', 'Financial policies', 'Market forces determining prices', 'Economics', 'Medium', 8, 'Market Analysis'),
(59, 'What is a monopoly?', 'Single seller in the market', 'Multiple sellers', 'Buyer dominance', 'Government control', 'Single seller in the market', 'Economics', 'Medium', 8, 'Market Structures'),
(60, 'What does fiscal policy deal with?', 'Government spending and taxes', 'Interest rates', 'Stock market', 'Trade policies', 'Government spending and taxes', 'Economics', 'Medium', 8, 'Public Finance');

-- --------------------------------------------------------

--
-- Table structure for table `reschedule_requests`
--

CREATE TABLE `reschedule_requests` (
  `request_id` int(11) NOT NULL,
  `stud_id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `new_slot` datetime NOT NULL,
  `request_status` enum('Pending','Approved','Rejected') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reschedule_requests`
--

INSERT INTO `reschedule_requests` (`request_id`, `stud_id`, `exam_id`, `new_slot`, `request_status`) VALUES
(2, 22, 1, '2025-02-14 23:58:59', 'Approved');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('7VsD4BL9gxxitzPadF3yQpPZZwkQU68j', 1739458912, '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-02-13T14:25:39.795Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"stud_id\":27,\"stud_name\":\"Lasya Madhu Sundar\"}');

-- --------------------------------------------------------

--
-- Table structure for table `solved`
--

CREATE TABLE `solved` (
  `solve_id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `given_ans` varchar(50) DEFAULT NULL,
  `ans` varchar(50) NOT NULL,
  `stud_id` int(11) DEFAULT NULL,
  `ques_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `solved`
--

INSERT INTO `solved` (`solve_id`, `exam_id`, `given_ans`, `ans`, `stud_id`, `ques_id`) VALUES
(1, 11, 'B.R. Ambedkar', 'B.R. Ambedkar', 29, 13),
(2, 11, 'Make laws', 'Make laws', 29, 14),
(3, 11, 'Rule by the majority', 'Rule by the majority', 29, 46),
(4, 11, 'Geography', 'Geography', 29, 47),
(5, 11, 'Auguste Comte', 'Auguste Comte', 29, 48),
(6, 11, 'Economic performance', 'Economic performance', 29, 49),
(7, 11, 'Delhi', 'Delhi', 29, 50),
(8, 7, 'HyperText Transfer Protocol', 'HyperText Transfer Protocol', 22, 15),
(9, 7, '1010', '1010', 22, 16),
(10, 7, 'A step-by-step problem-solving process', 'A step-by-step problem-solving process', 22, 51),
(11, 7, 'Random Access Memory', 'Random Access Memory', 22, 52),
(12, 7, '2', '2', 22, 53),
(13, 7, 'Central Process Unit', 'Central Processing Unit', 22, 54),
(14, 7, 'System software', 'System software', 22, 55),
(15, 8, 'Recession', 'Recession', 22, 17),
(16, 8, 'Gross Domestic Product', 'Gross Domestic Product', 22, 18),
(17, 8, 'Decrease in prices', 'Increase in prices', 22, 56),
(18, 8, 'Manufacturing', 'Agriculture', 22, 57),
(19, 8, 'Market forces determining prices', 'Market forces determining prices', 22, 58),
(20, 8, 'Single seller in the market', 'Single seller in the market', 22, 59),
(21, 8, 'Government spending and taxes', 'Government spending and taxes', 22, 60),
(22, 1, NULL, '4', 22, 1),
(23, 1, NULL, '5', 22, 3),
(24, 1, NULL, '5', 22, 6),
(25, 1, NULL, '2x', 22, 8),
(26, 7, 'HyperText Transfer Protocol', 'HyperText Transfer Protocol', 27, 15),
(27, 7, '1010', '1010', 27, 16),
(28, 7, 'A step-by-step problem-solving process', 'A step-by-step problem-solving process', 27, 51),
(29, 7, 'Run Access Memory', 'Random Access Memory', 27, 52),
(30, 7, '2', '2', 27, 53),
(31, 7, 'Central Processing Unit', 'Central Processing Unit', 27, 54),
(32, 7, 'A type of virus', 'System software', 27, 55);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `stud_id` int(11) NOT NULL,
  `stud_name` text NOT NULL,
  `email` varchar(100) NOT NULL,
  `Phone` varchar(50) NOT NULL,
  `photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`stud_id`, `stud_name`, `email`, `Phone`, `photo`) VALUES
(1, 'Alice Smith', 'alice@example.com', '1234567890', 'photo_1.jpg'),
(2, 'Bob Johnson', 'bob@example.com', '9876543210', 'photo_2.jpg'),
(3, 'Charlie Brown', 'charlie@example.com', '4567891230', 'photo_3.jpg'),
(4, 'Diana Prince', 'diana@example.com', '7891234560', 'photo_4.jpg'),
(5, 'Evan Davis', 'evan@example.com', '3216549870', 'photo_5.jpg'),
(6, 'Franklin Hall', 'franklin@example.com', '1231231234', 'photo_6.jpg'),
(7, 'Grace Lee', 'grace@example.com', '9879879876', 'photo_7.jpg'),
(8, 'Hannah Wright', 'hannah@example.com', '4564564567', 'photo_8.jpg'),
(9, 'Isaac Newton', 'isaac@example.com', '7897897890', 'photo_9.jpg'),
(10, 'Julia Roberts', 'julia@example.com', '3213213210', 'photo_10.jpg'),
(11, 'Lakshmi', 'laks@gmail.com', '8763534567', 'default_photo_url'),
(22, 'Tripti Kumar', 'tripti_k@gmail.com', '3450789012', 'default_photo_url'),
(24, 'Anamika Singh', 'anamika23@yahoo.co.in', '9867500324', 'default_photo_url'),
(25, 'Archita Kadam', 'kadam23@yahoo.co.in', '8079200314', 'default_photo_url'),
(26, 'Aryan Khan', 'srkson@gmail.com', '8700399406', 'default_photo_url'),
(27, 'Lasya Madhu Sundar', 'lasyam0rT@gmail.com', '9869054112', 'default_photo_url'),
(28, 'Sameer C', 'sameerchai@gmail.com', '8979034003', 'default_photo_url'),
(29, 'Lakshmi. C', 'laks@gmail.com', '09869007346', 'default_photo_url');

-- --------------------------------------------------------

--
-- Table structure for table `user_registration`
--

CREATE TABLE `user_registration` (
  `user_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_registration`
--

INSERT INTO `user_registration` (`user_id`, `username`, `password`) VALUES
(1, 'tripti', '$2b$10$sB2wTnDNm1dKJ.LotV4ZA.Aj1sB7GGwlXYBCMm5qOLd8sTO6oTRjW'),
(2, 'mihir', '$2b$10$0d.W4pcuz58HkcVqJAp0vOKFHp7zGdS6eDXcaw2DE3vQyEupjzmUy'),
(3, 'lakshmi', '$2b$10$bzE7PHeDfRgeCAKVnRtDTOfH4tlfKb4JpYJIgKIHaPywfTNxBR0Gi'),
(4, 'rachel', '$2b$10$26./TNSVVDaH/nKsCNWUSOTtZ1WjLNNysPj/4DNl4xS5A6V9Vj5JS'),
(5, 'Sarthak', '$2b$10$G5kzwureJaY3jZMEwzzDU.X.iY0bl.0v8p67L0xl/hgvjO8KBYXyq'),
(6, 'anamika', '$2b$10$EN8dqD/xiX4Eo/34Os5kMuwihD9UFlSRCoKZ8zNWrKWUQpFKB8WbW'),
(7, 'archita', '$2b$10$Jm4at0N9Hupp2ugUqmCma.dd4q0Rn8tCkDS7AET3Ds8jg0mppTCJO'),
(8, 'aryan', '$2b$10$pI1Y2pF0laGU3FEW3uaCl.gSatpEZ2BphHwgt16dS51t5k45wzXlK'),
(9, 'lasya', '$2b$10$gRw3tunPhAe1/w8jDd87ROQULuX6PG2UYmj3q7b6UhArMFz2/9NEi'),
(10, 'sameer', '$2b$10$dcbNYQVE5saDxLPoDFvpJusZqhHNFqVj3h3FqE4K7jo0Ffq/hFrgS'),
(11, 'Lasya Madhu Sundar', '$2b$10$oVdn4zfyXWKON5knEcDTM.fqRBvlJ44GfO8oyisjgX9UxYvjKd6HK');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dashboard`
--
ALTER TABLE `dashboard`
  ADD PRIMARY KEY (`result_id`),
  ADD KEY `stud_id` (`stud_id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `exams`
--
ALTER TABLE `exams`
  ADD PRIMARY KEY (`exam_id`);

--
-- Indexes for table `exam_portal`
--
ALTER TABLE `exam_portal`
  ADD KEY `exam_id` (`exam_id`),
  ADD KEY `stud_id` (`stud_id`),
  ADD KEY `ques_id` (`ques_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `stud_id` (`stud_id`,`exam_id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`ques_id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `reschedule_requests`
--
ALTER TABLE `reschedule_requests`
  ADD PRIMARY KEY (`request_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `solved`
--
ALTER TABLE `solved`
  ADD PRIMARY KEY (`solve_id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`stud_id`);

--
-- Indexes for table `user_registration`
--
ALTER TABLE `user_registration`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dashboard`
--
ALTER TABLE `dashboard`
  MODIFY `result_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `reschedule_requests`
--
ALTER TABLE `reschedule_requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `solved`
--
ALTER TABLE `solved`
  MODIFY `solve_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `stud_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `user_registration`
--
ALTER TABLE `user_registration`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dashboard`
--
ALTER TABLE `dashboard`
  ADD CONSTRAINT `fk_dashboard_exam_id` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`),
  ADD CONSTRAINT `fk_dashboard_stud_id` FOREIGN KEY (`stud_id`) REFERENCES `students` (`stud_id`);

--
-- Constraints for table `exam_portal`
--
ALTER TABLE `exam_portal`
  ADD CONSTRAINT `fk_exam_portal_exam_id` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`),
  ADD CONSTRAINT `fk_exam_portal_ques_id` FOREIGN KEY (`ques_id`) REFERENCES `questions` (`ques_id`),
  ADD CONSTRAINT `fk_exam_portal_stud_id` FOREIGN KEY (`stud_id`) REFERENCES `students` (`stud_id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`stud_id`) REFERENCES `students` (`stud_id`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`);

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`exam_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
