class Marker {
    /** @type {number} x */
    x
    /** @type {number} y */
    y
    /** @type {string} */
    color

    
    constructor(x, y, color = "#ff0000") {
        this.x = x;
        this.y = y;
        this.color = color
    }

}
module.exports = Marker;