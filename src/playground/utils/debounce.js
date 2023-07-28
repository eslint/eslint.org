export default function debounce(callback, delay) {
    let timerId;

    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            callback(...args);
        }, delay);
    };
}
