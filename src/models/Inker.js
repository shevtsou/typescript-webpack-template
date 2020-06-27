import Piece from './Piece'
import { getCircleIntercectPoints } from '../utils/MATH'

class Inker {
    /** @type {string} color */
    color
    /** @type {number} x */
    x
    /** @type {number} y */
    y

    /** @type {Array<Piece>} */
    pieces = []    

    /** @type {boolean} */
    cached

    /** @type {Array<Piece>} */
    lastUpdatedPieces = []

    /** @type {Array<{x: number, y: number}>} */
    mergeBorderPoints = []

    constructor(color, x, y) {
        this.color = color
        this.x = x;
        this.y = y;
        this.pieces.push(new Piece(color, x, y, 50))
    }

    /**
     * @return {{x0: number, x1: number, y0: number, y1: number}}
     */
    getProportions() {
        const proportions = {
            x0: undefined,
            x1: undefined,
            y0: undefined,
            y1: undefined,
        }
        for (const piece of this.pieces) {
            if (proportions.x0 === undefined || proportions.x0 > piece.x - piece.size) {
                proportions.x0 = piece.x - piece.size;
            }
            if (proportions.x1 === undefined || proportions.x1 < piece.x + piece.size) {
                proportions.x1 = piece.x + piece.size;
            }
            if (proportions.y0 === undefined || proportions.y0 < piece.y + piece.size) {
                proportions.y0 = piece.y + piece.size;
            }
            if (proportions.y1 === undefined|| proportions.y1 > piece.y - piece.size) {
                proportions.y1 = piece.y - piece.size
            }
        }

        return proportions
    }

    /**
     * 
     * @param {Piece} piece 
     * @param {{x: number, y: number}} mergePoint
     */
    addPieceToMergePoint(piece, mergePoint) {
        this.mergeBorderPoints = this.mergeBorderPoints.splice(this.mergeBorderPoints.indexOf(mergePoint), 1)
        
    }

    /**
     * @return {Array<{x: number, y: number}>}
     */
    getBorderMergePoints() {
        const points = this._getMergePoints();

        if (!this.cached) {
            const borderpoints =  points.filter(p=> {
                for (const piece of this.pieces) {
                    const pointX = p.x - piece.x;
                    const pointY = p.y - piece.y
                    const hypotenuse = Math.sqrt(pointX * pointX + pointY * pointY)
                    if (hypotenuse + 0.1 < piece.size) {
                        return false;
                    }
                }
                return true;
            });
            borderpoints.forEach(mp => {
                this.mergeBorderPoints.push(mp)
            })
            return borderpoints
        }

    }

    /**
     * @return {Array<{x: number, y: number}>}
     */
   _getMergePoints() {
       const mergePoints = []
       for (let i0 = 0; i0 < this.pieces.length; i0++) {
           for (let i1 =  i0 + 1; i1 < this.pieces.length; i1++) {//to optimize
                const piece1 = this.pieces[i0];
                const piece2 = this.pieces[i1];
                getCircleIntercectPoints(piece1, piece2).forEach(p=> {
                    mergePoints.push(p)
                });
           }
       }
    return mergePoints;
   }

}

export default Inker