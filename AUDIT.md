# AUDIT — JobSearch

Аудит дипломного проекта JobSearch. Фокус: **UX / интерфейс** и **код / архитектура**. Безопасность вынесена в раздел "C" одним списком — туда заглядываем перед защитой, если останется время.

Легенда приоритетов:
- 🔴 **Перед защитой** — заметно глазом или ломает функционал; чинится быстро, сильно влияет на впечатление комиссии.
- 🟡 **Желательно** — улучшит код / UX, защиту не сломает.
- 🟢 **На будущее** — большой рефакторинг, делать после диплома.

---

## TL;DR

1. 🔴 **Кнопка "Разбанить пользователя" в админке не работает** — отправляет `id: null` (баг в [AdminPanel.jsx:280](src/components/AdminPanel.jsx#L280)).
2. 🔴 **`SeekerList` игнорирует `bannedUntil` и не имеет действия для админа** — но это нормально, потому что это компонент для работодателя. А вот в админке нет страницы поиска вакансий, скажешь то же самое о фильтрах.
3. 🔴 **Поиск/фильтры дёргают `filter()` на каждое нажатие клавиши** — без дебаунса работает быстро на 30 вакансиях, но в защите комиссия обязательно спросит.
4. 🔴 **Tailwind подключён через CDN** — это режим разработки. На защите сразу видно по консоли браузера ("cdn.tailwindcss.com should not be used in production"). Надо переключить на нормальную сборку.
5. 🟡 **Файл `App.jsx` — 394 строки, держит ВЕСЬ стейт приложения**. На защите спросят про архитектуру — стоит разбить.
6. 🟡 **Куча дублирования** — список городов в двух местах, копипаст `fetch`-ов в каждом компоненте, нет единого API-слоя.

---

## A. UX / Интерфейс

### A1. Уведомления через `alert()` 🔴
**Где:** [App.jsx:188,192](src/App.jsx#L188), [VacancyList.jsx:92,101,104,106](src/components/VacancyList.jsx#L92), [AdminPanel.jsx:51,54,66,69,82,99,102,105](src/components/AdminPanel.jsx#L51), [ResumeForm.jsx:56,59,62](src/components/ResumeForm.jsx#L56), [AuthForm.jsx:39](src/components/AuthForm.jsx#L39).

Везде используется встроенный браузерный `alert('Ошибка сети')`. Выглядит как сайт из 2005 года.

**Как исправить:** добавить простую систему тостов (toast-уведомлений). Можно либо взять библиотеку `react-hot-toast` (одна строка установки), либо написать свой простой компонент с порталом — это +50 строк и сильно бустит впечатление при защите.

### A2. На большинстве кнопок нет состояния загрузки 🔴
**Где:** кнопка "Откликнуться" в [VacancyList.jsx:270](src/components/VacancyList.jsx#L270), кнопки в админке — например ban-кнопки в [AdminPanel.jsx:284-289](src/components/AdminPanel.jsx#L284), кнопка удаления вакансии.

При медленном интернете пользователь жмёт несколько раз → отправляется несколько одинаковых запросов. Хорошо, что на бэке есть защита от дублей откликов (`409 Conflict`), но визуально юзер не понимает, что произошло.

**Как исправить:** на каждую кнопку, которая делает запрос, добавить локальный стейт `isSubmitting` и `disabled={isSubmitting}` со спиннером. AuthForm уже делает это правильно — см. [AuthForm.jsx:118](src/components/AuthForm.jsx#L118) — можно скопировать паттерн.

### A3. Сломанная кнопка "Разбанить" в админ-панели 🔴
**Где:** [AdminPanel.jsx:280](src/components/AdminPanel.jsx#L280).

```jsx
onClick={() => handleBanUser('unban', u.id)}
```

Но функция объявлена как `handleBanUser = async (duration) => {...}` (один аргумент). Внутри она использует `banModal.userId`, который в этот момент равен `null` (модалка не открывалась). В итоге на бэк уходит `id: null` → ответ 400 → `alert('Ошибка блокировки')`.

**Как исправить:** в [AdminPanel.jsx:40](src/components/AdminPanel.jsx#L40) изменить сигнатуру на `handleBanUser = async (duration, userId = banModal.userId) => {...}` и использовать переданный `userId` в `body: JSON.stringify({ id: userId, duration })`. Заодно проверить, что бэк действительно сбрасывает `banned_until = NULL` при `duration === 'unban'` — сейчас в [admin.php:77-81](../../OSPanel/domains/jobsearch/api/admin.php) для 'unban' не предусмотрено явное условие, но `$banned_until` остаётся `null`, что корректно.

### A4. Поиск по вакансиям не дебаунсится 🟡
**Где:** [VacancyList.jsx:125,129,133](src/components/VacancyList.jsx#L125) и [SeekerList.jsx:32-37](src/components/SeekerList.jsx#L32).

На каждое нажатие клавиши пересчитывается `filter()` по всему массиву. На 30 элементах не тормозит — но если в защите запустят с тысячей вакансий, будет лагать. Простой `useDebounce` (10 строк) решает проблему и звучит как осмысленное архитектурное решение.

### A5. После сохранения резюме показывается `alert` и редиректит на главную 🟡
**Где:** [App.jsx:373](src/App.jsx#L373) — `onSuccess={() => alert('Резюме обновлено')}`.

Пользователь жмёт "Сохранить", видит alert, нажимает ОК — и тут же видит ту же форму, без визуальной обратной связи "сохранено". Лучше: показывать зелёный тост и оставлять пользователя на странице.

### A6. Доступ к фильтрам/действиям по hover, а не по клику 🟡
**Где:** [VacancyList.jsx:240](src/components/VacancyList.jsx#L240) — `opacity-0 group-hover:opacity-100`.

Кнопки "Редактировать" и "Удалить" на карточке вакансии работодателя появляются только при наведении мыши. На мобильных устройствах ховера нет — кнопки **не видны вообще**. Это блокирующая UX-проблема для мобильного.

**Как исправить:** на мобильных всегда показывать (`opacity-100 lg:opacity-0 lg:group-hover:opacity-100`).

### A7. На карточке вакансии нет пометки об избранном на странице "Мои вакансии" 🟡
В [App.jsx:301](src/App.jsx#L301) при показе `my-vacancies` пропсы `favorites` и `onToggleFavorite` не передаются. Это и правильно (работодатель), но в коде [VacancyList.jsx:6](src/components/VacancyList.jsx#L6) `favorites = []` обрабатывается через дефолтный пропс — это работает, но неявно. Лучше явно — два разных компонента или явный пропс `showFavorites={false}`.

### A8. Опечатка в сортировке 🟡
**Где:** [VacancyList.jsx:20](src/components/VacancyList.jsx#L20) — `'По убыванию зарплат'` (без 'ы'). Должно быть "По убыванию зарплаты".

### A9. Тёмная тема не покрывает иконку в форме регистрации 🟡
**Где:** [AuthForm.jsx:80-85](src/components/AuthForm.jsx#L80). Блок ошибки `bg-red-50 border-red-400 text-red-700` — без `dark:` модификаторов. В тёмной теме читается плохо.

### A10. Двойная функция `setStats` на пустом ответе 🟢
**Где:** [AdminPanel.jsx:23-38](src/components/AdminPanel.jsx#L23). Если запрос упал, переменные не обновляются — UI остаётся в старом состоянии без явной ошибки.

### A11. Поле "Аватар" в форме регистрации просит ссылку, а не файл 🟢
**Где:** [AuthForm.jsx:97](src/components/AuthForm.jsx#L97). Обычный пользователь не знает, что такое "ссылка на фото". Либо убрать поле из регистрации (предлагать позже в профиле), либо реализовать настоящую загрузку файла (это уже большая фича).

---

## B. Код и архитектура

### B1. Tailwind через CDN 🔴
**Где:** [index.html:8](index.html#L8).

```html
<script src="https://cdn.tailwindcss.com"></script>
```

Это режим **разработки**. В консоли браузера на проде Tailwind будет писать предупреждение, видимое всем (включая комиссию). Также `index.html` содержит подозрительный блок `<script type="importmap">` с CDN-ссылками на `react@19` и `vite@7` — это, судя по всему, артефакт от AI Studio, не используется (Vite собирает из `package.json`, где React 18). Эти `importmap`-ссылки лучше удалить, чтобы не путать.

**Как исправить:**
1. Удалить блок `importmap` из `index.html`.
2. Установить Tailwind как npm-зависимость: `npm install -D tailwindcss postcss autoprefixer`, выполнить `npx tailwindcss init -p`, настроить `tailwind.config.js` и `src/index.css` по официальному гайду.
3. Удалить `<script src="https://cdn.tailwindcss.com">`.

### B2. `App.jsx` — 394 строки, держит весь стейт приложения 🟡
**Где:** [App.jsx](src/App.jsx).

`App.jsx` отвечает за: роутинг (state-based), хранение `user`, `vacancies`, `seekers`, `favorites`, `globalCity`, `loadingVacancies`, `loadingSeekers`, `seekersError`, `isConnected`, `connectionError`, fetch-логику, переключение страниц, рендер всех условных блоков. Это **god-object** компонент.

**Как исправить (минимальный шаг для защиты):**
- Вынести `user` в `AuthContext` (React Context API, ~40 строк).
- Вынести `globalCity` в отдельный `useState` хук + Context.
- Вынести fetch-логику в файл `src/api/index.js` (см. B4).
- Логику фильтрации `vacancies` для my-vacancies / favorites можно держать там же, где она используется.

После этого `App.jsx` усохнет до ~150 строк и станет читаемым.

### B3. Список городов продублирован 🟡
**Где:** [Navbar.jsx:6](src/components/Navbar.jsx#L6) и наверняка ещё раз в `LandingPage.jsx`.

```js
const CITIES = ['Астана', 'Алматы', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар', 'Оскемен', 'Семей', 'Все города'];
```

**Как исправить:** перенести в [src/constants.js](src/constants.js) и импортировать оттуда.

### B4. Голый `fetch()` размазан по всем компонентам 🟡
**Где:** везде — [App.jsx:41,76,119,140,190](src/App.jsx), [VacancyList.jsx:96](src/components/VacancyList.jsx), [AdminPanel.jsx:26,42,61,76,90](src/components/AdminPanel.jsx), [AuthForm.jsx:29](src/components/AuthForm.jsx), [ResumeForm.jsx:21,46](src/components/ResumeForm.jsx).

Каждый компонент сам формирует URL, ставит headers, парсит ошибки. Если API URL изменится — нужно править в 10 местах. Если захочется добавить токен авторизации — в 10 местах.

**Как исправить:** создать `src/api/client.js` с функциями:
```js
export const api = {
  vacancies: {
    list: () => http.get('/vacancies.php'),
    get: (id) => http.get(`/vacancies.php?id=${id}`),
    create: (data) => http.post('/vacancies.php', data),
    delete: (id) => http.delete(`/vacancies.php?id=${id}`),
  },
  admin: { ... },
  auth: { ... },
};
```

Внутри — единый `http()` обработчик с общей логикой ошибок. На защите это смотрится как осознанная архитектура.

### B5. Нет кастомных хуков 🟡
Кандидаты на выделение:
- `useAuth()` — текущий пользователь, `login`, `logout`, `isAuthenticated`.
- `useVacancies()` — список вакансий + `refetch`.
- `useFavorites(userId)` — список + `toggle`.
- `useDarkMode()` — переключение темы (логика из [Navbar.jsx:12-32](src/components/Navbar.jsx#L12) сейчас прямо в компоненте; если темы будут переключаться из других мест — она поломается).

### B6. `VacancyList.jsx` — 297 строк 🟡
**Где:** [VacancyList.jsx](src/components/VacancyList.jsx).

В одном файле: фильтры, сортировка, выпадающие меню сортировки/периода с порталами, рендер карточек, действия employer (edit/delete), действие seeker (favorite, quick apply). Можно разбить на:
- `VacancyFilters.jsx` — боковая панель.
- `VacancySortBar.jsx` — верхняя панель сортировки.
- `VacancyCard.jsx` — одна карточка.

### B7. Бэкенд: один файл = один эндпоинт, без общего bootstrap 🟡
**Где:** [c:\OSPanel\domains\jobsearch\api\](../../OSPanel/domains/jobsearch/api/).

В каждом `.php`-файле:
```php
require_once 'db.php';
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') { http_response_code(200); exit; }
```

CORS-заголовки в `db.php` (хорошо), а вот OPTIONS-ответ дублируется в каждом эндпоинте. Также везде повторяется `json_decode(file_get_contents('php://input'), true)`.

**Как исправить:** вынести в `bootstrap.php`:
```php
require_once 'db.php';
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') { http_response_code(200); exit; }
function input() { return json_decode(file_get_contents('php://input'), true) ?? []; }
function respond($data, $code = 200) { http_response_code($code); echo json_encode($data); exit; }
```
И в каждом файле — `require_once 'bootstrap.php';`.

### B8. Бэкенд: автомиграции на каждый запрос 🟡
**Где:** [db.php:35-42](../../OSPanel/domains/jobsearch/api/db.php) и [admin.php:13-17](../../OSPanel/domains/jobsearch/api/admin.php).

На **каждый** входящий запрос PHP пробует `ALTER TABLE ... ADD COLUMN`, ловит ошибку дубликата и игнорирует. Это работает, но:
1. Это лишний запрос к БД на каждый http-запрос.
2. Скрывает реальные ошибки `ALTER TABLE`.
3. На защите выглядит костыльно.

**Как исправить:** один раз сделать миграцию через `phpMyAdmin` или отдельный `migrate.php`, потом удалить эти блоки.

### B9. Нет пагинации 🟡
**Где:** [vacancies.php:18](../../OSPanel/domains/jobsearch/api/vacancies.php#L18), [seekers.php](../../OSPanel/domains/jobsearch/api/seekers.php) (по обзору), [admin.php:96-100](../../OSPanel/domains/jobsearch/api/admin.php#L96).

`SELECT * FROM vacancies` без `LIMIT/OFFSET`. С сидом на 150 вакансий и 150 соискателей — это работает, но как только в БД появится 10000 записей — фронт скачает всё в память. Хотя бы `LIMIT 100` стоит поставить.

### B10. `package.json`: React 18 в зависимостях, React 19 в `importmap` 🟢
**Где:** [package.json:14](package.json#L14) и [index.html:18-21](index.html#L18).

`importmap` блок ссылается на `react@19`, а реально Vite собирает `react@18.2.0`. Не используется, но смущает. Удалить блок (см. B1).

### B11. `App.jsx` оставленные мёртвые комментарии 🟢
**Где:** [App.jsx:219-225](src/App.jsx#L219). Блок из 7 строк комментариев без кода. Просто удалить.

---

## C. Критичное вне фокуса (для справки)

Эти пункты выбивались за рамки выбранного фокуса аудита, но их стоит знать, потому что комиссия с большой вероятностью спросит:

1. **Авторизация на бэке через `admin_id` в query** ([admin.php:21](../../OSPanel/domains/jobsearch/api/admin.php#L21)). Любой пользователь, узнавший ID админа, может подделать запрос. Правильное решение — JWT-токен или серверная сессия. Если до защиты времени мало — хотя бы упомянуть в защитной речи как "запланированное улучшение, в дипломе сделано упрощённо".
2. **Создание вакансии не проверяет `employer_id`** ([vacancies.php:38](../../OSPanel/domains/jobsearch/api/vacancies.php#L38)). Любой может постить от чужого имени.
3. **Пароль БД пустой**, креды захардкожены в `db.php`. Для локальной OSPanel это норма, но для prod — нет. Вынести в `.env`.
4. **Сессия пользователя — это весь объект юзера в `localStorage`**. Если поменять там `role` на `admin` через DevTools — фронт начнёт показывать админку (бэк, к счастью, всё равно проверит роль через `admin.php:28-36`). Но впечатление портит.
5. **CORS открыт всем** (`Access-Control-Allow-Origin: *`). Для prod — закрыть на конкретный домен.

---

## Чек-лист "Перед защитой"

Минимальный сет, который сильно поднимает впечатление и чинится за один-два дня:

- [ ] Починить кнопку разбана в админке (A3).
- [ ] Заменить `alert()` на тосты (A1) — есть готовая библиотека `react-hot-toast`.
- [ ] Перевести Tailwind с CDN на сборку (B1) + удалить `importmap` блок.
- [ ] Добавить `disabled` + спиннер на кнопки с запросами (A2).
- [ ] Починить hover-only кнопки на мобильном (A6).
- [ ] Дебаунс поиска (A4).
- [ ] Вынести `CITIES` в `constants.js` (B3).
- [ ] Поправить опечатку "зарплат" → "зарплаты" (A8).
- [ ] Удалить мёртвые комментарии в App.jsx (B11).
- [ ] Отрепетировать ответ на вопрос "почему авторизация через admin_id?" (C1).

Если останется время:
- [ ] Вынести fetch'и в `src/api/` (B4).
- [ ] AuthContext + раздробить App.jsx (B2).
- [ ] Bootstrap.php на бэке (B7) и убрать автомиграции (B8).
