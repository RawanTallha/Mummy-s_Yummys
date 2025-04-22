-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3307
-- Generation Time: Apr 22, 2025 at 09:12 PM
-- Server version: 5.7.24
-- PHP Version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mummys_yummys`
--

-- --------------------------------------------------------

--
-- Table structure for table `contact_us`
--

CREATE TABLE `contact_us` (
  `contact_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `message` text NOT NULL,
  `submitted_at` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `contact_us`
--

INSERT INTO `contact_us` (`contact_id`, `name`, `email`, `phone_number`, `message`, `submitted_at`) VALUES
(1, 'عبدالله الزهراني', 'abdullah@example.com', '0553219876', 'هل يمكنني تعديل وصفة بعد نشرها؟', '2025-04-20 09:15:00'),
(2, 'محمد الهاجري', 'mohammed@example.com', NULL, 'شكرًا على الموقع الرائع! أود اقتراح إضافة قسم للوصفات الشعبية.', '2025-04-17 20:10:00');

-- --------------------------------------------------------

--
-- Table structure for table `ingredients`
--

CREATE TABLE `ingredients` (
  `ingredient_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ingredients`
--

INSERT INTO `ingredients` (`ingredient_id`, `name`) VALUES
(1, 'أرز'),
(2, 'دجاج'),
(3, 'بهارات كبسة'),
(4, 'حليب'),
(5, 'سكر'),
(6, 'نشا'),
(7, 'فستق حلبي'),
(8, 'باذنجان'),
(9, 'أرز'),
(10, 'لحم مفروم'),
(11, 'عدس'),
(12, 'بصل'),
(13, 'طماطم'),
(14, 'خس'),
(15, 'خيار'),
(16, 'تمر'),
(17, 'طحين'),
(18, 'أرز بارد'),
(19, 'بصل أخضر'),
(20, 'بيضة'),
(21, 'ثوم'),
(22, 'صلصة الصويا'),
(23, 'شاي أسود'),
(24, 'سكر'),
(25, 'ثلج');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `user_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `liked_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`user_id`, `recipe_id`, `liked_at`) VALUES
(1, 2, '2025-04-20 14:25:35'),
(2, 1, '2025-04-20 14:25:35');

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `recipe_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` text,
  `type` varchar(100) DEFAULT NULL,
  `level` varchar(100) DEFAULT NULL,
  `time_to_make` int(11) DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`recipe_id`, `user_id`, `name`, `description`, `type`, `level`, `time_to_make`, `is_published`, `created_at`, `updated_at`, `image_url`) VALUES
