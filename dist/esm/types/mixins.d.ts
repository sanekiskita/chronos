import type { AnyFunc } from './interface/IFunction';
declare const mixins: {
    /**
     * Метод debounce
     * - Откладывает выполнение функции до тех пор, пока не пройдет `wait` миллисекунд  с момента последнего вызова.
     * - Последний ответ приходит всем функциям
     *
     * @param {Function} func - Функция для выполнения
     * @param {number} wait - Время задержки в миллисекундах
     * @param {boolean} onlyOne - Возвращает результат только для выполненной функции (При false всем)
     * @return {Function} Обёрнутая функция с debounce
     */
    debounce(func: AnyFunc, wait: number, onlyOne?: boolean): (...args: Parameters<AnyFunc>) => Promise<ReturnType<AnyFunc>>;
    /**
     * Метод onceAtATime - Выполнение функции только в одном экземпляре
     * @param {Function} func - Функция для выполнения
     * @param {any} rejectOnce - Ответ ошибки во время выполнения функции
     * @returns {Function} Обёрнутая функция с onceAtATime
     */
    onceAtATime(func: AnyFunc, rejectOnce?: any): (...args: Parameters<AnyFunc>) => Promise<ReturnType<AnyFunc>>;
    /**
     * Метод throttle
     * - Ограничивает количество вызовов функции до одного за указанный интервал времени.
     *
     * @param {Function} func - Целевая функция, которую нужно ограничить.
     * @param {number} limit - Интервал времени в миллисекундах, в течение которого функция может быть вызвана только один раз.
     * @returns {Function} Обёрнутая функция с throttling.
     */
    throttle(func: AnyFunc, limit: number): (...args: Parameters<AnyFunc>) => void;
};
export default mixins;
