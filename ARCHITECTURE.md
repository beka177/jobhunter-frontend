# Архитектура веб-приложения JobSearch

## 1. Общая архитектура

JobSearch — это full-stack веб-приложение для поиска работы и сотрудников в Казахстане. Реализовано по классической клиент-серверной схеме (монолит с разделением frontend / backend):

```
┌─────────────────────────────────┐    HTTP (fetch)     ┌──────────────────────────┐
│  Frontend (React SPA)            │ ◄──────────────────► │  Backend (PHP + PDO)     │
│  localhost:3000                  │    JSON (REST API)   │  http://jobsearch/api    │
└─────────────────────────────────┘                      └──────┬───────────────────┘
                                                                │
                                                         ┌──────▼───────────────────┐
                                                         │  MySQL (jobsearch)       │
                                                         │  OSPanel (127.0.0.1)     │
                                                         └──────────────────────────┘
```

Фронтенд работает на порту 3000 (Vite dev-server), бэкенд — на стандартном 80-м порту в OSPanel. Связь — через `fetch()` с `http://jobsearch/api/...`.

---

## 2. Фронтенд (React + Vite + TailwindCSS)

### 2.1 Стек технологий

| Технология | Назначение |
|---|---|
| **React 18** | Библиотека для построения пользовательского интерфейса (компонентный подход) |
| **Vite 5** | Сборщик модулей (bundler), dev-сервер с HMR (Hot Module Replacement) |
| **TailwindCSS 3** | Utility-first CSS-фреймворк (все стили пишутся классами в JSX) |
| **Lucide React** | Библиотека SVG-иконок |
| **ESLint 8** | Линтер для поддержания качества кода |

### 2.2 Структура проекта (src/)

```
src/
├── main.jsx          — точка входа (рендер корневого компонента)
├── App.jsx           — корневой компонент, state-based роутинг
├── index.css         — Tailwind directives + кастомные keyframe-анимации
├── constants.js      — API_URL, UserRole, список городов
├── hooks.js          — кастомный хук useDebounce
├── i18n.jsx          — интернационализация (русский / казахский)
├── toast.jsx         — система всплывающих уведомлений (тосты)
│
├── assets/           — статические ресурсы (favicon и т.п.)
│
└── components/       — 21 компонент React:
    ├── AdminPanel.jsx         — панель администратора (статистика,
    │                            пользователи, вакансии, диалоги)
    ├── AIChatWidget.jsx       — плавающий ИИ-помощник (Google Gemini)
    ├── ApplicationsList.jsx   — отклики для работодателя
    ├── AuthForm.jsx           — форма входа / регистрации
    ├── BackButton.jsx         — кнопка «Назад»
    ├── CreateVacancyForm.jsx  — создание новой вакансии
    ├── EditProfileForm.jsx    — редактирование профиля
    ├── EditVacancyForm.jsx    — редактирование вакансии
    ├── EmployerDashboard.jsx  — личный кабинет работодателя
    ├── FavoritesList.jsx      — избранные вакансии
    ├── FileUpload.jsx         — загрузчик файлов на сервер
    ├── Footer.jsx             — подвал сайта
    ├── HelpPage.jsx           — страница помощи
    ├── LandingPage.jsx        — лендинг (главная страница для гостей)
    ├── MessagesPage.jsx       — страница сообщений (чаты)
    ├── Navbar.jsx             — навбар (меню навигации)
    ├── ResumeForm.jsx         — форма заполнения резюме
    ├── SeekerApplications.jsx — история откликов соискателя
    ├── SeekerList.jsx         — каталог соискателей
    ├── VacancyDetails.jsx     — детальная страница вакансии
    └── VacancyList.jsx        — список вакансий с фильтрацией
```

### 2.3 Маршрутизация (state-based)

В приложении **не используется React Router**. Маршрутизация реализована через состояние `currentPage` в корневом компоненте `App.jsx`. Это упрощает архитектуру и даёт централизованный контроль над видимостью страниц.

Принцип работы:
- `currentPage` управляется через `setCurrentPage()`
- В зависимости от значения рендерится соответствующий компонент:

```
'landing'       → LandingPage
'home'          → VacancyList (для seeker) / SeekerList (для employer)
'login'         → AuthForm (isRegister=false)
'register'      → AuthForm (isRegister=true)
'vacancy-details' → VacancyDetails
'create-vacancy'  → CreateVacancyForm
'edit-vacancy'    → EditVacancyForm
'messages'        → MessagesPage
'favorites'       → FavoritesList
'resume'          → ResumeForm
'my-vacancies'    → VacancyList (отфильтрованные)
'applications'    → ApplicationsList
'seeker-applications' → SeekerApplications
'edit-profile'    → EditProfileForm
'admin-panel'     → AdminPanel
'employer-dashboard' → EmployerDashboard
'help'            → HelpPage
```