(1, 1, 'كبسة الدجاج', 'وصفة شهية ومليئة بالنكهات الخليجية.', 'طبق رئيسي', 'متوسط', 90, 1, '2025-04-20 14:25:34', '2025-04-20 14:25:34', 'uploads/kabsa.jpg'),
(2, 2, 'مهلبية بالفستق', 'تحلية باردة ولذيذة مثالية للصيف.', 'تحلية', 'سهل', 30, 1, '2025-04-20 14:25:34', '2025-04-20 14:25:34', 'uploads/muhallabia.jpg'),
(3, 3, 'مقلوبة الباذنجان', 'وجبة فلسطينية تقليدية مليئة بالنكهات.', 'طبق رئيسي', 'متقدم', 80, 1, '2025-04-21 20:25:48', '2025-04-21 20:25:48', 'uploads/maqluba.jpg'),
(4, 4, 'شوربة العدس', 'شوربة صحية ولذيذة مثالية لأيام الشتاء.', 'شوربة', 'سهل', 25, 1, '2025-04-21 20:25:48', '2025-04-21 20:25:48', 'uploads/lentil_soup.jpg'),
(5, 5, 'سلطة الفتوش', 'سلطة شامية منعشة تحتوي على خضروات طازجة.', 'سلطة', 'سهل', 15, 1, '2025-04-21 20:25:48', '2025-04-21 20:25:48', 'uploads/fattoush.jpg'),
(6, 3, 'كيكة التمر', 'كيكة لذيذة محلاة بالتمر ومناسبة مع الشاي.', 'تحلية', 'متوسط', 50, 1, '2025-04-21 20:25:48', '2025-04-21 20:25:48', 'uploads/date_cake.jpg'),
(7, 1, 'رز مقلي اندونيسي', 'أشهر أطباق الأرز المقلي في إندونيسيا، يتميز بنكهات غنية من الصويا والثوم والتوابل.', 'طبق رئيسي', 'سهل', 30, 1, '2025-04-21 20:48:42', '2025-04-21 20:48:42', 'uploads/nasi_goreng.jpeg'),
(8, 2, 'شاي بارد', 'مشروب منعش من الشاي الحلو المثلج.', 'مشروب', 'سهل', 10, 1, '2025-04-21 20:48:42', '2025-04-21 20:48:42', 'uploads/iced_tea.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `recipe_ingredients`
--

CREATE TABLE `recipe_ingredients` (
  `recipe_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `quantity` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `recipe_ingredients`
--

INSERT INTO `recipe_ingredients` (`recipe_id`, `ingredient_id`, `quantity`) VALUES
(1, 1, '2 كوب'),
(1, 2, '1 دجاجة'),
(1, 3, '1 ملعقة كبيرة'),
(2, 4, '3 أكواب'),
(2, 5, 'نصف كوب'),
(2, 6, '3 ملاعق كبيرة'),
(2, 7, 'ربع كوب'),
(3, 1, '2 باذنجان متوسط'),
(3, 2, '2 كوب أرز'),
(3, 3, '200 جم لحم'),
(4, 4, '1 كوب'),
(4, 5, '1 بصلة مفرومة'),
(4, 6, '1 طماطم'),
(5, 7, '1 كوب'),
(5, 8, '1 خيار مقطع'),
(6, 9, '1 كوب تمر مهروس'),
(6, 10, '2 كوب طحين'),
(7, 1, '2 كوب أرز بارد'),
(7, 2, '2 ملعقة كبيرة بصل أخضر مفروم'),
(7, 3, '1 بيضة'),
(7, 4, '2 فص ثوم مهروس'),
(7, 5, '2 ملعقة كبيرة صلصة صويا'),
(8, 6, '1 كيس شاي'),
(8, 7, '2 ملعقة كبيرة سكر'),
(8, 8, 'كوب ثلج');

-- --------------------------------------------------------

--
-- Table structure for table `recipe_tags`
--

CREATE TABLE `recipe_tags` (
  `recipe_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `recipe_tags`
--

INSERT INTO `recipe_tags` (`recipe_id`, `tag_id`) VALUES
(1, 1),
(2, 2),
(1, 4),
(2, 5);

-- --------------------------------------------------------

--
-- Table structure for table `recipe_tools`
--

CREATE TABLE `recipe_tools` (
  `recipe_id` int(11) NOT NULL,
  `tool_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `recipe_tools`
--

INSERT INTO `recipe_tools` (`recipe_id`, `tool_id`) VALUES
(1, 1),
(4, 1),
(6, 1),
(1, 2),
(2, 2),
(3, 2),
(2, 3),
(6, 4),
(3, 5),
(5, 5);

-- --------------------------------------------------------

--
-- Table structure for table `saves`
--

CREATE TABLE `saves` (
  `user_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `saved_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `saves`
--

INSERT INTO `saves` (`user_id`, `recipe_id`, `saved_at`) VALUES
(1, 1, '2025-04-20 14:25:35'),
(2, 2, '2025-04-20 14:25:35');

-- --------------------------------------------------------

--
-- Table structure for table `steps`
--

CREATE TABLE `steps` (
  `step_id` int(11) NOT NULL,
  `recipe_id` int(11) DEFAULT NULL,
  `step_number` int(11) DEFAULT NULL,
  `instruction` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `steps`
--

INSERT INTO `steps` (`step_id`, `recipe_id`, `step_number`, `instruction`) VALUES
(1, 1, 1, 'اغسل الأرز جيدًا وانقعه في الماء.'),
(2, 1, 2, 'اقطع الدجاج واطبخه مع البهارات حتى ينضج.'),
(3, 1, 3, 'أضف الأرز واطبخ الخليط حتى الاستواء.'),
(4, 2, 1, 'اخلط الحليب مع النشا والسكر.'),
(5, 2, 2, 'ضع الخليط على النار وحرّك حتى يتماسك.'),
(6, 2, 3, 'صب المهلبية في الأكواب وضعها في الثلاجة.'),
(7, 2, 4, 'زيّنها بالفستق المطحون قبل التقديم.'),
(8, 3, 1, 'قلّي الباذنجان حتى يكتسب لوناً ذهبياً.'),
(9, 3, 2, 'اطبخ اللحم مع التوابل.'),
(10, 3, 3, 'رتب المكونات في قدر واطبخها مع الأرز.'),
(11, 4, 1, 'اغسل العدس جيداً.'),
(12, 4, 2, 'اقلي البصل، ثم أضف العدس والماء.'),
(13, 4, 3, 'اتركه يغلي حتى ينضج العدس.'),
(14, 5, 1, 'اخلط الخضروات في صحن.'),
(15, 5, 2, 'أضف عصير ليمون وزيت زيتون.'),
(16, 6, 1, 'اخلط التمر مع الماء الدافئ.'),
(17, 6, 2, 'أضف الطحين والمكونات الأخرى.'),
(18, 6, 3, 'اخبز الكيكة لمدة 30 دقيقة.'),
(19, 7, 1, 'سخن الزيت واقلي الثوم حتى تفوح رائحته.'),
(20, 7, 2, 'أضف البيض واطبخه كأومليت، ثم قطّعه.'),
(21, 7, 3, 'أضف الأرز وصلصة الصويا وقلّب جيدًا.'),
(22, 7, 4, 'أضف البصل الأخضر وقطع البيض واطبخ لمدة دقيقة.'),
(23, 8, 1, 'انقع كيس الشاي في ماء ساخن لمدة 5 دقائق.'),
(24, 8, 2, 'أضف السكر وحرك جيدًا حتى يذوب.'),
(25, 8, 3, 'صب الشاي فوق الثلج وقدمه فورًا.');

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `tag_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`tag_id`, `name`) VALUES
(1, 'رمضاني'),
(2, 'سريع'),
(3, 'صحي'),
(4, 'خليجي'),
(5, 'تحلية');

-- --------------------------------------------------------

--
-- Table structure for table `tools`
--

CREATE TABLE `tools` (
  `tool_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tools`
--

INSERT INTO `tools` (`tool_id`, `name`) VALUES
(1, 'قدر'),
(2, 'ملعقة خشب'),
(3, 'ثلاجة'),
(4, 'فرن'),
(5, 'قدر ضغط'),
(6, 'مقلاة'),
(7, 'خلاط'),
(8, 'صحن تقديم');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `first_name`, `last_name`, `phone_number`, `email`, `username`, `password_hash`, `profile_picture`) VALUES
(1, 'روان', 'حسين', '0566849506', 'rawan@gmail.com', 'RawanTallha', '1234', NULL),
(2, 'ريتال', 'هشام', '0566349506', 'rital@gmail.com', 'tata3', '333', NULL),
(3, 'همس', 'عسيري', '0562946271', 'hams@gmail.com', 'hamsassiri', '123', NULL),
(4, 'أحمد', 'الشمري', '0551234567', 'ahmad@example.com', 'ahmad_chef', '1234', NULL),
(5, 'ليلى', 'الخطيب', '0557654321', 'layla@example.com', 'layla_kitchen', '1234', NULL),
(6, 'سارة', 'المالكي', '0551122334', 'sara@example.com', 'sara_homecooking', '1234', NULL),
(7, 'خالد', 'الغامدي', '0554455667', 'khaled@example.com', 'chef_khaled', '1234', NULL),
(8, 'نجوى', 'الأنصاري', '0557788991', 'najwa@example.com', 'najwas_kitchen', '1234', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact_us`
--
ALTER TABLE `contact_us`
  ADD PRIMARY KEY (`contact_id`);

--
-- Indexes for table `ingredients`
--
ALTER TABLE `ingredients`
  ADD PRIMARY KEY (`ingredient_id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`user_id`,`recipe_id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`recipe_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  ADD PRIMARY KEY (`recipe_id`,`ingredient_id`),
  ADD KEY `ingredient_id` (`ingredient_id`);

--
-- Indexes for table `recipe_tags`
--
ALTER TABLE `recipe_tags`
  ADD PRIMARY KEY (`recipe_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `recipe_tools`
--
ALTER TABLE `recipe_tools`
  ADD PRIMARY KEY (`recipe_id`,`tool_id`),
  ADD KEY `tool_id` (`tool_id`);

--
-- Indexes for table `saves`
--
ALTER TABLE `saves`
  ADD PRIMARY KEY (`user_id`,`recipe_id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Indexes for table `steps`
--
ALTER TABLE `steps`
  ADD PRIMARY KEY (`step_id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`tag_id`);

--
-- Indexes for table `tools`
--
ALTER TABLE `tools`
  ADD PRIMARY KEY (`tool_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact_us`
--
ALTER TABLE `contact_us`
  MODIFY `contact_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `ingredients`
--
ALTER TABLE `ingredients`
  MODIFY `ingredient_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `recipe_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `steps`
--
ALTER TABLE `steps`
  MODIFY `step_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tools`
--
ALTER TABLE `tools`
  MODIFY `tool_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`);

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `recipe_ingredients`
--
ALTER TABLE `recipe_ingredients`
  ADD CONSTRAINT `recipe_ingredients_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  ADD CONSTRAINT `recipe_ingredients_ibfk_2` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredients` (`ingredient_id`);

--
-- Constraints for table `recipe_tags`
--
ALTER TABLE `recipe_tags`
  ADD CONSTRAINT `recipe_tags_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  ADD CONSTRAINT `recipe_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`);

--
-- Constraints for table `recipe_tools`
--
ALTER TABLE `recipe_tools`
  ADD CONSTRAINT `recipe_tools_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`),
  ADD CONSTRAINT `recipe_tools_ibfk_2` FOREIGN KEY (`tool_id`) REFERENCES `tools` (`tool_id`);

--
-- Constraints for table `saves`
--
ALTER TABLE `saves`
  ADD CONSTRAINT `saves_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `saves_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`);

--
-- Constraints for table `steps`
--
ALTER TABLE `steps`
  ADD CONSTRAINT `steps_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`recipe_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
