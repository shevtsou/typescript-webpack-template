import { Inker } from './Inker'


export class Cell {
    owner: Inker
    x: number
    y: number
    neighborhood:number = 0;
    shifted: boolean
    growing: number = 0.5

    constructor(x: number, y: number, shifted: boolean) {
        this.x = x;
        this.y = y;
        this.shifted = shifted
    }

}