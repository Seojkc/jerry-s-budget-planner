-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 17, 2025 at 11:31 PM
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

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCategoryBasedChart` (IN `varRange` VARCHAR(50), IN `varCategory` VARCHAR(50))   BEGIN
    DECLARE start_date DATE;

    -- Determine the start date based on the range
    IF varRange = '3months' THEN
        SET start_date = DATE_SUB(CURDATE(), INTERVAL 3 MONTH);
    ELSEIF varRange = '6months' THEN
        SET start_date = DATE_SUB(CURDATE(), INTERVAL 6 MONTH);
    ELSEIF varRange = '1year' THEN
        SET start_date = DATE_SUB(CURDATE(), INTERVAL 1 YEAR);
    ELSEIF varRange = '5years' THEN
        SET start_date = DATE_SUB(CURDATE(), INTERVAL 5 YEAR);
    ELSE
        -- Default to all data if varRange is invalid
        SET start_date = '1970-01-01'; -- Or any other default start date
    END IF;

    -- Query to get aggregated data based on varRange and category
    IF varRange IN ('3months', '6months', '1year') THEN
        -- Group by month name for 3 months, 6 months, and 1 year
        SELECT 
            DATE_FORMAT(ExpenseDate, '%M') AS Label, 
            SUM(Amount) AS Price 
        FROM expense 
        WHERE Category = varCategory AND ExpenseDate >= start_date
        GROUP BY DATE_FORMAT(ExpenseDate, '%M')
        ORDER BY ExpenseDate;
    ELSEIF varRange IN ('5years', 'all') THEN
        -- Group by year for 5 years and all
        SELECT 
            DATE_FORMAT(ExpenseDate, '%Y') AS Label, 
            SUM(Amount) AS Price 
        FROM expense 
        WHERE Category = varCategory AND ExpenseDate >= start_date
        GROUP BY DATE_FORMAT(ExpenseDate, '%Y')
        ORDER BY ExpenseDate;
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetPercentageDistributionRange` (IN `time_range` VARCHAR(50))   BEGIN
    DECLARE start_date DATE;

    -- Determine the start date based on the range
    IF time_range = '3months' THEN
        SET start_date = DATE_SUB(CURDATE(), INTERVAL 3 MONTH);
    ELSEIF time_range = '6months' THEN
        SET start_date = DATE_SUB(CURDATE(), INTERVAL 6 MONTH);
    ELSEIF time_range = '1year' THEN
        SET start_date = DATE_SUB(CURDATE(), INTERVAL 1 YEAR);
    ELSEIF time_range = '5years' THEN
        SET start_date = DATE_SUB(CURDATE(), INTERVAL 5 YEAR);
    ELSE
        -- Default to all data if range is invalid
        SET start_date = '1970-01-01'; -- Or any other default start date
    END IF;

    -- Query to get aggregated data by category
    SELECT 
        DISTINCT(Category) as Label, 
        SUM(Amount) AS Price 
    FROM expense 
    WHERE ExpenseDate >= start_date
    GROUP BY Category;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetTargetExpenseData` (IN `rangeParam` VARCHAR(50))   BEGIN
    IF rangeParam = '3months' THEN
        SELECT DATE_FORMAT(ExpenseDate, '%M') AS Label, SUM(Amount) AS Price
        FROM expense 
        WHERE ExpenseDate >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH) 
        GROUP BY DATE_FORMAT(ExpenseDate, '%M') 
        ORDER BY MIN(ExpenseDate);
        
    ELSEIF rangeParam = '6months' THEN
        SELECT DATE_FORMAT(ExpenseDate, '%M') AS Label, SUM(Amount) AS Price
        FROM expense 
        WHERE ExpenseDate >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) 
        GROUP BY DATE_FORMAT(ExpenseDate, '%M') 
        ORDER BY MIN(ExpenseDate);

    ELSEIF rangeParam = '1year' THEN
        SELECT DATE_FORMAT(ExpenseDate, '%M') AS Label, SUM(Amount) AS Price
        FROM expense 
        WHERE ExpenseDate >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR) 
        GROUP BY DATE_FORMAT(ExpenseDate, '%M') 
        ORDER BY MIN(ExpenseDate);

    ELSEIF rangeParam = '5years' THEN
        SELECT YEAR(ExpenseDate) AS Label, SUM(Amount) AS Price
        FROM expense 
        WHERE ExpenseDate >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR) 
        GROUP BY YEAR(ExpenseDate) 
        ORDER BY MIN(ExpenseDate);
	ELSE
    	SELECT YEAR(ExpenseDate) AS Label, SUM(Amount) AS Price
        FROM expense 
        GROUP BY YEAR(ExpenseDate) 
        ORDER BY MIN(ExpenseDate);

    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `prcMarkASPaidtoExpenseTable` (IN `p_bill_id` INT)   BEGIN
	DECLARE v_amount DECIMAL(10,2);
    DECLARE v_category VARCHAR(255);
    DECLARE v_description TEXT;
    DECLARE v_next_due_date DATE;
    DECLARE v_user_id INT;
	DECLARE v_bill_name VARCHAR(255);
	DECLARE v_payment_method VARCHAR(255);
	DECLARE v_vendor VARCHAR(255);
    DECLARE v_reference_number VARCHAR(255);

     SELECT amount, category, description, next_due_date, user_id,bill_name, payment_method, vendor,reference_number
     INTO v_amount, v_category, v_description, v_next_due_date, v_user_id,v_bill_name,v_payment_method,v_vendor,v_reference_number
     FROM tblrecurringbills
     WHERE bill_id = p_bill_id;


	 INSERT INTO expense (Amount, Category, Description, ExpenseDate, UserID, BudgetID)
   	 VALUES (v_amount, v_category, v_description, v_next_due_date, v_user_id, p_bill_id);

	INSERT INTO bill_history (bill_id, user_id, bill_name, amount, category, description, payment_date, payment_method, vendor, reference_number) 
    VALUES (p_bill_id,v_user_id,v_bill_name,v_amount,v_category,v_description,CURDATE(), v_payment_method,v_vendor, v_reference_number);

    
        UPDATE tblrecurringbills
            SET next_due_date = CASE
                WHEN frequency = 'Monthly' THEN DATE_ADD(CURDATE(), INTERVAL 1 MONTH)
                WHEN frequency = 'Bi-Weekly' THEN DATE_ADD(CURDATE(), INTERVAL 14 DAY)
                WHEN frequency = 'Annual' THEN DATE_ADD(CURDATE(), INTERVAL 1 YEAR)
                ELSE next_due_date 
            END
            WHERE bill_id =  p_bill_id;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `prcskipThePayment` (IN `p_bill_id` INT)   BEGIN
	DECLARE v_amount DECIMAL(10,2);
    DECLARE v_category VARCHAR(255);
    DECLARE v_description TEXT;
    DECLARE v_next_due_date DATE;
    DECLARE v_user_id INT;

     SELECT amount, category, description, next_due_date, user_id
     INTO v_amount, v_category, v_description, v_next_due_date, v_user_id
     FROM tblrecurringbills
     WHERE bill_id = p_bill_id;

    
        UPDATE tblrecurringbills
            SET next_due_date = CASE
                WHEN frequency = 'Monthly' THEN DATE_ADD(CURDATE(), INTERVAL 1 MONTH)
                WHEN frequency = 'Bi-Weekly' THEN DATE_ADD(CURDATE(), INTERVAL 14 DAY)
                WHEN frequency = 'Annual' THEN DATE_ADD(CURDATE(), INTERVAL 1 YEAR)
                ELSE next_due_date 
            END
            WHERE bill_id =  p_bill_id;

END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ProcessRecurringBills` ()   BEGIN
    -- Start Transaction
    START TRANSACTION;

    -- Insert all due recurring bills into the `expense` table
    INSERT INTO expense (Amount, Category, Description, ExpenseDate,BudgetId)
    SELECT amount, category, description, next_due_date,bill_id
    FROM tblrecurringbills r
    WHERE next_due_date = CURDATE()
	AND NOT EXISTS( select 1 from expense e 		
                   where e.BudgetId=r.bill_id);


	INSERT INTO tblbill_history (bill_id, user_id, bill_name, amount, category, payment_date, vendor, reference_number)
    select bill_id, user_id, bill_name, amount, category, CURDATE(), vendor, reference_number
	FROM tblrecurringbills r
	WHERE next_due_date = CURDATE()
	AND NOT EXISTS( select 1 from expense e 		
                   where e.BudgetId=r.bill_id);


    -- Insert all corresponding email notifications into the `email_queue` table
    INSERT INTO email_queue (recipient, subject, body)
    SELECT 'seojmsstorage@gmail.com', 
           CONCAT('Payment Due: ', bill_name), 
           CONCAT(
           '<p>This is a payment reminder for <span style="color: green;">', bill_name, '</span>.</p>',
        '<p>Due Date for the payment is: <span style="color: green;">', next_due_date, '</span></p>',
        '<p>Amount Due: <span style="color: red;">$', amount, '</span></p>',
        '<br>',
        '<p><i>This is an automated payment notification from Jerry App.</i></p>')
         
    FROM tblrecurringbills
    WHERE DATE_SUB(next_due_date, INTERVAL notification_days_before DAY)=CURDATE();


    -- Update `next_due_date` based on the `frequency`
    UPDATE tblrecurringbills
    SET next_due_date = CASE
        WHEN frequency = 'Monthly' THEN DATE_ADD(CURDATE(), INTERVAL 1 MONTH)
        WHEN frequency = 'Bi-Weekly' THEN DATE_ADD(CURDATE(), INTERVAL 14 DAY)
        WHEN frequency = 'Annual' THEN DATE_ADD(CURDATE(), INTERVAL 1 YEAR)
        ELSE next_due_date -- Default to avoid NULL values
    END
    WHERE next_due_date = CURDATE();

    -- Commit Transaction
    COMMIT;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `email_queue`
