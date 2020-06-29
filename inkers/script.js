
class Cell {
    /** @type {Inker?} color */
    owner
    /** @type {number} x */
    x
    /** @type {number} y */
    y

    /** @type {number} */
    neighborhood = 0

    /** @type {boolean} */
    drawn
    
    /** @type {boolean} */
    shifted

    /** @type {number} */
    growing = 0.5

    constructor(x, y, shifted) {
        this.x = x;
        this.y = y;
        this.shifted = shifted
    }

}


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



class Controller {

    points = []


    /**
     * 
     * @param {Inker} inker 
     */
    expand(inker) {
        const mergePoints = inker.getBorderMergePoints()
        const targetPoint = mergePoints[Math.floor(Math.random() * mergePoints.length)]
        inker.addPiece(new Piece("#000", targetPoint.x, targetPoint.y, 50))
        
        const mergePointsDebug = inker.getBorderMergePoints()
        GAME.clearMarkers();
        for (const point of mergePointsDebug) {
            GAME.addMarker(point.x, point.y, "#f00")
        }

    }

    // /**
    //  * @param {Inker} inker
    //  */
    // getBorder = (inker) => {
    //     /**@type {Piece} piece1 */
    //     const piece1 = null;
    //     /**@type {Piece}  */
    //     const piece2 = null;

    //     piece1.

    // }
}




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

/** 
 * @template O
 * @param {Array<O>} elements
 * @param {number} amount
 * @returns O
*/
function getRandomElement(elements, amount = 1) {
    const result = []

    let element = elements[Math.floor(Math.random() * elements.length)]
    result.push(element);
    let remaining = elements.filter(e=>e !== element);
    while (remaining.length > 0 && result.length < amount) {
        element = remaining[Math.floor(Math.random() * remaining.length)]
        result.push(element);
        remaining = elements.filter(e=>e !== element);
    }
    return result;
}

/**
 * @param {{x: number, y: number, size: number}} circle1
 * @param {{x: number, y: number, size: number}} circle2
 * @return {Array<{x: number, y: number}>}
 */
function getCircleIntercectPoints(circle1, circle2) {
  const mergePoints = [];
  //to optimize
  const piece1 = circle1;
  const piece2 = circle2;
  const deltaX = Math.abs(piece1.x - piece2.x);
  const deltaY = Math.abs(piece1.y - piece2.y);

  let d = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const a =
    (piece1.size * piece1.size - piece2.size * piece2.size + d * d) / 2 / d;
  const h = Math.sqrt(piece1.size * piece1.size - a * a);

  const PX = piece1.x + (a / d) * (piece2.x - piece1.x);
  const PY = piece1.y + (a / d) * (piece2.y - piece1.y);

  const targetX0 = PX + (h / d) * (piece2.y - piece1.y);
  const targetY0 = PY - (h / d) * (piece2.x - piece1.x);

  const targetX1 = PX - (h / d) * (piece2.y - piece1.y);
  const targetY1 = PY + (h / d) * (piece2.x - piece1.x);
  if (!isNaN(targetX0) && !isNaN(targetY0)) {
    mergePoints.push({ x: targetX0, y: targetY0 });
  }
  if (!isNaN(targetX1) && !isNaN(targetY1)) {
    mergePoints.push({ x: targetX1, y: targetY1 });
  }
  console.log(mergePoints);

  return mergePoints;
}




/**
 * 
 * @param {(x: number, y: number)=>void} handler 
 * @param {() => void} onup
 */
function attachOnClick(handler, onup) {
    let active = false;
    const handle = (e) => {
        if (active) {

            handler(e.clientX, e.clientY);
        }
    }
    document.addEventListener('mousedown', (e) => {
        active = true;
        handle(e)
    });
    document.addEventListener('mousemove', handle);
    document.addEventListener('mouseup', (e) => {
        onup()
        active = false;
    });
}




const GAME = new Game();
// const CONTROLLER = new Controller();

let inker = new Inker("#000000")
// inker.pieces.push(new Piece("#000000", 200, 320, 50))
// inker.pieces.push(new Piece("#000000", 235, 320, 50))
GAME.addInker(inker);
inker.addCell(GAME.getCell(10, 10))
inker.addCell(GAME.getCell(9, 10))

console.log(GAME.mapToCellCoordinates(100, 100));


let x, y
document.addEventListener('mousedown', (e) => {
    x = e.clientX
    y = e.clientY
    console.log(x, y)
});

setInterval(() => {
    const coordinateObject = GAME.mapToCellCoordinates(x, y);
    inker.expandTo(coordinateObject.x, coordinateObject.y, GAME)
}, 2000)

// setInterval(() => {
//     CONTROLLER.expand(inker)
// }, 50);
// const mergePoints = inker.getMergePoints()

// for (const point of mergePoints) {
//     GAME.addMarker(point.x, point.y, "#f00")
// }

// const borderPoints = inker.getBorderMergePoints();
// borderPoints.forEach(bp=> {
//     GAME.addMarker(bp.x, bp.y, "#0000FF")
// })
// inker.getMergePoints();

// GAME.addInker(new Inker("#000000", 250, 200));


/**
 * 
 * @param {(x: number, y: number)=>void} handler 
 * @param {() => void} onup
 */




let MOUSE_INTERVAL_ID;
attachOnClick((x, y) => {
    if (MOUSE_INTERVAL_ID === undefined) {
        MOUSE_INTERVAL_ID = setInterval(() => {addCircle(x, y)}, 300)
    }

}, () => {
    clearInterval(MOUSE_INTERVAL_ID)
    MOUSE_INTERVAL_ID = undefined;
})


//@ts-check
const piece1 = {x: 3,y: 8,size: 3};
const piece2 = {x: 3, y: 3, size: 3};

const deltaX = Math.abs(piece1.x - piece2.x)
const deltaY = Math.abs(piece1.y - piece2.y)

let d = Math.sqrt(deltaX * deltaX + deltaY + deltaY)
const a = (piece1.size * piece1.size - piece2.size * piece2.size + d * d) / 2/d
const h = Math.sqrt(piece1.size * piece1.size - a * a)

const PX = piece1.x + a/d * (piece2.x - piece1.x);
const PY = piece1.y + a/d * (piece2.y - piece1.y);

const targetX0 = PX + h / d * (piece2.y - piece1.y)
const targetY0 = PY - h / d * (piece2.x - piece1.x)

const targetX1 = PX - h / d * (piece2.y - piece1.y)
const targetY1 = PY + h / d * (piece2.x - piece1.x)



