-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 16, 2026 at 01:42 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `attempts`
--

CREATE TABLE `attempts` (
  `id` int(11) NOT NULL,
  `score` int(11) DEFAULT 0,
  `total_questions` int(11) DEFAULT 0,
  `correct_answers` int(11) DEFAULT 0,
  `wrong_answers` int(11) DEFAULT 0,
  `completed_at` datetime DEFAULT NULL,
  `answers_json` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `test_id` int(11) DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `batch_id` int(11) DEFAULT NULL,
  `total_time` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `attempts`
--

INSERT INTO `attempts` (`id`, `score`, `total_questions`, `correct_answers`, `wrong_answers`, `completed_at`, `answers_json`, `createdAt`, `updatedAt`, `user_id`, `test_id`, `class_id`, `batch_id`, `total_time`) VALUES
(1, 3, 6, 3, 3, '2026-01-15 07:03:40', '{\"1\":\"B\",\"2\":\"B\",\"3\":\"C\",\"4\":\"B\",\"5\":\"A\",\"6\":\"C\"}', '2026-01-15 07:03:40', '2026-01-15 07:03:40', 2, 1, NULL, NULL, 0),
(2, 0, 6, 0, 5, '2026-01-15 09:09:09', '{\"7\":\"A\",\"8\":\"B\",\"9\":\"D\",\"10\":\"B\",\"11\":\"C\"}', '2026-01-15 09:09:09', '2026-01-15 09:09:09', 2, 2, NULL, NULL, 0),
(3, 2, 6, 2, 4, '2026-01-15 09:16:37', '{\"7\":\"A\",\"8\":\"C\",\"9\":\"B\",\"10\":\"C\",\"11\":\"B\",\"12\":\"B\"}', '2026-01-15 09:16:37', '2026-01-15 09:16:37', 2, 2, NULL, NULL, 0),
(4, 1, 6, 1, 5, '2026-01-15 10:03:11', '{\"7\":\"A\",\"8\":\"C\",\"9\":\"C\",\"10\":\"B\",\"11\":\"C\",\"12\":\"C\"}', '2026-01-15 10:03:11', '2026-01-15 10:03:11', 2, 2, NULL, NULL, 0),
(5, 0, 6, 0, 0, '2026-01-15 10:17:40', '{}', '2026-01-15 10:17:40', '2026-01-15 10:17:40', 2, 2, NULL, NULL, 0),
(6, 3, 6, 3, 3, '2026-01-15 10:38:49', '{\"7\":\"A\",\"8\":\"A\",\"9\":\"B\",\"10\":\"C\",\"11\":\"C\",\"12\":\"C\"}', '2026-01-15 10:38:49', '2026-01-15 10:38:49', 2, 2, NULL, NULL, 0),
(7, 1, 5, 1, 4, '2026-01-16 09:25:43', '{\"13\":\"A\",\"14\":\"B\",\"15\":\"C\",\"16\":\"C\",\"17\":\"C\"}', '2026-01-16 09:25:43', '2026-01-16 09:25:43', 2, 3, NULL, NULL, 0),
(8, 2, 5, 2, 3, '2026-01-16 10:20:01', '{\"13\":\"A\",\"14\":\"C\",\"15\":\"C\",\"16\":\"A\",\"17\":\"A\"}', '2026-01-16 10:20:01', '2026-01-16 10:20:01', 2, 3, NULL, NULL, 0),
(9, 4, 6, 4, 2, '2026-01-16 10:21:55', '{\"1\":\"A\",\"2\":\"D\",\"3\":\"C\",\"4\":\"B\",\"5\":\"C\",\"6\":\"B\"}', '2026-01-16 10:21:55', '2026-01-16 10:21:55', 2, 1, NULL, NULL, 0),
(10, 6, 6, 6, 0, '2026-01-16 10:29:36', '{\"1\":\"B\",\"2\":\"A\",\"3\":\"C\",\"4\":\"B\",\"5\":\"C\",\"6\":\"B\"}', '2026-01-16 10:29:36', '2026-01-16 10:29:36', 2, 1, NULL, NULL, 0),
(11, 1, 2, 1, 1, '2026-01-16 11:34:17', '{\"19\":\"A\",\"20\":\"C\"}', '2026-01-16 11:34:17', '2026-01-16 11:34:17', 2, NULL, NULL, NULL, 0),
(12, 1, 3, 1, 2, '2026-01-16 11:35:46', '{\"19\":\"A\",\"20\":\"C\",\"21\":\"D\"}', '2026-01-16 11:35:46', '2026-01-16 11:35:46', 3, NULL, NULL, NULL, 0),
(13, 3, 6, 3, 3, '2026-01-21 07:19:16', '{\"1\":\"A\",\"2\":\"B\",\"3\":\"C\",\"4\":\"C\",\"5\":\"C\",\"6\":\"B\"}', '2026-01-21 07:19:16', '2026-01-21 07:19:16', 2, 1, NULL, NULL, 0),
(14, 1, 1, 1, 0, '2026-01-21 07:20:03', '{\"18\":\"A\"}', '2026-01-21 07:20:03', '2026-01-21 07:20:03', 2, 4, NULL, NULL, 0),
(15, 1, 5, 1, 4, '2026-01-21 07:20:38', '{\"13\":\"A\",\"14\":\"B\",\"15\":\"B\",\"16\":\"D\",\"17\":\"C\"}', '2026-01-21 07:20:38', '2026-01-21 07:20:38', 2, 3, NULL, NULL, 0),
(16, 2, 5, 2, 3, '2026-01-21 07:32:34', '{\"22\":\"A\",\"23\":\"B\",\"24\":\"D\",\"25\":\"B\",\"26\":\"B\"}', '2026-01-21 07:32:34', '2026-01-21 07:32:34', 2, 6, NULL, NULL, 0),
(17, 1, 6, 1, 4, '2026-01-27 09:50:44', '{\"7\":\"A\",\"8\":\"C\",\"9\":\"C\",\"10\":\"C\",\"11\":\"C\"}', '2026-01-27 09:50:44', '2026-01-27 09:50:44', 2, 2, 3, 7, 9),
(18, 1, 6, 1, 5, '2026-01-27 09:52:17', '{\"7\":\"B\",\"8\":\"C\",\"9\":\"D\",\"10\":\"D\",\"11\":\"C\",\"12\":\"A\"}', '2026-01-27 09:52:17', '2026-01-27 09:52:17', 2, 2, 3, 7, 36),
(19, 6, 6, 6, 0, '2026-01-27 09:55:04', '{\"7\":\"B\",\"8\":\"A\",\"9\":\"A\",\"10\":\"C\",\"11\":\"B\",\"12\":\"C\"}', '2026-01-27 09:55:04', '2026-01-27 09:55:04', 2, 2, 3, 7, 17),
(20, 3, 6, 3, 3, '2026-01-27 09:56:30', '{\"7\":\"B\",\"8\":\"A\",\"9\":\"C\",\"10\":\"B\",\"11\":\"C\",\"12\":\"C\"}', '2026-01-27 09:56:30', '2026-01-27 09:56:30', 3, 2, 3, 3, 11),
(21, 6, 6, 6, 0, '2026-01-27 09:57:55', '{\"7\":\"B\",\"8\":\"A\",\"9\":\"A\",\"10\":\"C\",\"11\":\"B\",\"12\":\"C\"}', '2026-01-27 09:57:55', '2026-01-27 09:57:55', 3, 2, 3, 3, 6),
(22, 6, 7, 6, 1, '2026-01-27 11:27:31', '{\"1\":\"A\",\"2\":\"A\",\"3\":\"C\",\"4\":\"B\",\"5\":\"C\",\"6\":\"B\",\"27\":\"C\"}', '2026-01-27 11:27:31', '2026-01-27 11:27:31', 6, 1, 2, 4, 25),
(23, 3, 7, 3, 4, '2026-02-02 10:46:42', '{\"1\":\"A\",\"2\":\"C\",\"3\":\"B\",\"4\":\"B\",\"5\":\"B\",\"6\":\"B\",\"27\":\"C\"}', '2026-02-02 10:46:42', '2026-02-02 10:46:42', 2, 1, 1, 2, 8),
(24, 1, 1, 1, 0, '2026-02-02 11:13:21', '{\"18\":\"A\"}', '2026-02-02 11:13:21', '2026-02-02 11:13:21', 2, 4, 1, 2, 0),
(25, 2, 5, 2, 3, '2026-02-02 11:13:44', '{\"13\":\"B\",\"14\":\"C\",\"15\":\"A\",\"16\":\"C\",\"17\":\"C\"}', '2026-02-02 11:13:44', '2026-02-02 11:13:44', 2, 3, 1, 2, 6),
(26, 0, 1, 0, 1, '2026-02-16 05:26:21', '{\"18\":\"C\"}', '2026-02-16 05:26:21', '2026-02-16 05:26:21', 2, 4, 1, 2, 0),
(27, 0, 5, 0, 5, '2026-02-16 05:26:45', '{\"13\":\"A\",\"14\":\"B\",\"15\":\"C\",\"16\":\"C\",\"17\":\"B\"}', '2026-02-16 05:26:45', '2026-02-16 05:26:45', 2, 3, 1, 2, 9),
(28, 4, 7, 4, 3, '2026-02-16 11:26:58', '{\"1\":\"B\",\"2\":\"B\",\"3\":\"D\",\"4\":\"B\",\"5\":\"A\",\"6\":\"B\",\"27\":\"C\"}', '2026-02-16 11:26:58', '2026-02-16 11:26:58', 2, 1, 1, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `batches`
--

CREATE TABLE `batches` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `class_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `batches`
--

INSERT INTO `batches` (`id`, `name`, `createdAt`, `updatedAt`, `class_id`) VALUES
(1, 'Batch A', '2026-01-27 09:45:17', '2026-01-27 09:45:17', 6),
(2, 'Batch A', '2026-01-27 09:45:34', '2026-01-27 09:45:34', 1),
(3, 'Batch A', '2026-01-27 09:46:29', '2026-01-27 09:46:29', 3),
(4, 'Batch A', '2026-01-27 09:46:32', '2026-01-27 09:46:32', 2),
(6, 'Batch A', '2026-01-27 09:46:46', '2026-01-27 09:46:46', 4),
(7, 'Batch B', '2026-01-27 09:47:47', '2026-01-27 09:47:47', 3);

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Class 10', '2026-01-16 11:11:12', '2026-01-16 11:11:12'),
(2, 'Class 11', '2026-01-16 11:11:12', '2026-01-16 11:11:12'),
(3, 'Class 12', '2026-01-16 11:11:12', '2026-01-16 11:11:12'),
(4, 'Class 9', '2026-01-21 07:23:35', '2026-01-21 07:23:35'),
(6, 'Class 8', '2026-01-27 09:45:01', '2026-01-27 09:45:01');

-- --------------------------------------------------------

--
-- Table structure for table `mistakes`
--

CREATE TABLE `mistakes` (
  `id` int(11) NOT NULL,
  `is_incorrect` tinyint(1) DEFAULT 0,
  `is_slow` tinyint(1) DEFAULT 0,
  `is_bookmarked` tinyint(1) DEFAULT 0,
  `retry_count` int(11) DEFAULT 0,
  `consecutive_correct_retries` int(11) DEFAULT 0,
  `status` enum('active','improved','revised') DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `test_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `mistakes`
--

INSERT INTO `mistakes` (`id`, `is_incorrect`, `is_slow`, `is_bookmarked`, `retry_count`, `consecutive_correct_retries`, `status`, `createdAt`, `updatedAt`, `user_id`, `test_id`, `question_id`) VALUES
(1, 1, 0, 1, 0, 0, 'revised', '2026-02-02 10:46:42', '2026-02-02 11:02:46', 2, 1, 1),
(2, 1, 0, 0, 0, 0, 'active', '2026-02-02 10:46:42', '2026-02-16 11:26:58', 2, 1, 5),
(3, 1, 0, 1, 0, 0, 'active', '2026-02-02 10:46:42', '2026-02-16 11:26:58', 2, 1, 2),
(4, 1, 0, 0, 0, 0, 'active', '2026-02-02 10:46:42', '2026-02-16 11:26:58', 2, 1, 3),
(5, 0, 0, 0, 1, 1, 'revised', '2026-02-02 11:02:22', '2026-02-02 11:07:31', 2, 1, 4),
(6, 1, 0, 1, 0, 0, 'active', '2026-02-02 11:13:44', '2026-02-16 05:26:45', 2, 3, 13),
(7, 1, 1, 1, 0, 0, 'active', '2026-02-02 11:13:44', '2026-02-16 05:26:45', 2, 3, 15),
(8, 1, 0, 0, 0, 0, 'active', '2026-02-02 11:13:44', '2026-02-02 11:14:02', 2, 3, 16),
(9, 1, 0, 0, 0, 0, 'active', '2026-02-16 05:26:21', '2026-02-16 05:26:21', 2, 4, 18),
(10, 1, 1, 0, 0, 0, 'active', '2026-02-16 05:26:45', '2026-02-16 05:26:45', 2, 3, 14),
(11, 1, 0, 0, 0, 0, 'active', '2026-02-16 05:26:45', '2026-02-16 05:26:45', 2, 3, 17);

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `text` text NOT NULL,
  `option_a` varchar(255) NOT NULL,
  `option_b` varchar(255) NOT NULL,
  `option_c` varchar(255) NOT NULL,
  `option_d` varchar(255) NOT NULL,
  `correct_option` enum('A','B','C','D') NOT NULL,
  `marks` int(11) DEFAULT 1,
  `explanation` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `test_id` int(11) DEFAULT NULL,
  `topic` varchar(255) DEFAULT 'General'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`id`, `text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `marks`, `explanation`, `createdAt`, `updatedAt`, `test_id`, `topic`) VALUES
(1, 'Computers help banks to:', 'Play games', 'Manage customer accounts', 'Wash cash', 'Print newspapers', 'B', 1, 'Computer have features.', '2026-01-15 06:55:15', '2026-01-15 06:55:15', 1, 'General'),
(2, 'What is a computer?', 'An electronic machine that stores and processes data', 'A mechanical device', 'A type of calculator only', 'A printing machine', 'A', 1, 'An electronic machine that stores and processes data that solve large computation data that human takes time to do.', '2026-01-15 06:56:19', '2026-01-15 06:56:19', 1, 'General'),
(3, 'Which of the following is the brain of the computer?', 'Moniter', 'Keyboard', 'CPU', 'Mouse', 'C', 1, '', '2026-01-15 06:56:47', '2026-01-15 06:56:47', 1, 'General'),
(4, 'Which device is used to input text into a computer?', 'Mouse', 'Keyboard', 'Printer', 'Speake', 'B', 1, '', '2026-01-15 06:57:15', '2026-01-15 06:57:15', 1, 'General'),
(5, 'Which of the following is an output device?', 'Mouse', 'Keyboard', 'Moniter', 'Scanner', 'C', 1, '', '2026-01-15 06:58:19', '2026-01-15 06:58:19', 1, 'General'),
(6, 'Computers are used in schools mainly for:', 'Playing games only', 'eaching and learning', 'Cooking Food', 'Washing Cloths', 'B', 1, '', '2026-01-15 06:58:52', '2026-01-15 06:58:52', 1, 'General'),
(7, 'Who was the first President of India?', 'Jawaharlal Nehru', 'Dr. Rajendra Prasad ', ' Dr. B. R. Ambedkar', 'Sardar Vallabhbhai Patel', 'B', 1, 'Dr. Rajendra Prasad became the first President of independent India in 1950 and served for two consecutive terms.', '2026-01-15 08:59:40', '2026-01-15 08:59:40', 2, 'General'),
(8, 'In which year did India gain independence?', '1942', '1945', '1947', '1950', 'A', 1, 'India became independent from British rule on 15 August 1947.', '2026-01-15 09:00:28', '2026-01-15 09:00:28', 2, 'General'),
(9, 'Who was known as the “Iron Man of India”?', 'Subhas Chandra Bose', ' Bhagat Singh', ' Mahatma Gandhi ', ' Sardar Vallabhbhai Patel', 'A', 1, 'Sardar Patel is called the Iron Man of India because of his strong leadership and role in uniting princely states after independence.', '2026-01-15 09:01:17', '2026-01-15 09:01:17', 2, 'General'),
(10, 'Which movement was launched by Mahatma Gandhi in 1942?', 'Non-Cooperation Movement', 'Civil Disobedience Movement', 'Quit India Movement', 'Swadeshi Movement', 'C', 1, 'The Quit India Movement (1942) demanded an immediate end to British rule in India.', '2026-01-15 09:02:01', '2026-01-15 09:02:01', 2, 'General'),
(11, 'Who wrote the book “Discovery of India”?', 'Mahatma Gandhi', 'Jawaharlal Nehru', 'Rabindranath Tagore', 'Subhas Chandra Bose', 'B', 1, 'Jawaharlal Nehru wrote “The Discovery of India” while he was in prison during the freedom struggle.', '2026-01-15 09:02:50', '2026-01-15 09:02:50', 2, 'General'),
(12, 'The Indus Valley Civilization was mainly located along which river?', 'Ganga', 'Yamuna Rever', 'Indus ', 'Brahmaputra', 'C', 1, 'The Indus Valley Civilization developed along the Indus River, which provided water, fertile land, and trade routes.', '2026-01-15 09:03:37', '2026-02-16 11:54:46', 2, 'General'),
(13, 'What is the SI unit of electric current?', 'Volt ', 'Ohm ', 'Ampere ', 'Watt', 'C', 1, '', '2026-01-15 10:53:50', '2026-01-15 10:53:50', 3, 'General'),
(14, 'Which gas is released during photosynthesis?', 'Carbon dioxide', 'Oxygen ', 'Nitrogen ', 'Hydrogen', 'C', 1, 'The iris adjusts the size of the pupil to control how much light enters the eye.', '2026-01-15 10:56:41', '2026-01-15 10:56:41', 3, 'General'),
(15, 'What type of energy is stored in a stretched rubber band?', 'Kinetic energy', 'Thermal energy ', 'Chemical energy', 'Potential energy', 'D', 1, 'A stretched rubber band stores elastic potential energy, which is released when it returns to its original shape.', '2026-01-15 11:15:12', '2026-01-15 11:15:12', 3, 'General'),
(16, 'Which process is responsible for the movement of water from roots to leaves?', 'Transpiration', 'Photosynthesis', 'Respiration', 'Germination', 'A', 1, 'Transpiration creates a pull that helps water move upward from roots to leaves through xylem tissues.', '2026-01-16 09:17:26', '2026-01-16 09:17:26', 3, 'General'),
(17, 'What is the pH value of a neutral solution?', '0', '5', '7', '14', 'C', 1, 'A solution with pH 7 is neutral, meaning it is neither acidic nor basic.', '2026-01-16 09:24:43', '2026-01-16 09:24:43', 3, 'General'),
(18, 'Which process is responsible for the movement of water from roots to leaves?', 'Transpiration', 'Photosynthesis', 'Respiration', 'Germination', 'A', 1, 'Transpiration creates a pull that helps water move upward from roots to leaves through xylem tissues.', '2026-01-16 09:38:25', '2026-01-16 09:38:25', 4, 'General'),
(22, 'नेताजी का चश्मा’ पाठ के लेखक कौन हैं', 'यशपाल', 'हरिशंकर परसाई', 'प्रेमचंद', 'फणीश्वरनाथ रेणु', 'B', 1, 'नेताजी का चश्मा’ एक व्यंग्य रचना है, जिसके लेखक प्रसिद्ध व्यंग्यकार हरिशंकर परसाई हैं।', '2026-01-21 07:26:47', '2026-01-21 07:26:47', 6, 'General'),
(23, 'बालगोबिन भगत’ किस विधा की रचना है?', 'कहानी', 'निबंध', 'संस्मरण', 'जीवनी', 'C', 1, 'यह पाठ लेखक द्वारा देखे गए व्यक्ति के जीवन अनुभवों पर आधारित है, इसलिए यह संस्मरण है।', '2026-01-21 07:27:24', '2026-01-21 07:27:24', 6, 'General'),
(24, 'ल्हासा की ओर’ के लेखक कौन हैं?', 'राहुल सांकृत्यायन', 'अज्ञेय', 'महादेवी वर्मा', 'जयशंकर प्रसाद', 'D', 1, 'राहुल सांकृत्यायन को ‘महापंडित’ कहा जाता है और उन्होंने यात्रा-वृत्तांत ‘ल्हासा की ओर’ लिखा।', '2026-01-21 07:27:58', '2026-01-21 07:27:58', 6, 'General'),
(25, 'राम-लक्ष्मण-परशुराम संवाद’ किस ग्रंथ से लिया गया है?', 'रामचरितमानस', 'विनय पत्रिका', 'कवितावली', 'गीतावली', 'A', 1, 'यह संवाद गोस्वामी तुलसीदास द्वारा रचित रामचरितमानस से लिया गया है।', '2026-01-21 07:28:30', '2026-01-21 07:28:30', 6, 'General'),
(26, 'सूरदास किस काल के कवि हैं?', 'रीतिकाल', 'भक्तिकाल', 'आधुनिक काल', 'आदिकाल', 'B', 1, 'सूरदास भक्ति आंदोलन के प्रमुख कवि थे और कृष्ण भक्ति के लिए प्रसिद्ध हैं।', '2026-01-21 07:29:08', '2026-01-21 07:29:08', 6, 'General'),
(27, 'Which of the following is used to store data permanently?', 'RAM', 'Cache memory', 'Hard Disk', 'Register', 'C', 1, 'Hard Disk Drive (HDD): A fixed disk that stores and retrieves digital data using magnetic storage', '2026-01-27 10:08:18', '2026-01-27 10:08:18', 1, 'General'),
(28, 'If x=10, x(x+x)/x ? \n', '2', '5', '2', '55', 'B', 1, 'Calculation', '2026-02-16 11:56:02', '2026-02-16 11:56:02', 2, 'General'),
(29, 'What is 2+2?', '3', '4', '5', '6', 'B', 1, 'Simple addition', '2026-02-16 12:36:56', '2026-02-16 12:36:56', 7, 'Math'),
(30, 'Capital of India?', 'Mumbai', 'Delhi', 'Kolkata', 'Chennai', 'B', 1, 'New Delhi is the capital', '2026-02-16 12:36:56', '2026-02-16 12:36:56', 7, 'GK');

-- --------------------------------------------------------

--
-- Table structure for table `questiontimes`
--

CREATE TABLE `questiontimes` (
  `id` int(11) NOT NULL,
  `time_spent` int(11) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `attempt_id` int(11) DEFAULT NULL,
  `question_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `test_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `questiontimes`
--

INSERT INTO `questiontimes` (`id`, `time_spent`, `createdAt`, `updatedAt`, `attempt_id`, `question_id`, `user_id`, `test_id`) VALUES
(1, 7, '2026-01-16 10:20:01', '2026-01-16 10:20:01', 8, 13, 2, 3),
(2, 2, '2026-01-16 10:20:01', '2026-01-16 10:20:01', 8, 14, 2, 3),
(3, 3, '2026-01-16 10:20:01', '2026-01-16 10:20:01', 8, 15, 2, 3),
(4, 7, '2026-01-16 10:20:01', '2026-01-16 10:20:01', 8, 16, 2, 3),
(5, 0, '2026-01-16 10:20:01', '2026-01-16 10:20:01', 8, 17, 2, 3),
(6, 2, '2026-01-16 10:21:55', '2026-01-16 10:21:55', 9, 1, 2, 1),
(7, 13, '2026-01-16 10:21:55', '2026-01-16 10:21:55', 9, 2, 2, 1),
(8, 13, '2026-01-16 10:21:55', '2026-01-16 10:21:55', 9, 3, 2, 1),
(9, 8, '2026-01-16 10:21:55', '2026-01-16 10:21:55', 9, 4, 2, 1),
(10, 5, '2026-01-16 10:21:55', '2026-01-16 10:21:55', 9, 5, 2, 1),
(11, 0, '2026-01-16 10:21:55', '2026-01-16 10:21:55', 9, 6, 2, 1),
(12, 6, '2026-01-16 10:29:36', '2026-01-16 10:29:36', 10, 1, 2, 1),
(13, 5, '2026-01-16 10:29:36', '2026-01-16 10:29:36', 10, 2, 2, 1),
(14, 12, '2026-01-16 10:29:36', '2026-01-16 10:29:36', 10, 3, 2, 1),
(15, 7, '2026-01-16 10:29:36', '2026-01-16 10:29:36', 10, 4, 2, 1),
(16, 7, '2026-01-16 10:29:36', '2026-01-16 10:29:36', 10, 5, 2, 1),
(17, 0, '2026-01-16 10:29:36', '2026-01-16 10:29:36', 10, 6, 2, 1),
(23, 5, '2026-01-21 07:19:16', '2026-01-21 07:19:16', 13, 1, 2, 1),
(24, 1, '2026-01-21 07:19:16', '2026-01-21 07:19:16', 13, 2, 2, 1),
(25, 1, '2026-01-21 07:19:16', '2026-01-21 07:19:16', 13, 3, 2, 1),
(26, 1, '2026-01-21 07:19:16', '2026-01-21 07:19:16', 13, 4, 2, 1),
(27, 1, '2026-01-21 07:19:16', '2026-01-21 07:19:16', 13, 5, 2, 1),
(28, 0, '2026-01-21 07:19:16', '2026-01-21 07:19:16', 13, 6, 2, 1),
(29, 0, '2026-01-21 07:20:03', '2026-01-21 07:20:03', 14, 18, 2, 4),
(30, 14, '2026-01-21 07:20:38', '2026-01-21 07:20:38', 15, 13, 2, 3),
(31, 1, '2026-01-21 07:20:38', '2026-01-21 07:20:38', 15, 14, 2, 3),
(32, 1, '2026-01-21 07:20:38', '2026-01-21 07:20:38', 15, 15, 2, 3),
(33, 1, '2026-01-21 07:20:38', '2026-01-21 07:20:38', 15, 16, 2, 3),
(34, 0, '2026-01-21 07:20:38', '2026-01-21 07:20:38', 15, 17, 2, 3),
(35, 2, '2026-01-21 07:32:34', '2026-01-21 07:32:34', 16, 22, 2, 6),
(36, 1, '2026-01-21 07:32:34', '2026-01-21 07:32:34', 16, 23, 2, 6),
(37, 2, '2026-01-21 07:32:34', '2026-01-21 07:32:34', 16, 24, 2, 6),
(38, 1, '2026-01-21 07:32:34', '2026-01-21 07:32:34', 16, 25, 2, 6),
(39, 0, '2026-01-21 07:32:34', '2026-01-21 07:32:34', 16, 26, 2, 6),
(40, 2, '2026-01-27 09:50:44', '2026-01-27 09:50:44', 17, 7, 2, 2),
(41, 2, '2026-01-27 09:50:44', '2026-01-27 09:50:44', 17, 8, 2, 2),
(42, 1, '2026-01-27 09:50:44', '2026-01-27 09:50:44', 17, 9, 2, 2),
(43, 2, '2026-01-27 09:50:44', '2026-01-27 09:50:44', 17, 10, 2, 2),
(44, 2, '2026-01-27 09:50:44', '2026-01-27 09:50:44', 17, 11, 2, 2),
(45, 0, '2026-01-27 09:50:44', '2026-01-27 09:50:44', 17, 12, 2, 2),
(46, 9, '2026-01-27 09:52:17', '2026-01-27 09:52:17', 18, 7, 2, 2),
(47, 6, '2026-01-27 09:52:17', '2026-01-27 09:52:17', 18, 8, 2, 2),
(48, 6, '2026-01-27 09:52:17', '2026-01-27 09:52:17', 18, 9, 2, 2),
(49, 10, '2026-01-27 09:52:17', '2026-01-27 09:52:17', 18, 10, 2, 2),
(50, 5, '2026-01-27 09:52:17', '2026-01-27 09:52:17', 18, 11, 2, 2),
(51, 0, '2026-01-27 09:52:17', '2026-01-27 09:52:17', 18, 12, 2, 2),
(52, 3, '2026-01-27 09:55:04', '2026-01-27 09:55:04', 19, 7, 2, 2),
(53, 2, '2026-01-27 09:55:04', '2026-01-27 09:55:04', 19, 8, 2, 2),
(54, 4, '2026-01-27 09:55:04', '2026-01-27 09:55:04', 19, 9, 2, 2),
(55, 3, '2026-01-27 09:55:04', '2026-01-27 09:55:04', 19, 10, 2, 2),
(56, 5, '2026-01-27 09:55:04', '2026-01-27 09:55:04', 19, 11, 2, 2),
(57, 0, '2026-01-27 09:55:04', '2026-01-27 09:55:04', 19, 12, 2, 2),
(58, 3, '2026-01-27 09:56:30', '2026-01-27 09:56:30', 20, 7, 3, 2),
(59, 1, '2026-01-27 09:56:30', '2026-01-27 09:56:30', 20, 8, 3, 2),
(60, 2, '2026-01-27 09:56:30', '2026-01-27 09:56:30', 20, 9, 3, 2),
(61, 2, '2026-01-27 09:56:30', '2026-01-27 09:56:30', 20, 10, 3, 2),
(62, 3, '2026-01-27 09:56:30', '2026-01-27 09:56:30', 20, 11, 3, 2),
(63, 0, '2026-01-27 09:56:30', '2026-01-27 09:56:30', 20, 12, 3, 2),
(64, 1, '2026-01-27 09:57:55', '2026-01-27 09:57:55', 21, 7, 3, 2),
(65, 1, '2026-01-27 09:57:55', '2026-01-27 09:57:55', 21, 8, 3, 2),
(66, 1, '2026-01-27 09:57:55', '2026-01-27 09:57:55', 21, 9, 3, 2),
(67, 2, '2026-01-27 09:57:55', '2026-01-27 09:57:55', 21, 10, 3, 2),
(68, 1, '2026-01-27 09:57:55', '2026-01-27 09:57:55', 21, 11, 3, 2),
(69, 0, '2026-01-27 09:57:55', '2026-01-27 09:57:55', 21, 12, 3, 2),
(70, 3, '2026-01-27 11:27:31', '2026-01-27 11:27:31', 22, 1, 6, 1),
(71, 2, '2026-01-27 11:27:31', '2026-01-27 11:27:31', 22, 2, 6, 1),
(72, 6, '2026-01-27 11:27:31', '2026-01-27 11:27:31', 22, 3, 6, 1),
(73, 5, '2026-01-27 11:27:31', '2026-01-27 11:27:31', 22, 4, 6, 1),
(74, 4, '2026-01-27 11:27:31', '2026-01-27 11:27:31', 22, 5, 6, 1),
(75, 5, '2026-01-27 11:27:31', '2026-01-27 11:27:31', 22, 6, 6, 1),
(76, 0, '2026-01-27 11:27:31', '2026-01-27 11:27:31', 22, 27, 6, 1),
(77, 2, '2026-02-02 10:46:42', '2026-02-02 10:46:42', 23, 1, 2, 1),
(78, 1, '2026-02-02 10:46:42', '2026-02-02 10:46:42', 23, 2, 2, 1),
(79, 1, '2026-02-02 10:46:42', '2026-02-02 10:46:42', 23, 3, 2, 1),
(80, 1, '2026-02-02 10:46:42', '2026-02-02 10:46:42', 23, 4, 2, 1),
(81, 2, '2026-02-02 10:46:42', '2026-02-02 10:46:42', 23, 5, 2, 1),
(82, 1, '2026-02-02 10:46:42', '2026-02-02 10:46:42', 23, 6, 2, 1),
(83, 0, '2026-02-02 10:46:42', '2026-02-02 10:46:42', 23, 27, 2, 1),
(84, 0, '2026-02-02 11:13:21', '2026-02-02 11:13:21', 24, 18, 2, 4),
(85, 2, '2026-02-02 11:13:44', '2026-02-02 11:13:44', 25, 13, 2, 3),
(86, 1, '2026-02-02 11:13:44', '2026-02-02 11:13:44', 25, 14, 2, 3),
(87, 1, '2026-02-02 11:13:44', '2026-02-02 11:13:44', 25, 15, 2, 3),
(88, 2, '2026-02-02 11:13:44', '2026-02-02 11:13:44', 25, 16, 2, 3),
(89, 0, '2026-02-02 11:13:44', '2026-02-02 11:13:44', 25, 17, 2, 3),
(90, 0, '2026-02-16 05:26:21', '2026-02-16 05:26:21', 26, 18, 2, 4),
(91, 3, '2026-02-16 05:26:45', '2026-02-16 05:26:45', 27, 13, 2, 3),
(92, 2, '2026-02-16 05:26:45', '2026-02-16 05:26:45', 27, 14, 2, 3),
(93, 2, '2026-02-16 05:26:45', '2026-02-16 05:26:45', 27, 15, 2, 3),
(94, 2, '2026-02-16 05:26:45', '2026-02-16 05:26:45', 27, 16, 2, 3),
(95, 0, '2026-02-16 05:26:45', '2026-02-16 05:26:45', 27, 17, 2, 3),
(96, 0, '2026-02-16 11:26:58', '2026-02-16 11:26:58', 28, 1, 2, 1),
(97, 0, '2026-02-16 11:26:58', '2026-02-16 11:26:58', 28, 2, 2, 1),
(98, 0, '2026-02-16 11:26:58', '2026-02-16 11:26:58', 28, 3, 2, 1),
(99, 0, '2026-02-16 11:26:58', '2026-02-16 11:26:58', 28, 4, 2, 1),
(100, 0, '2026-02-16 11:26:58', '2026-02-16 11:26:58', 28, 5, 2, 1),
(101, 0, '2026-02-16 11:26:58', '2026-02-16 11:26:58', 28, 6, 2, 1),
(102, 0, '2026-02-16 11:26:58', '2026-02-16 11:26:58', 28, 27, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `testbatches`
--

CREATE TABLE `testbatches` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `test_id` int(11) NOT NULL,
  `batch_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `testbatches`
--

INSERT INTO `testbatches` (`createdAt`, `updatedAt`, `test_id`, `batch_id`) VALUES
('2026-01-27 09:48:48', '2026-01-27 09:48:48', 2, 3),
('2026-01-27 09:48:49', '2026-01-27 09:48:49', 2, 7);

-- --------------------------------------------------------

--
-- Table structure for table `testclasses`
--

CREATE TABLE `testclasses` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `test_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `testclasses`
--

INSERT INTO `testclasses` (`createdAt`, `updatedAt`, `test_id`, `class_id`) VALUES
('2026-01-16 11:30:19', '2026-01-16 11:30:19', 1, 1),
('2026-01-16 12:20:43', '2026-01-16 12:20:43', 1, 2),
('2026-01-16 12:21:09', '2026-01-16 12:21:09', 2, 3),
('2026-01-16 11:30:19', '2026-01-16 11:30:19', 3, 1),
('2026-01-16 11:30:19', '2026-01-16 11:30:19', 4, 1),
('2026-01-21 07:24:23', '2026-01-21 07:24:23', 6, 4);

-- --------------------------------------------------------

--
-- Table structure for table `tests`
--

CREATE TABLE `tests` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `duration_minutes` int(11) NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tests`
--

INSERT INTO `tests` (`id`, `title`, `description`, `duration_minutes`, `start_time`, `end_time`, `createdAt`, `updatedAt`, `created_by`) VALUES
(1, 'Computer', 'No description', 5, NULL, NULL, '2026-01-15 06:47:31', '2026-01-15 06:47:31', 1),
(2, 'History', 'No description', 5, NULL, NULL, '2026-01-15 07:14:34', '2026-01-15 07:14:34', 1),
(3, 'Science ', 'No description', 5, NULL, NULL, '2026-01-15 10:52:33', '2026-01-15 10:52:33', 1),
(4, 'Home science', 'No description', 10, NULL, NULL, '2026-01-16 09:37:17', '2026-01-16 09:37:17', 1),
(6, 'New Hindi Batch', 'No description', 10, NULL, NULL, '2026-01-21 07:24:13', '2026-01-21 07:24:13', 1),
(7, 'Next ', 'New test created from dashboard', 10, NULL, NULL, '2026-02-16 11:56:42', '2026-02-16 11:56:42', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','student') DEFAULT 'student',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `batch_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`, `class_id`, `batch_id`) VALUES
(1, 'Super Admin', 'admin@test.com', '$2b$10$8k3jH5qRolT7SEVkYJnkS.QRvfS/kOcBYF4NwMDzd18AtOqrBPsFq', 'admin', '2026-01-15 06:46:41', '2026-01-15 06:46:41', NULL, NULL),
(2, 'pramod', 'pramod@test.com', '$2b$10$lS64Dv0gLEBG8h5dh8O7XukXLs24tz/FB5Gwj.FvsnC2q2PPdf2Ym', 'student', '2026-01-15 06:46:41', '2026-01-27 12:42:17', 1, 2),
(3, 'Raj', 'raj@test.com', '$2b$10$lS64Dv0gLEBG8h5dh8O7XukXLs24tz/FB5Gwj.FvsnC2q2PPdf2Ym', 'student', '2026-01-15 06:46:41', '2026-01-27 09:46:56', 3, 3),
(4, 'Browser Test', 'browser@test.com', '$2b$10$FxpSMMIswQP4Jqoy1l95n.m9CmWnDgV8Hh6b2VLM/.8EZQ3lOvIAq', 'student', '2026-01-21 09:54:30', '2026-01-21 09:54:30', 2, NULL),
(5, 'Test User 02', 'testuser02@test.com', '$2b$10$BNkMpbqW/QjjdXTtMvNPl.tHvDJN2uXaY7gp3rWS3ewd7bDKovOhq', 'student', '2026-01-21 10:00:00', '2026-01-27 09:45:56', 1, 2),
(6, 'rahul', 'ruhul@test.com', '$2b$10$MUHOKOE9LeAnEUb5M4l63eadK56OUmcauXcttih.oFQOaPCYuKiVu', 'student', '2026-01-27 11:25:38', '2026-01-27 11:25:38', 2, 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attempts`
--
ALTER TABLE `attempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `test_id` (`test_id`);

--
-- Indexes for table `batches`
--
ALTER TABLE `batches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`),
  ADD UNIQUE KEY `name_11` (`name`),
  ADD UNIQUE KEY `name_12` (`name`),
  ADD UNIQUE KEY `name_13` (`name`),
  ADD UNIQUE KEY `name_14` (`name`),
  ADD UNIQUE KEY `name_15` (`name`),
  ADD UNIQUE KEY `name_16` (`name`),
  ADD UNIQUE KEY `name_17` (`name`),
  ADD UNIQUE KEY `name_18` (`name`),
  ADD UNIQUE KEY `name_19` (`name`),
  ADD UNIQUE KEY `name_20` (`name`),
  ADD UNIQUE KEY `name_21` (`name`),
  ADD UNIQUE KEY `name_22` (`name`),
  ADD UNIQUE KEY `name_23` (`name`),
  ADD UNIQUE KEY `name_24` (`name`),
  ADD UNIQUE KEY `name_25` (`name`),
  ADD UNIQUE KEY `name_26` (`name`),
  ADD UNIQUE KEY `name_27` (`name`),
  ADD UNIQUE KEY `name_28` (`name`),
  ADD UNIQUE KEY `name_29` (`name`),
  ADD UNIQUE KEY `name_30` (`name`),
  ADD UNIQUE KEY `name_31` (`name`),
  ADD UNIQUE KEY `name_32` (`name`),
  ADD UNIQUE KEY `name_33` (`name`),
  ADD UNIQUE KEY `name_34` (`name`),
  ADD UNIQUE KEY `name_35` (`name`),
  ADD UNIQUE KEY `name_36` (`name`),
  ADD UNIQUE KEY `name_37` (`name`),
  ADD UNIQUE KEY `name_38` (`name`),
  ADD UNIQUE KEY `name_39` (`name`),
  ADD UNIQUE KEY `name_40` (`name`),
  ADD UNIQUE KEY `name_41` (`name`),
  ADD UNIQUE KEY `name_42` (`name`),
  ADD UNIQUE KEY `name_43` (`name`),
  ADD UNIQUE KEY `name_44` (`name`),
  ADD UNIQUE KEY `name_45` (`name`),
  ADD UNIQUE KEY `name_46` (`name`),
  ADD UNIQUE KEY `name_47` (`name`),
  ADD UNIQUE KEY `name_48` (`name`),
  ADD UNIQUE KEY `name_49` (`name`),
  ADD UNIQUE KEY `name_50` (`name`),
  ADD UNIQUE KEY `name_51` (`name`),
  ADD UNIQUE KEY `name_52` (`name`),
  ADD UNIQUE KEY `name_53` (`name`),
  ADD UNIQUE KEY `name_54` (`name`),
  ADD UNIQUE KEY `name_55` (`name`),
  ADD UNIQUE KEY `name_56` (`name`),
  ADD UNIQUE KEY `name_57` (`name`);

--
-- Indexes for table `mistakes`
--
ALTER TABLE `mistakes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `test_id` (`test_id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `test_id` (`test_id`);

--
-- Indexes for table `questiontimes`
--
ALTER TABLE `questiontimes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attempt_id` (`attempt_id`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `test_id` (`test_id`);

--
-- Indexes for table `testbatches`
--
ALTER TABLE `testbatches`
  ADD PRIMARY KEY (`test_id`,`batch_id`),
  ADD KEY `batch_id` (`batch_id`);

--
-- Indexes for table `testclasses`
--
ALTER TABLE `testclasses`
  ADD PRIMARY KEY (`test_id`,`class_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Indexes for table `tests`
--
ALTER TABLE `tests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`),
  ADD UNIQUE KEY `email_40` (`email`),
  ADD UNIQUE KEY `email_41` (`email`),
  ADD UNIQUE KEY `email_42` (`email`),
  ADD UNIQUE KEY `email_43` (`email`),
  ADD UNIQUE KEY `email_44` (`email`),
  ADD UNIQUE KEY `email_45` (`email`),
  ADD UNIQUE KEY `email_46` (`email`),
  ADD UNIQUE KEY `email_47` (`email`),
  ADD UNIQUE KEY `email_48` (`email`),
  ADD UNIQUE KEY `email_49` (`email`),
  ADD UNIQUE KEY `email_50` (`email`),
  ADD UNIQUE KEY `email_51` (`email`),
  ADD UNIQUE KEY `email_52` (`email`),
  ADD UNIQUE KEY `email_53` (`email`),
  ADD UNIQUE KEY `email_54` (`email`),
  ADD UNIQUE KEY `email_55` (`email`),
  ADD UNIQUE KEY `email_56` (`email`),
  ADD UNIQUE KEY `email_57` (`email`),
  ADD UNIQUE KEY `email_58` (`email`),
  ADD UNIQUE KEY `email_59` (`email`),
  ADD UNIQUE KEY `email_60` (`email`),
  ADD UNIQUE KEY `email_61` (`email`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `batch_id` (`batch_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attempts`
--
ALTER TABLE `attempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `batches`
--
ALTER TABLE `batches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `mistakes`
--
ALTER TABLE `mistakes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `questiontimes`
--
ALTER TABLE `questiontimes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT for table `tests`
--
ALTER TABLE `tests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attempts`
--
ALTER TABLE `attempts`
  ADD CONSTRAINT `attempts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_10` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_100` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_101` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_102` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_103` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_104` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_105` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_106` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_107` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_108` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_109` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_110` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_111` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_112` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_113` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_114` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_115` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_116` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_117` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_118` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_119` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_12` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_120` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_121` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_122` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_14` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_15` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_16` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_18` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_2` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_20` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_21` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_22` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_23` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_24` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_25` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_26` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_27` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_28` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_29` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_30` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_31` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_32` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_33` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_34` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_35` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_36` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_37` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_38` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_39` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_4` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_40` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_41` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_42` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_43` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_44` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_45` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_46` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_47` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_48` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_49` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_50` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_51` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_52` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_53` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_54` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_55` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_56` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_57` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_58` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_59` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_6` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_60` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_61` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_62` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_63` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_64` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_65` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_66` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_67` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_68` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_69` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_70` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_71` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_72` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_73` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_74` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_75` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_76` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_77` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_78` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_79` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_8` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_80` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_81` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_82` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_83` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_84` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_85` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_86` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_87` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_88` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_89` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_90` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_91` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_92` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_93` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_94` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_95` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_96` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_97` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_98` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `attempts_ibfk_99` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `batches`
--
ALTER TABLE `batches`
  ADD CONSTRAINT `batches_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_10` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_11` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_12` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_13` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_14` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_15` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_16` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_17` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_18` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_19` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_20` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_21` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_22` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_23` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_24` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_25` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_26` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_27` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_28` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_29` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_3` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_30` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_31` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_32` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_33` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_34` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_35` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_36` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_37` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_38` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_39` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_4` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_40` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_41` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_42` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_5` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_6` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_7` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_8` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `batches_ibfk_9` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `mistakes`
--
ALTER TABLE `mistakes`
  ADD CONSTRAINT `mistakes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_10` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_11` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_12` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_14` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_15` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_16` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_17` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_18` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_2` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_20` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_21` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_3` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_5` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_6` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_8` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `mistakes_ibfk_9` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_10` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_11` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_12` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_13` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_14` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_15` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_16` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_17` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_18` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_19` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_20` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_21` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_22` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_23` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_24` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_25` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_26` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_27` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_28` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_29` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_3` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_30` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_31` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_32` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_33` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_34` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_35` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_36` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_37` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_38` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_39` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_4` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_40` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_41` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_42` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_43` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_44` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_45` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_46` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_47` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_48` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_49` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_5` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_50` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_51` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_52` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_53` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_54` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_55` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_56` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_57` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_58` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_59` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_6` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_60` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_61` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_7` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_8` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questions_ibfk_9` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `questiontimes`
--
ALTER TABLE `questiontimes`
  ADD CONSTRAINT `questiontimes_ibfk_1` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_10` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_100` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_101` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_102` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_103` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_104` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_105` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_106` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_107` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_108` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_109` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_110` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_111` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_112` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_113` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_114` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_115` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_116` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_117` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_118` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_119` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_12` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_120` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_121` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_122` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_123` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_124` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_125` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_126` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_127` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_128` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_129` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_13` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_130` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_131` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_132` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_133` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_134` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_135` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_136` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_137` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_138` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_139` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_14` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_140` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_141` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_142` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_143` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_144` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_145` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_146` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_147` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_148` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_149` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_15` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_150` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_151` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_152` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_16` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_17` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_18` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_20` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_21` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_22` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_23` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_24` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_25` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_26` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_27` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_28` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_29` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_30` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_31` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_32` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_33` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_34` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_35` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_36` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_37` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_38` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_39` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_4` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_40` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_41` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_42` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_43` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_44` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_45` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_46` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_47` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_48` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_49` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_5` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_50` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_51` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_52` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_53` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_54` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_55` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_56` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_57` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_58` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_59` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_6` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_60` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_61` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_62` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_63` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_64` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_65` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_66` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_67` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_68` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_69` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_70` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_71` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_72` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_73` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_74` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_75` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_76` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_77` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_78` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_79` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_8` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_80` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_81` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_82` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_83` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_84` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_85` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_86` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_87` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_88` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_89` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_9` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_90` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_91` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_92` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_93` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_94` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_95` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_96` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_97` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_98` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `questiontimes_ibfk_99` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `testbatches`
--
ALTER TABLE `testbatches`
  ADD CONSTRAINT `testbatches_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `testbatches_ibfk_2` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `testclasses`
--
ALTER TABLE `testclasses`
  ADD CONSTRAINT `testclasses_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `testclasses_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tests`
--
ALTER TABLE `tests`
  ADD CONSTRAINT `tests_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_10` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_11` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_12` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_13` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_14` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_15` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_16` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_17` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_18` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_19` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_20` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_21` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_22` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_23` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_24` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_25` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_26` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_27` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_28` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_29` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_30` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_31` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_32` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_33` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_34` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_35` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_36` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_37` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_38` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_39` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_40` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_41` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_42` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_43` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_44` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_45` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_46` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_47` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_48` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_49` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_5` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_50` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_51` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_52` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_53` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_54` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_55` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_56` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_57` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_58` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_59` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_6` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_60` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_61` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_7` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_8` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tests_ibfk_9` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `Users_batch_id_foreign_idx` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Users_class_id_foreign_idx` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_10` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_11` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_12` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_13` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_14` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_15` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_16` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_17` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_18` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_19` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_20` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_21` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_22` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_23` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_24` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_25` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_26` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_27` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_28` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_29` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_30` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_31` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_32` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_33` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_34` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_35` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_36` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_37` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_38` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_39` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_4` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_40` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_41` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_42` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_43` FOREIGN KEY (`batch_id`) REFERENCES `batches` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_5` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_6` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_7` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_8` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_9` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
