class Piece {
    /** @type {string} color */
    color
    /** @type {number} x */
    x
    /** @type {number} y */
    y
    /** @type {number} size */
    size

    constructor(color, x, y, size) {
        this.color = color
        this.x = x;
        this.y = y;
        this.size = size;
    }

}
module.exports = Piece;