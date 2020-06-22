import Piece from './Piece'

class Inker {
    /** @type {string} color */
    color
    /** @type {number} x */
    x
    /** @type {number} y */
    y

    /** @type {Array<Piece>} */
    pieces = []    

    constructor(color, x, y) {
        this.color = color
        this.x = x;
        this.y = y;
        this.pieces.push(new Piece(color, x, y, 50))

    }
}

export default Inker