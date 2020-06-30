import { Cell } from './Cell'

export class BorderCell extends Cell {
    neighborhood: number = 0;

    constructor(x: number, y: number, neighborhood: number) {
        super(x, y, false);
        this.neighborhood = neighborhood;
    }
}