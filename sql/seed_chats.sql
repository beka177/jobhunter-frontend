-- Демо-переписки JobSearch (25 диалогов с сообщениями).
-- Импортировать ПОСЛЕ seed_demo.sql.
SET NAMES utf8mb4;
-- Очистка прошлого демо-сида чатов (сообщения удалятся каскадом).
DELETE FROM conversations WHERE id BETWEEN 93001 AND 93999;

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93001, 90120, 90008, NULL, (NOW() - INTERVAL 22999 MINUTE), (NOW() - INTERVAL 22999 MINUTE), (NOW() - INTERVAL 23422 MINUTE), (NOW() - INTERVAL 22999 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94001, 93001, 90120, 'Добрый день! Подскажите, актуальна ли ещё вакансия?', 'text', (NOW() - INTERVAL 23422 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94002, 93001, 90008, 'Добрый день! Да, вакансия актуальна. Какой у вас опыт работы?', 'text', (NOW() - INTERVAL 23230 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94003, 93001, 90120, 'Опыт работы — 5 лет, владею всеми необходимыми навыками.', 'text', (NOW() - INTERVAL 23218 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94004, 93001, 90008, 'Хорошо, ваш опыт нам подходит. Предлагаю созвон завтра.', 'text', (NOW() - INTERVAL 23206 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94005, 93001, 90120, 'Спасибо большое, жду информацию о собеседовании.', 'text', (NOW() - INTERVAL 22999 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93002, 90123, 90006, NULL, (NOW() - INTERVAL 23899 MINUTE), (NOW() - INTERVAL 23899 MINUTE), (NOW() - INTERVAL 24016 MINUTE), (NOW() - INTERVAL 23899 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94006, 93002, 90123, 'Добрый день! Подскажите, актуальна ли ещё вакансия?', 'text', (NOW() - INTERVAL 24016 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94007, 93002, 90006, 'Здравствуйте! Рады знакомству. Вы готовы пройти собеседование?', 'text', (NOW() - INTERVAL 23991 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94008, 93002, 90123, 'Резюме уже добавил(а) в профиль, можете посмотреть.', 'text', (NOW() - INTERVAL 23930 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94009, 93002, 90006, 'Звучит хорошо. Какие у вас зарплатные ожидания?', 'text', (NOW() - INTERVAL 23899 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93003, 90105, 90005, NULL, (NOW() - INTERVAL 5012 MINUTE), (NOW() - INTERVAL 5676 MINUTE), (NOW() - INTERVAL 5676 MINUTE), (NOW() - INTERVAL 5012 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94010, 93003, 90105, 'Здравствуйте! Хотел(а) бы откликнуться на вашу вакансию.', 'text', (NOW() - INTERVAL 5676 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94011, 93003, 90005, 'Добрый день! Да, вакансия актуальна. Какой у вас опыт работы?', 'text', (NOW() - INTERVAL 5458 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94012, 93003, 90105, 'Резюме уже добавил(а) в профиль, можете посмотреть.', 'text', (NOW() - INTERVAL 5284 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94013, 93003, 90005, 'Отлично! Давайте назначим собеседование на этой неделе.', 'text', (NOW() - INTERVAL 5249 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94014, 93003, 90105, 'Отлично, до связи!', 'text', (NOW() - INTERVAL 5012 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93004, 90118, 90001, NULL, (NOW() - INTERVAL 29910 MINUTE), (NOW() - INTERVAL 30473 MINUTE), (NOW() - INTERVAL 30473 MINUTE), (NOW() - INTERVAL 29910 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94015, 93004, 90118, 'Добрый день! Подскажите, актуальна ли ещё вакансия?', 'text', (NOW() - INTERVAL 30473 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94016, 93004, 90001, 'Добрый день! Спасибо, что откликнулись. Пришлите, пожалуйста, резюме.', 'text', (NOW() - INTERVAL 30366 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94017, 93004, 90118, 'Опыт работы — 5 лет, владею всеми необходимыми навыками.', 'text', (NOW() - INTERVAL 30171 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94018, 93004, 90001, 'Работодатель пригласил вас на собеседование.', 'system', (NOW() - INTERVAL 30145 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94019, 93004, 90001, 'Звучит хорошо. Какие у вас зарплатные ожидания?', 'text', (NOW() - INTERVAL 29955 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94020, 93004, 90118, 'Спасибо большое, жду информацию о собеседовании.', 'text', (NOW() - INTERVAL 29910 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93005, 90116, 90008, NULL, (NOW() - INTERVAL 22712 MINUTE), (NOW() - INTERVAL 22712 MINUTE), (NOW() - INTERVAL 23084 MINUTE), (NOW() - INTERVAL 22712 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94021, 93005, 90116, 'Здравствуйте! Меня заинтересовала ваша вакансия, готов(а) рассмотреть предложение.', 'text', (NOW() - INTERVAL 23084 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94022, 93005, 90008, 'Добрый день! Да, вакансия актуальна. Какой у вас опыт работы?', 'text', (NOW() - INTERVAL 23040 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94023, 93005, 90116, 'Резюме уже добавил(а) в профиль, можете посмотреть.', 'text', (NOW() - INTERVAL 22895 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94024, 93005, 90008, 'Хорошо, ваш опыт нам подходит. Предлагаю созвон завтра.', 'text', (NOW() - INTERVAL 22750 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94025, 93005, 90116, 'Спасибо большое, жду информацию о собеседовании.', 'text', (NOW() - INTERVAL 22712 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93006, 90124, 90008, NULL, (NOW() - INTERVAL 13810 MINUTE), (NOW() - INTERVAL 13810 MINUTE), (NOW() - INTERVAL 13950 MINUTE), (NOW() - INTERVAL 13810 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94026, 93006, 90124, 'Здравствуйте! Меня заинтересовала ваша вакансия, готов(а) рассмотреть предложение.', 'text', (NOW() - INTERVAL 13950 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94027, 93006, 90008, 'Добрый день! Да, вакансия актуальна. Какой у вас опыт работы?', 'text', (NOW() - INTERVAL 13938 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94028, 93006, 90124, 'Резюме уже добавил(а) в профиль, можете посмотреть.', 'text', (NOW() - INTERVAL 13869 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94029, 93006, 90008, 'Хорошо, ваш опыт нам подходит. Предлагаю созвон завтра.', 'text', (NOW() - INTERVAL 13810 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93007, 90109, 90002, NULL, (NOW() - INTERVAL 22775 MINUTE), (NOW() - INTERVAL 23305 MINUTE), (NOW() - INTERVAL 23305 MINUTE), (NOW() - INTERVAL 22775 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94030, 93007, 90109, 'Здравствуйте! Хотел(а) бы откликнуться на вашу вакансию.', 'text', (NOW() - INTERVAL 23305 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94031, 93007, 90002, 'Здравствуйте! Рады знакомству. Вы готовы пройти собеседование?', 'text', (NOW() - INTERVAL 23071 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94032, 93007, 90109, 'Резюме уже добавил(а) в профиль, можете посмотреть.', 'text', (NOW() - INTERVAL 22949 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94033, 93007, 90002, 'Отлично! Давайте назначим собеседование на этой неделе.', 'text', (NOW() - INTERVAL 22775 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93008, 90104, 90003, NULL, (NOW() - INTERVAL 11751 MINUTE), (NOW() - INTERVAL 11751 MINUTE), (NOW() - INTERVAL 12120 MINUTE), (NOW() - INTERVAL 11751 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94034, 93008, 90104, 'Добрый день! Очень хочу попасть в вашу команду, расскажите подробнее об условиях.', 'text', (NOW() - INTERVAL 12120 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94035, 93008, 90003, 'Добрый день! Да, вакансия актуальна. Какой у вас опыт работы?', 'text', (NOW() - INTERVAL 11960 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94036, 93008, 90104, 'Опыт работы — 5 лет, владею всеми необходимыми навыками.', 'text', (NOW() - INTERVAL 11954 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94037, 93008, 90003, 'Отлично! Давайте назначим собеседование на этой неделе.', 'text', (NOW() - INTERVAL 11751 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93009, 90118, 90003, NULL, (NOW() - INTERVAL 6607 MINUTE), (NOW() - INTERVAL 6607 MINUTE), (NOW() - INTERVAL 7073 MINUTE), (NOW() - INTERVAL 6607 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94038, 93009, 90118, 'Добрый день! Подскажите, актуальна ли ещё вакансия?', 'text', (NOW() - INTERVAL 7073 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94039, 93009, 90003, 'Добрый день! Спасибо, что откликнулись. Пришлите, пожалуйста, резюме.', 'text', (NOW() - INTERVAL 6842 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94040, 93009, 90118, 'У меня более трёх лет опыта в этой сфере.', 'text', (NOW() - INTERVAL 6694 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94041, 93009, 90003, 'Звучит хорошо. Какие у вас зарплатные ожидания?', 'text', (NOW() - INTERVAL 6675 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94042, 93009, 90118, 'Спасибо большое, жду информацию о собеседовании.', 'text', (NOW() - INTERVAL 6607 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93010, 90116, 90005, NULL, (NOW() - INTERVAL 17678 MINUTE), (NOW() - INTERVAL 17678 MINUTE), (NOW() - INTERVAL 18285 MINUTE), (NOW() - INTERVAL 17678 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94043, 93010, 90116, 'Здравствуйте! Меня заинтересовала ваша вакансия, готов(а) рассмотреть предложение.', 'text', (NOW() - INTERVAL 18285 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94044, 93010, 90005, 'Добрый день! Спасибо, что откликнулись. Пришлите, пожалуйста, резюме.', 'text', (NOW() - INTERVAL 18165 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94045, 93010, 90116, 'У меня более трёх лет опыта в этой сфере.', 'text', (NOW() - INTERVAL 18030 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94046, 93010, 90005, 'Отлично! Давайте назначим собеседование на этой неделе.', 'text', (NOW() - INTERVAL 17889 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94047, 93010, 90116, 'Хорошо, буду ждать. Спасибо за ответ!', 'text', (NOW() - INTERVAL 17678 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93011, 90122, 90003, NULL, (NOW() - INTERVAL 28744 MINUTE), (NOW() - INTERVAL 28744 MINUTE), (NOW() - INTERVAL 29094 MINUTE), (NOW() - INTERVAL 28744 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94048, 93011, 90122, 'Добрый день! Подскажите, актуальна ли ещё вакансия?', 'text', (NOW() - INTERVAL 29094 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94049, 93011, 90003, 'Здравствуйте! Рады знакомству. Вы готовы пройти собеседование?', 'text', (NOW() - INTERVAL 29009 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94050, 93011, 90122, 'Опыт работы — 5 лет, владею всеми необходимыми навыками.', 'text', (NOW() - INTERVAL 28986 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94051, 93011, 90003, 'Хорошо, ваш опыт нам подходит. Предлагаю созвон завтра.', 'text', (NOW() - INTERVAL 28810 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94052, 93011, 90122, 'Спасибо большое, жду информацию о собеседовании.', 'text', (NOW() - INTERVAL 28744 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93012, 90109, 90004, NULL, (NOW() - INTERVAL 30381 MINUTE), (NOW() - INTERVAL 30381 MINUTE), (NOW() - INTERVAL 30773 MINUTE), (NOW() - INTERVAL 30381 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94053, 93012, 90109, 'Здравствуйте! Хотел(а) бы откликнуться на вашу вакансию.', 'text', (NOW() - INTERVAL 30773 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94054, 93012, 90004, 'Здравствуйте! Спасибо за отклик. Расскажите немного о вашем опыте.', 'text', (NOW() - INTERVAL 30712 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94055, 93012, 90109, 'Опыт работы — 5 лет, владею всеми необходимыми навыками.', 'text', (NOW() - INTERVAL 30516 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94056, 93012, 90004, 'Звучит хорошо. Какие у вас зарплатные ожидания?', 'text', (NOW() - INTERVAL 30487 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94057, 93012, 90109, 'Хорошо, буду ждать. Спасибо за ответ!', 'text', (NOW() - INTERVAL 30381 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93013, 90123, 90004, NULL, (NOW() - INTERVAL 23090 MINUTE), (NOW() - INTERVAL 23090 MINUTE), (NOW() - INTERVAL 23491 MINUTE), (NOW() - INTERVAL 23090 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94058, 93013, 90123, 'Добрый день! Подскажите, актуальна ли ещё вакансия?', 'text', (NOW() - INTERVAL 23491 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94059, 93013, 90004, 'Добрый день! Да, вакансия актуальна. Какой у вас опыт работы?', 'text', (NOW() - INTERVAL 23405 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94060, 93013, 90123, 'Резюме уже добавил(а) в профиль, можете посмотреть.', 'text', (NOW() - INTERVAL 23377 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94061, 93013, 90004, 'Спасибо! Мы рассмотрим вашу кандидатуру и вернёмся с ответом.', 'text', (NOW() - INTERVAL 23188 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94062, 93013, 90123, 'Хорошо, буду ждать. Спасибо за ответ!', 'text', (NOW() - INTERVAL 23090 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93014, 90112, 90003, NULL, (NOW() - INTERVAL 6746 MINUTE), (NOW() - INTERVAL 6746 MINUTE), (NOW() - INTERVAL 7515 MINUTE), (NOW() - INTERVAL 6746 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94063, 93014, 90112, 'Добрый день! Очень хочу попасть в вашу команду, расскажите подробнее об условиях.', 'text', (NOW() - INTERVAL 7515 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94064, 93014, 90003, 'Добрый день! Спасибо, что откликнулись. Пришлите, пожалуйста, резюме.', 'text', (NOW() - INTERVAL 7275 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94065, 93014, 90112, 'У меня более трёх лет опыта в этой сфере.', 'text', (NOW() - INTERVAL 7069 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94066, 93014, 90003, 'Работодатель пригласил вас на собеседование.', 'system', (NOW() - INTERVAL 7006 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94067, 93014, 90003, 'Звучит хорошо. Какие у вас зарплатные ожидания?', 'text', (NOW() - INTERVAL 6777 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94068, 93014, 90112, 'Договорились, спасибо!', 'text', (NOW() - INTERVAL 6746 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93015, 90107, 90001, NULL, (NOW() - INTERVAL 16775 MINUTE), (NOW() - INTERVAL 16775 MINUTE), (NOW() - INTERVAL 17068 MINUTE), (NOW() - INTERVAL 16775 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94069, 93015, 90107, 'Здравствуйте! Меня заинтересовала ваша вакансия, готов(а) рассмотреть предложение.', 'text', (NOW() - INTERVAL 17068 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94070, 93015, 90001, 'Добрый день! Да, вакансия актуальна. Какой у вас опыт работы?', 'text', (NOW() - INTERVAL 16960 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94071, 93015, 90107, 'Да, готов(а). Когда вам будет удобно?', 'text', (NOW() - INTERVAL 16917 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94072, 93015, 90001, 'Спасибо! Мы рассмотрим вашу кандидатуру и вернёмся с ответом.', 'text', (NOW() - INTERVAL 16775 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93016, 90125, 90009, NULL, (NOW() - INTERVAL 17260 MINUTE), (NOW() - INTERVAL 17260 MINUTE), (NOW() - INTERVAL 17744 MINUTE), (NOW() - INTERVAL 17260 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94073, 93016, 90125, 'Добрый день! Очень хочу попасть в вашу команду, расскажите подробнее об условиях.', 'text', (NOW() - INTERVAL 17744 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94074, 93016, 90009, 'Здравствуйте! Рады знакомству. Вы готовы пройти собеседование?', 'text', (NOW() - INTERVAL 17735 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94075, 93016, 90125, 'У меня более трёх лет опыта в этой сфере.', 'text', (NOW() - INTERVAL 17568 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94076, 93016, 90009, 'Работодатель пригласил вас на собеседование.', 'system', (NOW() - INTERVAL 17541 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94077, 93016, 90009, 'Хорошо, ваш опыт нам подходит. Предлагаю созвон завтра.', 'text', (NOW() - INTERVAL 17331 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94078, 93016, 90125, 'Договорились, спасибо!', 'text', (NOW() - INTERVAL 17260 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93017, 90120, 90001, NULL, (NOW() - INTERVAL 17317 MINUTE), (NOW() - INTERVAL 17317 MINUTE), (NOW() - INTERVAL 17674 MINUTE), (NOW() - INTERVAL 17317 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94079, 93017, 90120, 'Добрый день! Подскажите, актуальна ли ещё вакансия?', 'text', (NOW() - INTERVAL 17674 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94080, 93017, 90001, 'Здравствуйте! Спасибо за отклик. Расскажите немного о вашем опыте.', 'text', (NOW() - INTERVAL 17510 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94081, 93017, 90120, 'Да, готов(а). Когда вам будет удобно?', 'text', (NOW() - INTERVAL 17472 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94082, 93017, 90001, 'Спасибо! Мы рассмотрим вашу кандидатуру и вернёмся с ответом.', 'text', (NOW() - INTERVAL 17456 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94083, 93017, 90120, 'Спасибо большое, жду информацию о собеседовании.', 'text', (NOW() - INTERVAL 17317 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93018, 90105, 90010, NULL, (NOW() - INTERVAL 18569 MINUTE), (NOW() - INTERVAL 19122 MINUTE), (NOW() - INTERVAL 19122 MINUTE), (NOW() - INTERVAL 18569 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94084, 93018, 90105, 'Здравствуйте! Меня заинтересовала ваша вакансия, готов(а) рассмотреть предложение.', 'text', (NOW() - INTERVAL 19122 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94085, 93018, 90010, 'Добрый день! Да, вакансия актуальна. Какой у вас опыт работы?', 'text', (NOW() - INTERVAL 19003 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94086, 93018, 90105, 'Да, готов(а). Когда вам будет удобно?', 'text', (NOW() - INTERVAL 18870 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94087, 93018, 90010, 'Отклик принят работодателем.', 'system', (NOW() - INTERVAL 18693 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94088, 93018, 90010, 'Звучит хорошо. Какие у вас зарплатные ожидания?', 'text', (NOW() - INTERVAL 18643 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94089, 93018, 90105, 'Хорошо, буду ждать. Спасибо за ответ!', 'text', (NOW() - INTERVAL 18569 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93019, 90125, 90010, NULL, (NOW() - INTERVAL 28713 MINUTE), (NOW() - INTERVAL 28713 MINUTE), (NOW() - INTERVAL 29418 MINUTE), (NOW() - INTERVAL 28713 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94090, 93019, 90125, 'Здравствуйте! Хотел(а) бы откликнуться на вашу вакансию.', 'text', (NOW() - INTERVAL 29418 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94091, 93019, 90010, 'Здравствуйте! Спасибо за отклик. Расскажите немного о вашем опыте.', 'text', (NOW() - INTERVAL 29386 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94092, 93019, 90125, 'У меня более трёх лет опыта в этой сфере.', 'text', (NOW() - INTERVAL 29213 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94093, 93019, 90010, 'Работодатель пригласил вас на собеседование.', 'system', (NOW() - INTERVAL 28999 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94094, 93019, 90010, 'Хорошо, ваш опыт нам подходит. Предлагаю созвон завтра.', 'text', (NOW() - INTERVAL 28828 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94095, 93019, 90125, 'Хорошо, буду ждать. Спасибо за ответ!', 'text', (NOW() - INTERVAL 28713 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93020, 90124, 90006, NULL, (NOW() - INTERVAL 26274 MINUTE), (NOW() - INTERVAL 26274 MINUTE), (NOW() - INTERVAL 26642 MINUTE), (NOW() - INTERVAL 26274 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94096, 93020, 90124, 'Добрый день! Очень хочу попасть в вашу команду, расскажите подробнее об условиях.', 'text', (NOW() - INTERVAL 26642 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94097, 93020, 90006, 'Здравствуйте! Рады знакомству. Вы готовы пройти собеседование?', 'text', (NOW() - INTERVAL 26549 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94098, 93020, 90124, 'Опыт работы — 5 лет, владею всеми необходимыми навыками.', 'text', (NOW() - INTERVAL 26531 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94099, 93020, 90006, 'Звучит хорошо. Какие у вас зарплатные ожидания?', 'text', (NOW() - INTERVAL 26312 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94100, 93020, 90124, 'Хорошо, буду ждать. Спасибо за ответ!', 'text', (NOW() - INTERVAL 26274 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93021, 90114, 90003, NULL, (NOW() - INTERVAL 18109 MINUTE), (NOW() - INTERVAL 18109 MINUTE), (NOW() - INTERVAL 18596 MINUTE), (NOW() - INTERVAL 18109 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94101, 93021, 90114, 'Здравствуйте! Хотел(а) бы откликнуться на вашу вакансию.', 'text', (NOW() - INTERVAL 18596 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94102, 93021, 90003, 'Добрый день! Спасибо, что откликнулись. Пришлите, пожалуйста, резюме.', 'text', (NOW() - INTERVAL 18438 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94103, 93021, 90114, 'Опыт работы — 5 лет, владею всеми необходимыми навыками.', 'text', (NOW() - INTERVAL 18371 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94104, 93021, 90003, 'Работодатель пригласил вас на собеседование.', 'system', (NOW() - INTERVAL 18189 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94105, 93021, 90003, 'Спасибо! Мы рассмотрим вашу кандидатуру и вернёмся с ответом.', 'text', (NOW() - INTERVAL 18109 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93022, 90109, 90007, NULL, (NOW() - INTERVAL 35576 MINUTE), (NOW() - INTERVAL 35576 MINUTE), (NOW() - INTERVAL 35973 MINUTE), (NOW() - INTERVAL 35576 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94106, 93022, 90109, 'Добрый день! Подскажите, актуальна ли ещё вакансия?', 'text', (NOW() - INTERVAL 35973 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94107, 93022, 90007, 'Здравствуйте! Рады знакомству. Вы готовы пройти собеседование?', 'text', (NOW() - INTERVAL 35886 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94108, 93022, 90109, 'Резюме уже добавил(а) в профиль, можете посмотреть.', 'text', (NOW() - INTERVAL 35819 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94109, 93022, 90007, 'Статус отклика изменён на «на рассмотрении».', 'system', (NOW() - INTERVAL 35806 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94110, 93022, 90007, 'Звучит хорошо. Какие у вас зарплатные ожидания?', 'text', (NOW() - INTERVAL 35576 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93023, 90101, 90009, NULL, (NOW() - INTERVAL 15941 MINUTE), (NOW() - INTERVAL 15941 MINUTE), (NOW() - INTERVAL 16384 MINUTE), (NOW() - INTERVAL 15941 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94111, 93023, 90101, 'Добрый день! Подскажите, актуальна ли ещё вакансия?', 'text', (NOW() - INTERVAL 16384 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94112, 93023, 90009, 'Здравствуйте! Спасибо за отклик. Расскажите немного о вашем опыте.', 'text', (NOW() - INTERVAL 16250 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94113, 93023, 90101, 'Да, готов(а). Когда вам будет удобно?', 'text', (NOW() - INTERVAL 16047 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94114, 93023, 90009, 'Статус отклика изменён на «на рассмотрении».', 'system', (NOW() - INTERVAL 16041 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94115, 93023, 90009, 'Звучит хорошо. Какие у вас зарплатные ожидания?', 'text', (NOW() - INTERVAL 16013 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94116, 93023, 90101, 'Хорошо, буду ждать. Спасибо за ответ!', 'text', (NOW() - INTERVAL 15941 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93024, 90103, 90006, NULL, (NOW() - INTERVAL 38504 MINUTE), (NOW() - INTERVAL 38504 MINUTE), (NOW() - INTERVAL 39216 MINUTE), (NOW() - INTERVAL 38504 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94117, 93024, 90103, 'Добрый день! Очень хочу попасть в вашу команду, расскажите подробнее об условиях.', 'text', (NOW() - INTERVAL 39216 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94118, 93024, 90006, 'Здравствуйте! Спасибо за отклик. Расскажите немного о вашем опыте.', 'text', (NOW() - INTERVAL 39112 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94119, 93024, 90103, 'Резюме уже добавил(а) в профиль, можете посмотреть.', 'text', (NOW() - INTERVAL 38912 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94120, 93024, 90006, 'Статус отклика изменён на «на рассмотрении».', 'system', (NOW() - INTERVAL 38824 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94121, 93024, 90006, 'Хорошо, ваш опыт нам подходит. Предлагаю созвон завтра.', 'text', (NOW() - INTERVAL 38635 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94122, 93024, 90103, 'Хорошо, буду ждать. Спасибо за ответ!', 'text', (NOW() - INTERVAL 38504 MINUTE));

INSERT INTO conversations (id, seeker_id, employer_id, vacancy_id, seeker_last_read_at, employer_last_read_at, created_at, updated_at) VALUES (93025, 90106, 90010, NULL, (NOW() - INTERVAL 32593 MINUTE), (NOW() - INTERVAL 32593 MINUTE), (NOW() - INTERVAL 33174 MINUTE), (NOW() - INTERVAL 32593 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94123, 93025, 90106, 'Добрый день! Подскажите, актуальна ли ещё вакансия?', 'text', (NOW() - INTERVAL 33174 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94124, 93025, 90010, 'Здравствуйте! Спасибо за отклик. Расскажите немного о вашем опыте.', 'text', (NOW() - INTERVAL 33024 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94125, 93025, 90106, 'Резюме уже добавил(а) в профиль, можете посмотреть.', 'text', (NOW() - INTERVAL 32806 MINUTE));
INSERT INTO messages (id, conversation_id, sender_id, body, type, created_at) VALUES (94126, 93025, 90010, 'Хорошо, ваш опыт нам подходит. Предлагаю созвон завтра.', 'text', (NOW() - INTERVAL 32593 MINUTE));

