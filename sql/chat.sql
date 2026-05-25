-- ============================================================
-- JobSearch — таблицы для чатов между соискателями и работодателями
-- Импортировать через phpMyAdmin (вкладка SQL) в базе `jobsearch`
-- ============================================================

-- Диалоги: одна строка на пару (seeker, employer).
-- vacancy_id — необязательная привязка к вакансии, по которой начался чат.
-- *_last_read_at используются для подсчёта непрочитанных сообщений.
CREATE TABLE IF NOT EXISTS conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seeker_id INT NOT NULL,
    employer_id INT NOT NULL,
    vacancy_id INT NULL,
    seeker_last_read_at DATETIME NULL,
    employer_last_read_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_pair (seeker_id, employer_id),
    KEY idx_seeker (seeker_id),
    KEY idx_employer (employer_id),
    CONSTRAINT fk_conv_seeker   FOREIGN KEY (seeker_id)   REFERENCES users(id)     ON DELETE CASCADE,
    CONSTRAINT fk_conv_employer FOREIGN KEY (employer_id) REFERENCES users(id)     ON DELETE CASCADE,
    CONSTRAINT fk_conv_vacancy  FOREIGN KEY (vacancy_id)  REFERENCES vacancies(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Сообщения в диалоге
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY idx_conv (conversation_id, created_at),
    KEY idx_sender (sender_id),
    CONSTRAINT fk_msg_conv   FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_msg_sender FOREIGN KEY (sender_id)       REFERENCES users(id)         ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
