import { Cell } from '../models/Cell'
import { Inker } from '../models/Inker'
import Point from '../models/Point';
import { BorderCell } from '../models/BorderCell';

const CELL_CIRCLE_SIZE = 25;
const CELL_FREE_SIZE = CELL_CIRCLE_SIZE * 4/3;

class Game {

    field: Array<Array<Cell>> = []

    inkers: Inker[] = []

    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    borderCells: Array<BorderCell> = []

    constructor() {
        for (let y = 0; y < 30; y++) {
            const row = []
            for (let x = 0; x < 30; x++) {
                row.push(new Cell(x, y, y % 2 === 0));
            }
            this.field.push(row)
        }

        //@ts-ignore
        this.canvas = document.getElementById("mainCanvas");
        //@ts-ignore
        this.context = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        setInterval(this.updateGameArea, 50);
    }

    mapToCellCoordinates(mouseX: number, mouseY: number): Point {
        return {
            x: Math.floor(mouseX / CELL_FREE_SIZE),
            y: Math.floor(mouseY / CELL_FREE_SIZE)
        }
    }
    getCell(x: number, y: number): Cell {
        return this.field[y][x]
    }

    addInker = (inker: Inker) => {
        this.inkers.push(inker)
    }
    

    updateGameArea = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.field.forEach(r=> r.forEach(c=> {
                if (c.owner !== undefined) {
                    if (c.shifted && false) {
                        this.drawCircle(c.x * CELL_FREE_SIZE + CELL_FREE_SIZE / 2, c.y * CELL_FREE_SIZE, Math.floor(CELL_CIRCLE_SIZE * c.growing), c.owner.color)
                    } else {
                        this.drawCircle(c.x * CELL_FREE_SIZE, c.y * CELL_FREE_SIZE, Math.floor(CELL_CIRCLE_SIZE * c.growing), c.owner.color)
                        // this.context.fillText(`${c.x}+${c.y}`, c.x * CELL_FREE_SIZE, c.y * CELL_FREE_SIZE);

                    }
                }
        }))

        this.inkers.forEach(i=> {
            i.grow()
        })


        // if (this.borderCells) {//REMOVE
        //     this.borderCells.forEach(c => {
        //         if (c.y % 2 === 0 && false) {
        //             this.drawCircle(c.x * CELL_FREE_SIZE + CELL_FREE_SIZE / 2, c.y * CELL_FREE_SIZE, CELL_CIRCLE_SIZE, "#f00")
        //             this.context.fillText(c.neighborhood ? c.neighborhood.toString() : "-", c.x * CELL_FREE_SIZE + CELL_FREE_SIZE / 2, c.y * CELL_FREE_SIZE);
        //         } else {
        //             this.drawCircle(c.x * CELL_FREE_SIZE, c.y * CELL_FREE_SIZE, CELL_CIRCLE_SIZE, "#f00")
        //             this.context.fillText(c.neighborhood ? c.neighborhood.toString() : "-", c.x * CELL_FREE_SIZE, c.y * CELL_FREE_SIZE);
        //         }
        //     })
        // }
    
    }
    
    drawCircle = (centerX: number, centerY: number, radius: number, color: string) => {
        this.context.beginPath();
        this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = color;
        this.context.fill();
        //         this.context.strokeStyle = color;
        // this.context.stroke();
    }

    drawRectangle = (x0: number, y0: number, x1: number, y1: number, color: string = "#f00") => {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.rect(x0,y0, 1, 1);
        this.context.stroke();
    }
    
}

export const game = new Game()