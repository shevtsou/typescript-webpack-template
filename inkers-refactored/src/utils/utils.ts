export function getRandomElement<T>(elements: Array<T>, amount = 1): T[] {
    const result = []

    let element = elements[Math.floor(Math.random() * elements.length)]
    result.push(element);
    let remaining = elements.filter(e=>e !== element);
    while (remaining.length > 0 && result.length < amount) {
        element = remaining[Math.floor(Math.random() * remaining.length)]
        result.push(element);
        remaining = elements.filter(e=>e !== element);
    }
    return result;
}