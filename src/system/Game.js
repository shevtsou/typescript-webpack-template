import attachOnClick from '../hidden/attachMouseHandler'
import Piece from '../models/Piece'
import Inker from '../models/Inker'


class Game {

    /** @type {Array<Inker>} */
    INKERS = []

    /** @type {HTMLCanvasElement} */
    canvas
    /** @type {CanvasRenderingContext2D} */
    context

    constructor() {
        //@ts-ignore
        this.canvas = document.getElementById("myCanvas");
        //@ts-ignore
        this.context = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        setInterval(this.updateGameArea, 20);
    }

    /** @param {Inker} inker */
    addInker = (inker) => {
        this.INKERS.push(inker)
    }
    
    updateGameArea = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        /** @type {Piece[]} */
        const pieces = this.INKERS.reduce((array, inker) => {
            inker.pieces.forEach(p => {
                array.push(p)
            })
            return array;
        }, []);
        pieces.forEach(c => {
            this.drawCircle(c.x, c.y, c.size, c.color);
        })
    }
    
    /**
     * @param {number} centerX
     * @param {number} centerY
     * @param {number} radius
     * @param {string} color
     */
    drawCircle = (centerX, centerY, radius, color) => {
        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        // context.fillStyle = color;
        // context.fill();
        this.context.strokeStyle = color;
        this.context.stroke();
    }
    
}


export default Game;