-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 25, 2024 at 07:53 AM
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
-- Database: `service_course`
--

-- --------------------------------------------------------

--
-- Table structure for table `par_category`
--

CREATE TABLE `par_category` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(20) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `par_category`
--

INSERT INTO `par_category` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
('6a1cc6f3-8d94-462b-a0a3-bdfb674a6912', 'Level', '2024-01-24 13:06:00', '2024-01-24 13:06:00'),
('7240332f-53b7-40ac-b43e-596c6fcbb594', 'Subject', '2024-01-24 13:05:50', '2024-01-24 13:05:50'),
('78748676-2750-411d-ae97-78a996068360', 'Class', '2024-01-24 13:06:06', '2024-01-24 13:06:06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `par_category`
--
ALTER TABLE `par_category`
  ADD PRIMARY KEY (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
