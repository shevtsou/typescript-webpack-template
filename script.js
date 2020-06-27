
class Inker {
    /** @type {string} color */
    color
    /** @type {number} x */
    x
    /** @type {number} y */
    y

    /** @type {Array<Piece>} */
    pieces = []    

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
     * @return {Array<{x: number, y: number}>}
     */
    getBorderMergePoints() {
        const points = this._getMergePoints();

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
        return borderpoints

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
        inker.pieces.push(new Piece("#000", targetPoint.x, targetPoint.y, 50))
        
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




class Game {

    /** @type {Array<Marker>} */
    markers = []
 
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
        this.markers.forEach(m => {
            this.drawCircle(m.x, m.y, 5, m.color)
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

    drawRectangle = (x0, y0, x1, y1) => {
        this.context.beginPath();
        this.context.rect(x0,y0, x1 - x0, y1 - y0);
        this.context.stroke();
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
const CONTROLLER = new Controller();

let inker = new Inker("#000000", 200, 400)
inker.pieces.push(new Piece("#000000", 200, 320, 50))
inker.pieces.push(new Piece("#000000", 235, 320, 50))
GAME.addInker(inker);
setInterval(() => {
    CONTROLLER.expand(inker)
}, 50);
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


function addCircle(x, y) {
    console.log("adding circle");
}


let MOUSE_INTERVAL_ID;
attachOnClick((x, y) => {
    if (MOUSE_INTERVAL_ID === undefined) {
        MOUSE_INTERVAL_ID = setInterval(() => {addCircle(x, y)}, 1000)
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



