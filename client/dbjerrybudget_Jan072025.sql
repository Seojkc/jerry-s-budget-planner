-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 07, 2025 at 05:23 PM
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
-- Database: `dbjerrybudget`
--

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

CREATE TABLE `expense` (
  `ExpenseID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Category` varchar(50) NOT NULL DEFAULT 'food',
  `Description` varchar(255) NOT NULL,
  `Amount` decimal(10,2) NOT NULL,
  `ExpenseDate` datetime NOT NULL DEFAULT current_timestamp(),
  `BudgetID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expense`
--

INSERT INTO `expense` (`ExpenseID`, `UserID`, `Category`, `Description`, `Amount`, `ExpenseDate`, `BudgetID`) VALUES
(1, 1, 'food', 'Groceries', 120.50, '2024-09-15 14:20:00', 1),
(2, 1, 'transport', 'Gas', 60.00, '2024-09-18 09:45:00', 1),
(3, 1, 'utilities', 'Electric Bill', 75.25, '2024-09-05 08:00:00', 2),
(4, 1, 'food', 'Dining Out', 45.00, '2024-09-12 19:30:00', 2),
(5, 1, 'entertainment', 'Movies', 30.00, '2024-09-10 16:10:00', 3),
(6, 1, 'health', 'Gym Membership', 50.00, '2024-09-20 07:00:00', 3),
(7, 1, 'education', 'Books', 100.00, '2024-09-22 11:30:00', 4),
(8, 1, 'food', 'Snacks', 15.75, '2024-09-08 21:15:00', 4),
(9, 1, 'transport', 'Taxi', 25.00, '2024-09-25 22:40:00', 5),
(10, 1, 'miscellaneous', 'Gift', 40.00, '2024-09-28 12:00:00', 5),
(11, 1, 'food', 'Groceries', 115.00, '2024-10-03 13:00:00', 1),
(12, 1, 'transport', 'Gas', 55.00, '2024-10-12 10:30:00', 1),
(13, 1, 'utilities', 'Water Bill', 40.00, '2024-10-07 07:45:00', 2),
(14, 1, 'food', 'Dining Out', 48.00, '2024-10-18 20:15:00', 2),
(15, 1, 'entertainment', 'Concert', 75.00, '2024-10-25 19:00:00', 3),
(16, 1, 'health', 'Gym Membership', 50.00, '2024-10-09 08:00:00', 3),
(17, 1, 'education', 'Online Course', 120.00, '2024-10-21 09:30:00', 4),
(18, 1, 'food', 'Coffee', 12.50, '2024-10-14 10:20:00', 4),
(19, 1, 'transport', 'Bus Ticket', 3.00, '2024-10-19 06:50:00', 5),
(20, 1, 'miscellaneous', 'Clothes', 85.00, '2024-10-28 15:00:00', 5),
(21, 1, 'food', 'Groceries', 110.00, '2024-11-02 14:30:00', 1),
(22, 1, 'transport', 'Gas', 70.00, '2024-11-14 09:15:00', 1),
(23, 1, 'utilities', 'Internet', 65.00, '2024-11-10 11:20:00', 2),
(24, 1, 'food', 'Snacks', 20.00, '2024-11-18 18:40:00', 2),
(25, 1, 'entertainment', 'Video Games', 60.00, '2024-11-12 17:00:00', 3),
(26, 1, 'health', 'Fitness Equipment', 150.00, '2024-11-06 15:00:00', 3),
(27, 1, 'education', 'Course Materials', 80.00, '2024-11-19 16:00:00', 4),
(28, 1, 'food', 'Restaurant', 60.00, '2024-11-08 19:00:00', 4),
(29, 1, 'transport', 'Parking', 10.00, '2024-11-22 08:30:00', 5),
(30, 1, 'miscellaneous', 'Subscription', 25.00, '2024-11-27 14:10:00', 5),
(31, 1, 'food', 'Groceries', 130.00, '2024-12-01 11:30:00', 1),
(32, 1, 'transport', 'Gas', 65.00, '2024-12-10 08:45:00', 1),
(33, 1, 'utilities', 'Phone Bill', 50.00, '2024-12-05 10:50:00', 2),
(34, 1, 'food', 'Dining Out', 40.00, '2024-12-20 20:30:00', 2),
(35, 1, 'entertainment', 'Theater', 55.00, '2024-12-15 18:20:00', 3),
(36, 1, 'health', 'Supplements', 45.00, '2024-12-07 13:45:00', 3),
(37, 1, 'education', 'Online Seminar', 90.00, '2024-12-18 17:10:00', 4),
(38, 1, 'food', 'Fast Food', 15.00, '2024-12-12 12:15:00', 4),
(39, 1, 'transport', 'Toll', 8.00, '2024-12-22 07:30:00', 5),
(40, 1, 'miscellaneous', 'Decorations', 35.00, '2024-12-25 16:40:00', 5);

--
-- Triggers `expense`
--
DELIMITER $$
CREATE TRIGGER `AUTO_DECREMENT_Expense` AFTER DELETE ON `expense` FOR EACH ROW BEGIN
    -- Update the corresponding total expense by subtracting the deleted amount
    UPDATE tblbudgetdetails
    SET totExpense = totExpense - OLD.Amount
    WHERE YrUserDetail = OLD.YEAR(ExpenseDate);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `AUTO_INCREMENT_Expense` AFTER INSERT ON `expense` FOR EACH ROW BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM tblbudgetdetails
        WHERE YrUserDetail = NEW.YEAR(ExpenseDate)
    ) THEN
        INSERT INTO tblbudgetdetails (totIncome,totExpense,monthlyTarExpense,currentMonthlyExpense,YrUserDetail)
        VALUES (0, NEW.Amount,0, 0,NEW.YEAR(ExpenseDate));
    ELSE
        UPDATE tblbudgetdetails
        SET totExpense = totExpense + NEW.Amount
        WHERE YrUserDetail = NEW.YEAR(ExpenseDate);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `tblbudgetdetails`
--

CREATE TABLE `tblbudgetdetails` (
  `id` int(11) NOT NULL,
  `totIncome` decimal(10,2) DEFAULT NULL,
  `totExpense` decimal(10,2) DEFAULT NULL,
  `tarExpense` decimal(10,2) DEFAULT NULL,
  `monthlyTarExpense` decimal(10,2) DEFAULT NULL,
  `currentMonthlyExpense` decimal(10,2) DEFAULT NULL,
  `YrUserDetail` year(4) NOT NULL DEFAULT year(curdate())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Triggers `tblbudgetdetails`
--
DELIMITER $$
CREATE TRIGGER `before_insert_tblbudgetdetails` BEFORE INSERT ON `tblbudgetdetails` FOR EACH ROW BEGIN
    IF NEW.tarExpense IS NULL THEN
        SET NEW.tarExpense = NEW.monthlyTarExpense * 12;
    END IF;
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`ExpenseID`);

--
-- Indexes for table `tblbudgetdetails`
--
ALTER TABLE `tblbudgetdetails`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `ExpenseID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `tblbudgetdetails`
--
ALTER TABLE `tblbudgetdetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