### 2.4 Интернационализация (i18n)

Система переводов реализована через React Context (`I18nProvider` + хук `useT`). Словарь (`DICT`) содержит два языка:
- **ru** — русский (~600 ключей)
- **kk** — казахский (~600 ключей)

Переключение языка сохраняется в `localStorage`. Функция `t(key, vars)` поддерживает подстановку переменных через `{varname}`.

### 2.5 Система уведомлений (Toast)

Реализована через `ToastProvider` (React Context) + портал для рендера. Поддерживает три типа: `success`, `error`, `info`. Автоматически скрывается через 3.5 секунды. Анимация появления/исчезания через CSS transitions.

### 2.6 Тёмная тема

Реализована через Tailwind `darkMode: 'class'`. Переключение добавляет/убирает класс `dark` на `<html>` через `document.documentElement.classList`. Состояние темы хранится в `localStorage.theme`.

### 2.7 Фильтрация и поиск

Для вакансий реализована полноценная фильтрация:
- Поиск по названию должности
- Поиск по работодателю
- Фильтр по зарплате (от / до)
- Поиск по навыкам в описании
- Фильтр «только с изображением»
- Сортировка (по дате, зарплате, алфавиту)
- Период публикации (за всё время / месяц / неделю / 3 дня)

Дебаунс поиска — через кастомный хук `useDebounce(value, 250ms)`.

---

## 3. Бэкенд (Vanilla PHP + PDO + MySQL)

### 3.1 Стек технологий

| Технология | Назначение |
|---|---|
| **PHP 8.x** | Язык серверной логики |
| **PDO (PHP Data Objects)** | Абстракция для работы с БД (защита от SQL-инъекций через prepared statements) |
| **MySQL 8** | Реляционная база данных |
| **OSPanel** | Локальный сервер (Apache + PHP + MySQL) |
| **cURL** | HTTP-клиент для прокси в Google Gemini API |

### 3.2 Структура API (api/)

```
api/
├── _secrets.php       — API-ключ Google Gemini (в .gitignore)
├── db.php             — подключение к БД, CORS, авто-миграции
├── admin.php          — CRUD для админ-панели (статистика, пользователи,
│                        баны, вакансии, диалоги)
├── ai.php             — прокси к Google Gemini API
├── applications.php   — управление откликами (GET / POST / PATCH)
├── auth.php           — регистрация и аутентификация (POST)
├── favorites.php      — избранное (GET / POST / DELETE)
├── help.php           — статьи помощи (GET)
├── messages.php       — чаты и сообщения (GET / POST)
├── profile.php        — обновление профиля пользователя (POST)
├── resumes.php        — резюме соискателей (GET / POST, UPSERT)
├── seekers.php        — каталог соискателей (GET)
├── upload.php         — загрузка файлов с ресайзом (POST)
└── vacancies.php      — CRUD вакансий (GET / POST / PUT / DELETE)
```

### 3.3 Принцип работы API

Каждый PHP-файл работает как отдельный REST-endpoint. HTTP-метод определяет действие:

- Методы: `GET`, `POST`, `PUT`, `PATCH`, `DELETE` (стандартные REST-методы)
- Формат данных: JSON (заголовок `Content-Type: application/json`)
- Аутентификация: простая (проверка `user_id` в параметрах запроса, без JWT)

**CORS** настроен глобально в `db.php` (заголовки `Access-Control-Allow-Origin: *`). `OPTIONS`-запросы (preflight) обрабатываются каждым файлом — возвращается `200 OK`.

**Безопасность:**
- Пароли хешируются через `password_hash()` (bcrypt)
- SQL-инъекции предотвращены через prepared statements (PDO)
- Роли администратора проверяются сервером в `admin.php`
- При регистрации роль `admin` принудительно заменяется на `seeker`

### 3.4 База данных (MySQL)

**Имя БД:** `jobsearch` (utf8mb4)

**Таблицы:**

| Таблица | Назначение | Ключевые поля |
|---|---|---|
| **users** | Пользователи системы (409 записей) | id, name, email, password (hash), role (enum: seeker/employer/admin), avatar, banned_until |
| **vacancies** | Вакансии (299 записей) | id, employer_id (FK→users), title, salary, description, image, city, created_at |
| **applications** | Отклики на вакансии (932 записи) | id, vacancy_id (FK→vacancies), seeker_id (FK→users), status (enum: pending/accepted/rejected), created_at |
| **resumes** | Резюме соискателей (322 записи) | id, user_id (FK→users, UNIQUE), surname, first_name, patronymic, gender, city, phone, birthday, citizenship, work_permit, profession, skills, education_* |
| **favorites** | Избранные вакансии (655 записей) | id, user_id (FK→users), vacancy_id (FK→vacancies), UNIQUE(user_id, vacancy_id) |
| **conversations** | Диалоги (12 записей) | id, seeker_id (FK→users), employer_id (FK→users), vacancy_id (nullable FK→vacancies), seeker_last_read_at, employer_last_read_at |
| **messages** | Сообщения в диалогах | id, conversation_id (FK→conversations), sender_id (FK→users), body, type (enum: text/system), created_at |
| **help_articles** | Статьи помощи | id, title, content, created_at |

