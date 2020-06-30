import {Cell} from './Cell'
import {game} from '../services/Game';
import { getRandomElement } from '../utils/utils'
import Point from './Point';
import { BorderCell } from './BorderCell';

export class Inker {
    
    color: string;
    cells: Map<number, Cell> = new Map();    
    growingCells: Map<number, Cell> = new Map();
    borderCells: Map<number, BorderCell> = new Map(); 

    constructor(color: string) {
        this.color = color
    }

    addCell(cell: Cell) {
        const newCellHash = this.getCellHash(cell);
        this.cells.set(newCellHash, cell)
        this.borderCells.delete(newCellHash);
        for (let xd = -1; xd < 2; xd++) {
            for (let yd = -1; yd < 2; yd++) {
                if (xd === 0 || yd === 0) {
                    if (xd !== 0 || yd !== 0) {
                        const cellGhost = new BorderCell(cell.x + xd, cell.y + yd, 1);
                        const cellHash = this.getCellHash(cellGhost)
                        if (!this.cells.has(cellHash)) {
                            if (this.borderCells.has(cellHash)) {
                                this.borderCells.get(cellHash).neighborhood+=1
                            } else {
                                this.borderCells.set(cellHash, cellGhost);
                            }
                        }
                    }
                }
            }
        }
        cell.owner = this;
        game.borderCells = Array.from(this.borderCells.values());//REMOVE THIS
    }

    expandTo(x: number, y: number) {
        if (this.growingCells.size > 1) {//FIX
            return;
        }

        let cells = Array.from(this.borderCells.values()).sort((c1, c2) => {
            if (c1.neighborhood === c2.neighborhood) {
                const score1 = Math.abs(x - c1.x) + Math.abs(y - c1.y)
                const score2 = Math.abs(x - c2.x) + Math.abs(y - c2.y)
                return score1 - score2;
            } else {
                return c2.neighborhood - c1.neighborhood
            }
        });

        const originSize = cells.length;
        cells = cells.slice(0, Math.floor(cells.length / 4));
        const targetCells = getRandomElement(cells, Math.ceil(originSize * 0.2));
        for (const targetCell of targetCells) {
            const realCell = game.field[targetCell.y][targetCell.x];
            this.addCell(realCell)
            this.growingCells.set(this.getCellHash(realCell), realCell)
        }

    }

    grow() {
        const growingCells = Array.from(this.growingCells.values())
        for (let i = 0; i < growingCells.length; i++) {
            const growingcell = growingCells[i];
            growingcell.growing += 0.1;
            if (growingcell.growing >= 1) {
                this.growingCells.delete(this.getCellHash(growingcell));
            }
        }
        
    }

    getCellHash(cell: Point): number {
        return cell.x * 10000 + cell.y;
    }


}