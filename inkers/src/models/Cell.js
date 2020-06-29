import Inker from './Inker'

class Cell {
    /** @type {Inker?} color */
    owner
    /** @type {number} x */
    x
    /** @type {number} y */
    y

    /** @type {number} */
    neighborhood = 0

    /** @type {boolean} */
    drawn
    
    /** @type {boolean} */
    shifted

    /** @type {number} */
    growing = 0.5

    constructor(x, y, shifted) {
        this.x = x;
        this.y = y;
        this.shifted = shifted
    }

}
export  default Cell;