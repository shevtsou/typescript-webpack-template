

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

GAME.addInker(new Inker("#000000", 200, 200));


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