**Связи:**
- `users 1→N vacancies` (работодатель создаёт вакансии)
- `users 1→1 resumes` (у соискателя одно резюме)
- `users N→M vacancies` через `applications` (отклики)
- `users N→M vacancies` через `favorites` (избранное)
- `seeker 1→1 employer` через `conversations` (уникальная пара)
- `conversations 1→N messages` (сообщения в диалоге)

### 3.5 Авто-миграции

В файлах `db.php`, `messages.php`, `admin.php` используется техника auto-migration: PHP пытается выполнить `ALTER TABLE`, и если колонка уже существует — игнорирует ошибку через `try/catch`. Это позволяет не запускать миграции вручную.

Пример в `db.php`:
- Добавление колонки `city` в `vacancies`
- Добавление колонки `avatar` в `users`
- Расширение `avatar` до 500 символов

---

## 4. Взаимодействие фронтенда и бэкенда

### 4.1 Протокол

SPA общается с PHP-бэкендом **исключительно через HTTP-запросы с JSON-телом**. Никакого server-side rendering, шаблонизации или WebSockets.

Базовый URL: `const API_URL = 'http://jobsearch/api'`

### 4.2 Типичный lifecycle одной операции (на примере отклика на вакансию)

```
1. Пользователь (соискатель) нажимает «Откликнуться»
2. VacancyDetails.jsx:
   fetch(`${API_URL}/applications.php`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ vacancy_id, seeker_id })
   })
3. applications.php (POST):
   - Проверяет, нет ли уже отклика (SELECT ... WHERE vacancy_id AND seeker_id)
   - Если есть → 409 Conflict
   - Если нет → INSERT INTO applications
4. Ответ: 200 OK / 409 Conflict
5. Фронтенд показывает toast: «Вы успешно откликнулись!»
```

### 4.3 Аутентификация (как работает вход)

1. Пользователь вводит email + пароль в `AuthForm.jsx`
2. `POST http://jobsearch/api/auth.php`
3. `auth.php`:
   - Ищет пользователя по email (`SELECT * FROM users WHERE email = ?`)
   - Проверяет пароль через `password_verify()`
   - Проверяет бан (`banned_until > NOW()`)
   - Возвращает JSON с объектом пользователя (без пароля)
4. Фронтенд сохраняет объект в `localStorage` (ключ `jobsearch_user`) и в `setUser()`
5. При последующих заходах пользователь восстанавливается из `localStorage`

**Важно:** JWT-токены не используются. Аутентификация сессионная через localStorage. Это упрощение для курсовой работы.

### 4.4 Работа с файлами (upload.php)

1. Фронтенд отправляет `multipart/form-data` с файлом + параметрами (`kind`, `user_id`)
2. `upload.php`:
   - Валидирует MIME-тип через `finfo` (только JPG, PNG, WEBP)
   - Генерирует уникальное имя (`timestamp + random_bytes`)
   - Ресайзит изображение через GD:
     - Аватар: квадрат 512×512 (crop по центру)
     - Картинка вакансии: ширина ≤ 1600 px (пропорционально)
   - При замене аватара удаляет старый файл
   - Возвращает публичный URL
3. Фронтенд подставляет URL в форму

### 4.5 Чаты (messages.php)

Система сообщений реализована через две таблицы: `conversations` (диалоги) и `messages` (сообщения).

Архитектура чатов:
- Каждый диалог — уникальная пара (seeker_id, employer_id)
- При первом сообщении диалог создаётся автоматически (`findOrCreateConversation`)
- Непрочитанные сообщения считаются через `*_last_read_at` для каждого участника
- Типы сообщений: `text` (обычное), `system` (уведомление о статусе отклика)
- Счётчик непрочитанных обновляется каждые 30 секунд (`setInterval(refreshUnread, 30000)`)

### 4.6 ИИ-помощник (ai.php + AIChatWidget)

**Прокси-архитектура:**
1. Пользователь пишет вопрос в виджете
2. `AIChatWidget.jsx` отправляет POST на `http://jobsearch/api/ai.php`
3. `ai.php`:
   - Формирует system prompt с описанием сайта и роли пользователя
   - Преобразует историю в формат Gemini API
   - Отправляет POST в Google Gemini API (gemini-2.5-flash, температуру 0.7)
   - Возвращает ответ
