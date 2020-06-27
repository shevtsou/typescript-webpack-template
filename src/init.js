import Game from './system/Game'
import Inker from './models/Inker';
import Piece from './models/Piece'
import Controller from './system/Controller'

const GAME = new Game();
const CONTROLLER = new Controller();

let inker = new Inker("#000000", 200, 400)
inker.pieces.push(new Piece("#000000", 200, 320, 50))
inker.pieces.push(new Piece("#000000", 235, 320, 50))
GAME.addInker(inker);
const mergePoints = inker.getMergePoints()

for (const point of mergePoints) {
    GAME.addMarker(point.x, point.y, "#f00")
}

const borderPoints = inker.getBorderMergePoints();
borderPoints.forEach(bp=> {
    GAME.addMarker(bp.x, bp.y, "#0000FF")
})
// inker.getMergePoints();

// GAME.addInker(new Inker("#000000", 250, 200));