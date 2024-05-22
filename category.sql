-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 25, 2024 at 07:52 AM
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
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `id_par_category` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `name` varchar(30) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `id_par_category`, `name`, `createdAt`, `updatedAt`) VALUES
('1cf2d2d3-9e1b-4c0c-8b6f-d382568b3c3e', '7240332f-53b7-40ac-b43e-596c6fcbb594', 'Sinh học', '2024-01-24 13:12:42', '2024-01-24 13:12:42'),
('32cb347b-a46a-45b0-9fe8-21297380cdc1', '7240332f-53b7-40ac-b43e-596c6fcbb594', 'Hóa học', '2024-01-24 13:12:42', '2024-01-24 13:12:42'),
('3a674f8e-f38f-4808-be54-257964b0a2c8', '7240332f-53b7-40ac-b43e-596c6fcbb594', 'Địa lý', '2024-01-24 13:12:42', '2024-01-24 13:12:42'),
('3c138a43-4fb5-4a86-8332-3d3b6e995082', '78748676-2750-411d-ae97-78a996068360', '12', '2024-01-24 13:12:43', '2024-01-24 13:12:43'),
('461ec0f3-d7ca-4bb9-9ac2-e4599b244b58', '6a1cc6f3-8d94-462b-a0a3-bdfb674a6912', 'Cơ bản', '2024-01-24 13:12:42', '2024-01-24 13:12:42'),
('813a4df9-d6e3-484e-9df5-56d6439d952b', '78748676-2750-411d-ae97-78a996068360', '10', '2024-01-24 13:12:42', '2024-01-24 13:12:42'),
('b589776a-0b73-4ee0-9383-c65f7058484e', '7240332f-53b7-40ac-b43e-596c6fcbb594', 'Tiếng Anh', '2024-01-24 13:12:42', '2024-01-24 13:12:42'),
('c1cf62d5-8dce-4ee5-96aa-527147878f46', '7240332f-53b7-40ac-b43e-596c6fcbb594', 'Tin học', '2024-01-24 13:12:42', '2024-01-24 13:12:42'),
('d1cd040b-2e6c-43ae-a25c-ac5fd035fe62', '7240332f-53b7-40ac-b43e-596c6fcbb594', 'Toán', '2024-01-24 13:12:42', '2024-01-24 13:12:42'),
('d488e645-58e5-4634-8f26-fc73448f46bf', '7240332f-53b7-40ac-b43e-596c6fcbb594', 'Văn học', '2024-01-24 13:12:42', '2024-01-24 13:12:42'),
('e82a8670-4141-4caa-96a2-287a2a99be38', '7240332f-53b7-40ac-b43e-596c6fcbb594', 'Vật lý', '2024-01-24 13:12:42', '2024-01-24 13:12:42'),
('e8adc9cf-acc9-45f4-96e7-e6443a484d6e', '6a1cc6f3-8d94-462b-a0a3-bdfb674a6912', 'Nâng cao', '2024-01-24 13:12:42', '2024-01-24 13:12:42'),
('f3771b0d-ab29-4733-b6fd-1d18e45a5d77', '7240332f-53b7-40ac-b43e-596c6fcbb594', 'Lịch sử', '2024-01-24 13:12:42', '2024-01-24 13:12:42'),
('f5af317b-b1b6-4853-9671-7fc21a1e9f71', '78748676-2750-411d-ae97-78a996068360', '11', '2024-01-24 13:12:42', '2024-01-24 13:12:42'),
('fd2381c8-e3ef-47db-924b-654344edae11', '6a1cc6f3-8d94-462b-a0a3-bdfb674a6912', 'Trung bình', '2024-01-24 13:12:42', '2024-01-24 13:12:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_par_category` (`id_par_category`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`id_par_category`) REFERENCES `par_category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
