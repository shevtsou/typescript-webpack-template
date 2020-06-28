/** 
 * @template O
 * @param {Array<O>} elements
 * @param {number} amount
 * @returns O
*/
function getRandomElement(elements, amount = 1) {
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