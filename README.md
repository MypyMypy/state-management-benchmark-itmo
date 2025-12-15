# State Management Benchmark

## Цель
Экспериментальная оценка производительности и прикладной пригодности клиентских методов управления состоянием в React-приложениях: Redux Toolkit, MobX, Effector.

## Стек
Vite, React 18, React Router, TypeScript, CSS Modules, Feature-Sliced подход к структуре, React Profiler, Web Vitals, why-did-you-render, Performance API (User Timing), source-map-explorer.

## Сценарии
1. S1: Каталог (1k–50k) с фильтрацией, сортировкой, пагинацией, инкрементальными апдейтами.
2. S2: Форма с локальной и глобальной валидацией (дебаунс).
3. S3: Реал-тайм поток (10–60 обновлений/с).

## Запуск
```bash
npm install
npm run dev
```
Откройте http://localhost:5173

## Сборка и анализ бандла
```bash
npm run analyze
```
Просмотр метрик в консоли (web vitals + user timing). Используйте вкладку Performance DevTools + React Profiler.

## Измерения
- Web Vitals выводятся в консоль.
- Performance API метки: `redux:updates`, `mobx:updates`, `effector:updates`, потоки `*:stream`.
- React Profiler: автоматическое измерение рендера `App`.
- why-did-you-render: отслеживание лишних рендеров в dev.

## Варьирование нагрузки
- Изменяйте размер каталога в генераторах (по умолчанию 10k) для стресс-теста.
- Настройка частоты обновлений в потоке (поле Rate).

## Дальнейшие шаги
- Добавить сбор аггрегированных метрик и экспорт (CSV).
- Реализовать переключение размера каталога через UI.
- Добавить сценарий конкурентных форм.
