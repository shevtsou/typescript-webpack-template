import Cell from './Cell'
import { getCircleIntercectPoints } from '../utils/MATH'
import Game from '../system/Game';

class Inker {
    /** @type {string} color */
    color
    /** @type {Map<number, Cell>} */
    cells = new Map();    

    /** @type {Map<number, Cell>} */
    growingCells = new Map();

    /** @type {Map<number, {x: number, y: number, neightborhood: number}>} */
    borderCells = new Map(); 

    constructor(color) {
        this.color = color
    }

    /** @param {Cell} cell */
    addCell(cell) {
        const newCellHash = this.getCellHash(cell);
        

        this.cells.set(newCellHash, cell)
        this.borderCells.delete(newCellHash);
        for (let xd = -1; xd < 2; xd++) {
            for (let yd = -1; yd < 2; yd++) {
                if (xd === 0 || yd === 0) {
                    if (xd !== 0 || yd !== 0) {
                        const cellGhost = {x: cell.x + xd, y: cell.y + yd, neightborhood: 0};
                        const cellHash = this.getCellHash(cellGhost)
                        if (!this.cells.has(cellHash)) {
                            if (this.borderCells.has(cellHash)) {
                                this.borderCells.get(cellHash).neightborhood+=1
                            } else {
                                this.borderCells.set(cellHash, cellGhost);
                            }
                        }
                    }
                }
            }
        }
        cell.owner = this;
        // GAME.borderCells = this.borderCells;//REMOVE THIS
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {Game} game
     */
    expandTo(x, y, game) {
        if (this.growingCells.size > 5) {//FIX
            return;
        }

        let cells = Array.from(this.borderCells.values()).sort((c1, c2) => {
            if (c1.neightborhood === c2.neightborhood) {
                const score1 = Math.abs(x - c1.x) + Math.abs(y - c1.y)
                const score2 = Math.abs(x - c2.x) + Math.abs(y - c2.y)
                return score1 - score2;
            } else {
                return c2.neightborhood - c1.neightborhood
            }
        });
        cells = cells.slice(0, Math.floor(cells.length / 3));
        const targetCells = getRandomElement(cells, 5);
        console.log(targetCells);
        for (const targetCell of targetCells) {
            const realCell = game.field[targetCell.y][targetCell.x];
            this.addCell(realCell)
            this.growingCells.set(this.getCellHash(realCell), realCell)
            console.log(this.growingCells)
        }

    }

    grow() {
        const growingCells = Array.from(this.growingCells.values)

        for (let i = 0; i < growingCells.length; i++) {
            const growingcell = growingCells[i];
            growingcell.growing += 0.1;
            if (growingcell.growing >= 1) {
                this.growingCells.delete(this.getCellHash(growingcell));
            }
        }
        
    }

    /**
     * @param {{x: number, y: number}} cell
     * @returns {number} hash
     */
    getCellHash(cell) {
        return cell.x * 10000 + cell.y;
    }


}

export default Inker