4. API-ключ защищён — хранится в `_secrets.php`, не доступен фронтенду

**Особенности:**
- Ответы на двух языках (ru/kk) в зависимости от настроек интерфейса
- Системный промпт учитывает роль пользователя (seeker / employer / admin)
- История чата хранится в `localStorage` (ключ `jobsearch_ai_chat`)
- Лимит: передаются последние 20 сообщений

### 4.7 Админ-панель (admin.php + AdminPanel.jsx)

Четыре вкладки:
1. **Статистика** — общие цифры, распределение по ролям, статусы откликов, топ городов, топ работодателей
2. **Пользователи** — список, создание админов, баны (1 день / 1 неделя / 1 месяц / навсегда), удаление
3. **Вакансии** — просмотр и удаление, переход к редактированию
4. **Диалоги** — просмотр всех чатов пользователей с возможностью удаления

Проверка прав (`admin_id`): каждый запрос к `admin.php` содержит `admin_id`, сервер проверяет роль в БД.

---

## 5. Схема данных (ERD)

```
┌─────────┐     ┌──────────────┐     ┌──────────────┐
│  users  │1──N│  vacancies   │1──N│ applications │
│         │     │              │     │              │
│  PK id  │     │  PK id       │     │  PK id       │
│  name   │     │  employer_id─┘     │  vacancy_id──┘
│  email  │     │  title             │  seeker_id──┐
│  role   │     │  salary            │  status     │
│  avatar │     │  description       │  created_at │
│ banned_ │     │  city              └──────────────┘
│  until  │     │  image                         │
└────┬────┘     │  created_at                    │
     │          └────────────────┘               │
     │                                           │
     │  ┌──────────────┐     ┌──────────────┐    │
     │  │   resumes    │     │  favorites   │    │
     │  │              │     │              │    │
     └──│  PK id       │     │  PK id       │    │
        │  user_id (u) │     │  user_id─────┘    │
        │  surname     │     │  vacancy_id──┐    │
        │  first_name  │     └──────────────┘    │
        │  gender      │                         │
        │  city        │     ┌──────────────────┐ │
        │  profession  │     │  conversations   │ │
        │  skills      │     │                  │ │
        │  education_* │     │  PK id           │ │
        └──────────────┘     │  seeker_id───────┼─┘
                             │  employer_id─────┘
        ┌──────────────┐     │  vacancy_id──┐
        │   messages   │     │  seeker_     │
        │              │     │  last_read_at│
        │  PK id       │     │  employer_   │
        │  conv_id─────┼──┐  │  last_read_at│
        │  sender_id───┼──┼──┘  created_at  │
        │  body        │  │   updated_at   │
        │  type        │  └────────────────┘
        │  created_at  │
        └──────────────┘

        ┌──────────────┐
        │help_articles │
        │  PK id       │
        │  title       │
        │  content     │
        │  created_at  │
        └──────────────┘
```

---

## 6. Ключевые сценарии использования

### 6.1 Соискатель
1. Регистрируется как seeker
2. Просматривает вакансии на главной (с фильтрацией по городу, зарплате, периоду)
3. Открывает детальную страницу вакансии
4. Откликается (1 клик) → отклик появляется в «Мои отклики»
5. Добавляет вакансии в избранное
6. Заполняет резюме
7. Общается с работодателями через встроенный чат
8. Получает уведомления о статусе отклика (принят / отклонён)

### 6.2 Работодатель
1. Регистрируется как employer
2. Создаёт вакансии (название, описание, зарплата, город, изображение)
3. Просматривает каталог соискателей с фильтрацией (образование, пол, навыки)
4. Получает отклики от соискателей, меняет статус (принять / отклонить)
5. Пишет кандидатам через чат
6. Видит дашборд со сводкой

### 6.3 Администратор
1. Входит как admin (создаётся через админку)
2. Смотрит статистику (пользователи, вакансии, отклики, чаты, топы)
3. Управляет пользователями (бан, удаление, добавление админов)
4. Управляет вакансиями (редактирование, удаление)
5. Управляет диалогами (просмотр, удаление)

---

## 7. Инфраструктура

| Компонент | Технология |
|---|---|
| Dev-сервер | Vite (port 3000) |
| Сборка | `vite build` → `dist/` |
| Веб-сервер PHP | OSPanel (Apache) |
| База данных | MySQL 8 (OSPanel) |
| Git-репозиторий | GitHub (`beka177/jobhunter-frontend`) |
| ИИ-модуль | Google Gemini 2.5 Flash |
| Операционная система | Windows (разработка велась под Windows) |
