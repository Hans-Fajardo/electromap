-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 23, 2025 at 11:30 PM
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
-- Database: `electromap`
--

-- --------------------------------------------------------

--
-- Table structure for table `pinpoints`
--

CREATE TABLE `pinpoints` (
  `pointId` int(11) NOT NULL,
  `meterNumber` varchar(100) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `pointImage` varchar(255) DEFAULT NULL,
  `isApproved` int(11) NOT NULL DEFAULT 0,
  `contributedBy` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pinpoints`
--

INSERT INTO `pinpoints` (`pointId`, `meterNumber`, `latitude`, `longitude`, `createdAt`, `pointImage`, `isApproved`, `contributedBy`) VALUES
(48, '123', 14.806340939140355, 120.98925744180235, '2024-12-23 17:26:50', 'pinpoint_67692cda6bb8e5.90273389.png', 1, 'test@email.com'),
(49, '123', 14.806309822119474, 120.98884439575329, '2024-12-23 19:46:57', 'pinpoint_67694db1605223.70664145.png', 1, 'test@email.com'),
(50, '123', 14.808157303087953, 120.98715558444303, '2024-12-25 00:03:10', 'pinpoint_676adb3ecc9f74.88661238.png', 1, 'test@email.com'),
(51, 'test', 14.806999598106842, 120.98886048900732, '2024-12-25 11:20:19', 'pinpoint_676b79f3c71e51.05809306.png', 1, 'test@email.com'),
(53, 'test2', 14.551173653576726, 121.002743093253, '2025-01-04 21:41:15', 'pinpoint_67793a7b831698.59002052.png', 1, 'test@email.com'),
(55, '123', 14.551797937957403, 121.0022714690374, '2025-01-09 20:23:41', 'pinpoint_677fbfcdbd2758.80984986.png', 0, 'test@email.com'),
(57, '123', 14.552791091087101, 121.00329989446709, '2025-01-09 20:29:26', 'pinpoint_677fc126400278.75321911.png', 0, 'test@email.com'),
(58, '1yegwaohfij;', 14.55195319203645, 121.00288641240991, '2025-01-13 18:08:03', 'pinpoint_6784e603700d92.23065096.png', 0, 'test@email.com');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userImage` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `is_verified` tinyint(1) DEFAULT 0,
  `token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `username`, `email`, `password`, `userImage`, `role`, `is_verified`, `token`, `created_at`) VALUES
(2, 'Test', 'test@email.com', '$2y$10$wCBmtE9o514qN1Xx1uGtQ.4WeSjWVsrk9ROLfJB18.mo42l5zja12', NULL, 'admin', 0, 'd2d86bc444b81e10f43dc801ba10a119', '2024-12-22 02:03:32'),
(5, 'test2', 'test2@email.com', '$2y$10$CBNbmsuadB0SSZ.kxRaFW.AQPfoqrz9AR.1XMyGnws8mrWJpi7XYy', NULL, 'user', 0, NULL, '2024-12-22 05:14:18'),
(6, 'test3', 'test3@email.com', '$2y$10$fE8gMDylsprx7zKcVHWMgOEJa1iYRyQu8LNi2Aie2kIOgW5tivxFy', NULL, 'admin', 0, NULL, '2024-12-22 05:14:45');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pinpoints`
--
ALTER TABLE `pinpoints`
  ADD PRIMARY KEY (`pointId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pinpoints`
--
ALTER TABLE `pinpoints`
  MODIFY `pointId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
