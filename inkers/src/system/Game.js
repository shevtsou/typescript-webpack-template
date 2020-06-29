import attachOnClick from '../hidden/attachMouseHandler'
import Piece from '../models/Piece'
import Inker from '../models/Inker'
import Marker from './Marker'
import Cell from '../models/Cell'

const CELL_CIRCLE_SIZE = 25;
const CELL_FREE_SIZE = 40;

class Game {

    
    /**
     * @type {Array<Array<Cell>>}
     */
    field = []

    /** @type {Array<Marker>} */
    markers = []
 
    /** @type {Array<Inker>} */
    INKERS = []

    /** @type {HTMLCanvasElement} */
    canvas
    /** @type {CanvasRenderingContext2D} */
    context

    /** @type {ImageData} */
    canvasData

    constructor() {
        for (let y = 0; y < 30; y++) {
            const row = []
            for (let x = 0; x < 30; x++) {
                row.push(new Cell(x, y, y % 2 === 0));
            }
            this.field.push(row)
        }

        //@ts-ignore
        this.canvas = document.getElementById("myCanvas");
        //@ts-ignore
        this.context = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.canvasData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        setInterval(this.updateGameArea, 50);
    }

    /**
     * 
     * @param {number} mouseX 
     * @param {number} mouseY 
     * @returns {{x: number, y: number}}
     */
    mapToCellCoordinates(mouseX, mouseY) {
        return {
            x: Math.floor(mouseX / CELL_FREE_SIZE),
            y: Math.floor(mouseY / CELL_FREE_SIZE)
        }
    }
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    getCell(x, y) {
        return this.field[y][x]
    }

    /** @param {Inker} inker */
    addInker = (inker) => {
        this.INKERS.push(inker)
    }
    
    /**
     * @param {number} x
     * @param {number} y
     * @param {string} color
     */
    addMarker = (x, y, color) => {
        this.markers.push(new Marker(x, y, color))
    }

    clearMarkers = () => {
        this.markers.length = 0;
    }

    updateGameArea = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.field.forEach(r=> r.forEach(c=> {
                if (c.owner !== undefined) {
                    if (c.shifted) {
                        this.drawCircle(c.x * CELL_FREE_SIZE + CELL_FREE_SIZE / 2, c.y * CELL_FREE_SIZE, Math.floor(CELL_CIRCLE_SIZE * c.growing), c.owner.color)
                    } else {
                        this.drawCircle(c.x * CELL_FREE_SIZE, c.y * CELL_FREE_SIZE, Math.floor(CELL_CIRCLE_SIZE * c.growing), c.owner.color)
                    }
                }
        }))

        this.INKERS.forEach(i=> {
            i.grow()
        })


        if (this.borderCells) {//REMOVE
            this.borderCells.forEach(c => {
                if (y % 2 === 0) {
                    this.drawCircle(c.x * CELL_FREE_SIZE + CELL_FREE_SIZE / 2, c.y * CELL_FREE_SIZE, CELL_CIRCLE_SIZE, "#f00")
                    this.context.fillText(c.neightborhood ? c.neightborhood : "-", c.x * CELL_FREE_SIZE + CELL_FREE_SIZE / 2, c.y * CELL_FREE_SIZE);
                } else {
                    this.drawCircle(c.x * CELL_FREE_SIZE, c.y * CELL_FREE_SIZE, CELL_CIRCLE_SIZE, "#f00")
                    this.context.fillText(c.neightborhood ? c.neightborhood : "-", c.x * CELL_FREE_SIZE, c.y * CELL_FREE_SIZE);
                }
            })
        }
    
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
        this.context.fillStyle = color;
        this.context.fill();
        // this.context.strokeStyle = color;
        // this.context.stroke();
    }

    drawRectangle = (x0, y0, x1, y1, color = "#f00") => {
        this.context.beginPath();
        this.strokeStyle = color;
        this.context.rect(x0,y0, 1, 1);
        this.context.stroke();
    }
    
    drawPixel = (x, y, r, g, b) => {
        console.log('drawing')
        var index = (x + y * this.canvas.width) * 4;

        this.canvasData.data[index + 0] = r;
        this.canvasData.data[index + 1] = g;
        this.canvasData.data[index + 2] = b;
        this.canvasData.data[index + 3] = 255;
    }
}


export default Game;