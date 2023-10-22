
let root = document.documentElement;

export function setPrimary(color) {
    root.style.setProperty("--primary-color", color);
}

export function setSecondary(color) {
    root.style.setProperty("--secondary-color", color);
}

export function setAccent(color) {
    root.style.setProperty("--accent-color", color);
}