--

CREATE TABLE `email_queue` (
  `id` int(11) NOT NULL,
  `recipient` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT 'Jerry Mail',
  `body` text NOT NULL,
  `send_at` date DEFAULT current_timestamp(),
  `sent_flag` tinyint(4) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `email_queue`
--

INSERT INTO `email_queue` (`id`, `recipient`, `subject`, `body`, `send_at`, `sent_flag`, `created_at`, `user_id`) VALUES
(2, 'seojmsstorage@gmail.com', 'Payment Due: Fido', '<p>This is a payment reminder for <span style=\"color: green;\">Fido</span>.</p><p>Due Date for the payment is: <span style=\"color: green;\">2025-02-17</span></p><p>Amount Due: <span style=\"color: red;\">$10.00</span></p><br><p><i>This is an automated payment notification from Jerry App.</i></p>', '2025-02-12', 1, '2025-02-12 23:39:24', NULL),
(3, 'seojmsstorage@gmail.com', 'Sample Mail', 'this is sample mail', '2025-02-13', 1, '2025-02-13 03:54:18', 1),
(4, 'seojmsstorage@gmail.com', 'sampe mail', 'this is a <br>smaple <br>mail', '2025-02-15', 0, '2025-02-13 03:58:44', 1),
(11, 'seojmsstorage@gmail.com', 'Payment Due: Netflix Subscription', '<p>This is a payment reminder for <span style=\"color: green;\">Netflix Subscription</span>.</p><p>Due Date for the payment is: <span style=\"color: green;\">2025-02-14</span></p><p>Amount Due: <span style=\"color: red;\">$15.49</span></p><br><p><i>This is an automated payment notification from Jerry App.</i></p>', '2025-02-13', 1, '2025-02-13 17:10:44', 1),
(12, 'seojameskc007@gmail.com', 'Payment Due: Fido', '<p>This is a payment reminder for <span style=\"color: green;\">Fido</span>.</p><p>Due Date for the payment is: <span style=\"color: green;\">2025-02-18</span></p><p>Amount Due: <span style=\"color: red;\">$10.00</span></p><br><p><i>This is an automated payment notification from Jerry App.</i></p>', '2025-02-13', 1, '2025-02-13 17:10:44', 1);

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

CREATE TABLE `expense` (
  `ExpenseID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT 1,
  `Category` varchar(50) DEFAULT 'food',
  `Description` varchar(255) DEFAULT ' ',
  `Amount` decimal(10,2) DEFAULT 0.00,
  `ExpenseDate` datetime DEFAULT current_timestamp(),
  `BudgetID` int(11) DEFAULT NULL
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
(40, 1, 'miscellaneous', 'Decorations', 35.00, '2024-12-25 16:40:00', 5),
(43, 1, 'food', '', 14.00, '2025-01-15 05:00:00', 1),
(44, 1, 'food', '', 10.00, '2025-01-29 05:00:00', 1),
(45, 1, 'transport', '', 50.00, '2025-01-31 05:00:00', 1),
(46, 1, 'food', '', 9.00, '2025-02-03 05:00:00', 1),
(47, 1, 'food', '', 10.00, '2025-02-06 06:00:00', 1),
(53, 1, 'food', '', 15.00, '2025-02-10 05:00:00', 1),
(54, 1, 'food', '', 15.00, '2025-02-10 05:00:00', 1),
(69, 1, 'Insurance', 'Private health insurance', 200.00, '2025-02-13 00:00:00', 27),
(73, 1, 'Entertainment', 'Streaming service', 15.49, '2025-02-14 00:00:00', 23);

--
-- Triggers `expense`
--
DELIMITER $$
CREATE TRIGGER `AUTO_DECREMENT_Expense` AFTER DELETE ON `expense` FOR EACH ROW BEGIN
    -- Update the corresponding total expense by subtracting the deleted amount
    UPDATE tblbudgetdetails
    SET totExpense = totExpense - OLD.Amount
    WHERE YrUserDetail = YEAR(OLD.ExpenseDate);
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `AUTO_INCREMENT_Expense` AFTER INSERT ON `expense` FOR EACH ROW BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM tblbudgetdetails
        WHERE YrUserDetail = YEAR(NEW.ExpenseDate)
    ) THEN
        INSERT INTO tblbudgetdetails (totIncome,totExpense,monthlyTarExpense,currentMonthlyExpense,YrUserDetail)
        VALUES (0, NEW.Amount,0, 0,YEAR(NEW.ExpenseDate));
    ELSE
        UPDATE tblbudgetdetails
        SET totExpense = totExpense + NEW.Amount
        WHERE YrUserDetail = YEAR(NEW.ExpenseDate);
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `secure_data`
--

CREATE TABLE `secure_data` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `secure_data`
--

INSERT INTO `secure_data` (`id`, `name`, `email`, `status`) VALUES
(1, 'Seo James', 'seojames@gmail.com', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `tblbill_history`
--

CREATE TABLE `tblbill_history` (
  `history_id` int(11) NOT NULL,
  `bill_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT 1,
  `bill_name` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `category` varchar(255) DEFAULT 'Food',
  `payment_date` date NOT NULL,
  `vendor` varchar(255) DEFAULT NULL,
  `reference_number` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblbill_history`
--

INSERT INTO `tblbill_history` (`history_id`, `bill_id`, `user_id`, `bill_name`, `amount`, `category`, `payment_date`, `vendor`, `reference_number`, `created_at`) VALUES
(1, 1, 101, 'Electricity Bill', 150.75, 'Utilities', '2025-02-01', 'Power Company', 'REF123456', '2025-02-13 18:44:39'),
(2, 2, 102, 'Water Bill', 80.50, 'Utilities', '2025-02-02', 'Water Supplier', 'REF789012', '2025-02-13 18:44:39'),
(3, 3, 103, 'Internet Bill', 60.00, 'Internet', '2025-02-03', 'ISP Provider', 'REF345678', '2025-02-13 18:44:39'),
(4, 4, 104, 'Car Insurance', 200.00, 'Insurance', '2025-02-04', 'ABC Insurance', 'REF901234', '2025-02-13 18:44:39'),
(5, 5, 105, 'Rent Payment', 1200.00, 'Housing', '2025-02-05', 'Landlord', 'REF567890', '2025-02-13 18:44:39'),
(6, 6, 106, 'Gym Membership', 45.00, 'Health', '2025-02-06', 'Fitness Center', 'REF112233', '2025-02-13 18:44:39'),
(7, 7, 107, 'Netflix Subscription', 15.99, 'Entertainment', '2025-02-07', 'Netflix', 'REF445566', '2025-02-13 18:44:39'),
(8, 8, 108, 'Phone Bill', 55.25, 'Utilities', '2025-02-08', 'Mobile Provider', 'REF778899', '2025-02-13 18:44:39'),
(9, 9, 109, 'Groceries', 250.00, 'Food', '2025-02-09', 'Supermarket', 'REF990011', '2025-02-13 18:44:39'),
(10, 10, 110, 'Credit Card Payment', 500.00, 'Finance', '2025-02-10', 'Bank', 'REF223344', '2025-02-13 18:44:39');

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
-- Dumping data for table `tblbudgetdetails`
--

INSERT INTO `tblbudgetdetails` (`id`, `totIncome`, `totExpense`, `tarExpense`, `monthlyTarExpense`, `currentMonthlyExpense`, `YrUserDetail`) VALUES
(1, 50000.00, 338.49, 18000.00, 1500.00, 0.00, '2025'),
(2, 0.00, 0.00, 0.00, 0.00, 0.00, '0000'),
(3, 0.00, 0.00, 0.00, 0.00, 0.00, '2027');

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

-- --------------------------------------------------------

--
-- Table structure for table `tblrecurringbills`
--

CREATE TABLE `tblrecurringbills` (
  `bill_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `bill_name` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT 0.00,
  `frequency` enum('Monthly','Bi-Weekly','Annual') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `category` varchar(255) DEFAULT 'Food',
  `description` text DEFAULT '',
  `send_notification` tinyint(1) DEFAULT 0,
  `notification_days_before` tinyint(4) DEFAULT 0,
  `payment_method` varchar(50) DEFAULT NULL,
  `vendor` varchar(255) DEFAULT NULL,
  `reference_number` varchar(100) DEFAULT NULL,
  `blnStatus` tinyint(1) DEFAULT 1,
  `next_due_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblrecurringbills`
--

INSERT INTO `tblrecurringbills` (`bill_id`, `user_id`, `bill_name`, `amount`, `frequency`, `start_date`, `end_date`, `category`, `description`, `send_notification`, `notification_days_before`, `payment_method`, `vendor`, `reference_number`, `blnStatus`, `next_due_date`, `created_at`) VALUES
(18, 1, 'Rent', 1200.00, 'Monthly', '2025-02-01', NULL, 'Housing', 'Monthly apartment rent', 1, 3, 'Bank Transfer', 'Landlord', 'INV-1001', 0, '2025-03-01', '2025-02-06 17:28:00'),
(19, 2, 'Car Insurance', 150.00, 'Monthly', '2025-01-15', '2025-12-15', 'Insurance', 'Full coverage insurance', 1, 5, 'Credit Card', 'Insurance Co.', 'INS-2345', 1, '2025-03-15', '2025-02-06 17:28:00'),
(20, 3, 'Internet', 75.99, 'Monthly', '2025-01-10', NULL, 'Utilities', 'Fiber optic internet', 1, 2, 'Credit Card', 'ISP Ltd.', 'NET-5678', 1, '2025-03-10', '2025-02-06 17:28:00'),
(21, 4, 'Gym Membership', 50.00, 'Monthly', '2025-01-05', NULL, 'Health & Fitness', 'Gym access fee', 0, NULL, 'Debit Card', 'Fitness Club', 'GYM-7890', 0, '2025-03-07', '2025-02-06 17:28:00'),
(22, 5, 'Spotify Subscription', 9.99, 'Monthly', '2025-01-20', NULL, 'Entertainment', 'Music streaming service', 1, 1, 'PayPal', 'Spotify', 'SUB-1122', 1, '2025-03-20', '2025-02-06 17:28:00'),
(23, 6, 'Netflix Subscription', 15.49, 'Monthly', '2025-01-25', NULL, 'Entertainment', 'Streaming service', 1, 1, 'Credit Card', 'Netflix', 'SUB-3344', 1, '2025-03-14', '2025-02-06 17:28:00'),
(24, 7, 'Phone Bill', 60.00, 'Monthly', '2025-01-07', NULL, 'Utilities', 'Mobile phone plan', 1, 3, 'Bank Transfer', 'Telco Inc.', 'TEL-5566', 0, '2025-02-07', '2025-02-06 17:28:00'),
(25, 8, 'Student Loan', 250.00, 'Bi-Weekly', '2025-01-12', NULL, 'Loans', 'Student loan repayment', 1, 7, 'Direct Debit', 'Gov Loan Services', 'LOAN-7788', 0, '2025-01-26', '2025-02-06 17:28:00'),
(26, 9, 'Property Tax', 1800.00, 'Annual', '2025-01-01', '2030-01-01', 'Taxes', 'Annual property tax', 1, 30, 'Bank Transfer', 'City Office', 'TAX-9900', 0, '2026-01-01', '2025-02-06 17:28:00'),
(27, 10, 'Health Insurance', 200.00, 'Monthly', '2025-01-15', NULL, 'Insurance', 'Private health insurance', 1, 5, 'Credit Card', 'HealthCare Inc.', 'HINS-1234', 1, '2025-03-13', '2025-02-06 17:28:00'),
(28, 1, 'Fido', 10.00, 'Monthly', '2025-02-17', NULL, 'Utilities', '', 1, 5, NULL, 'Fido', NULL, 1, '2025-02-18', '2025-02-12 23:19:07');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'admin', 'securepassword');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `email_queue`
--
ALTER TABLE `email_queue`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`ExpenseID`);

--
-- Indexes for table `secure_data`
--
ALTER TABLE `secure_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblbill_history`
--
ALTER TABLE `tblbill_history`
  ADD PRIMARY KEY (`history_id`);

--
-- Indexes for table `tblbudgetdetails`
--
ALTER TABLE `tblbudgetdetails`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tblrecurringbills`
--
ALTER TABLE `tblrecurringbills`
  ADD PRIMARY KEY (`bill_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `email_queue`
--
ALTER TABLE `email_queue`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `ExpenseID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `secure_data`
--
ALTER TABLE `secure_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tblbill_history`
--
ALTER TABLE `tblbill_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `tblbudgetdetails`
--
ALTER TABLE `tblbudgetdetails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tblrecurringbills`
--
ALTER TABLE `tblrecurringbills`
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `DailyRecurringBillCheck` ON SCHEDULE EVERY 1 DAY STARTS '2025-02-14 01:15:57' ON COMPLETION NOT PRESERVE ENABLE DO CALL ProcessRecurringBills()$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
