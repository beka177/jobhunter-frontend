-- ============================================================
-- JobSearch — структура базы данных (DDL)
-- Сгенерировано через SHOW CREATE TABLE
-- ============================================================

-- ---------- Таблица: applications ----------
DROP TABLE IF EXISTS `applications`;
CREATE TABLE `applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vacancy_id` int NOT NULL,
  `seeker_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  KEY `vacancy_id` (`vacancy_id`),
  KEY `seeker_id` (`seeker_id`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`vacancy_id`) REFERENCES `vacancies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`seeker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=932 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------- Таблица: conversations ----------
DROP TABLE IF EXISTS `conversations`;
CREATE TABLE `conversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seeker_id` int NOT NULL,
  `employer_id` int NOT NULL,
  `vacancy_id` int DEFAULT NULL,
  `seeker_last_read_at` datetime DEFAULT NULL,
  `employer_last_read_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_pair` (`seeker_id`,`employer_id`),
  KEY `idx_seeker` (`seeker_id`),
  KEY `idx_employer` (`employer_id`),
  KEY `fk_conv_vacancy` (`vacancy_id`),
  CONSTRAINT `fk_conv_employer` FOREIGN KEY (`employer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_conv_seeker` FOREIGN KEY (`seeker_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_conv_vacancy` FOREIGN KEY (`vacancy_id`) REFERENCES `vacancies` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Таблица: favorites ----------
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `vacancy_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_favorite` (`user_id`,`vacancy_id`),
  KEY `vacancy_id` (`vacancy_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`vacancy_id`) REFERENCES `vacancies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=655 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------- Таблица: help_articles ----------
DROP TABLE IF EXISTS `help_articles`;
CREATE TABLE `help_articles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------- Таблица: messages ----------
DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conversation_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('text','system') DEFAULT 'text',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_conv` (`conversation_id`,`created_at`),
  KEY `idx_sender` (`sender_id`),
  CONSTRAINT `fk_msg_conv` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_msg_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Таблица: resumes ----------
DROP TABLE IF EXISTS `resumes`;
CREATE TABLE `resumes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `surname` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `patronymic` varchar(100) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `citizenship` varchar(100) DEFAULT NULL,
  `work_permit` varchar(100) DEFAULT NULL,
  `profession` varchar(255) DEFAULT NULL,
  `education_level` varchar(100) DEFAULT NULL,
  `education_institution` varchar(255) DEFAULT NULL,
  `education_faculty` varchar(255) DEFAULT NULL,
  `education_specialization` varchar(255) DEFAULT NULL,
  `education_year` varchar(20) DEFAULT NULL,
  `skills` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `resumes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=322 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------- Таблица: users ----------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('seeker','employer','admin') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `avatar` varchar(500) DEFAULT NULL,
  `banned_until` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=409 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ---------- Таблица: vacancies ----------
DROP TABLE IF EXISTS `vacancies`;
CREATE TABLE `vacancies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employer_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `salary` varchar(100) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(500) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employer_id` (`employer_id`),
  CONSTRAINT `vacancies_ibfk_1` FOREIGN KEY (`employer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=299 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

