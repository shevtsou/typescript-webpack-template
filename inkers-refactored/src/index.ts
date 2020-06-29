import { game } from './services/Game'
import { Inker}  from './models/Inker';



let inker = new Inker("#000000")
// inker.pieces.push(new Piece("#000000", 200, 320, 50))
// inker.pieces.push(new Piece("#000000", 235, 320, 50))
game.addInker(inker);
inker.addCell(game.getCell(10, 10))
// inker.addCell(GAME.getCell(9, 10))

// console.log(GAME.mapToCellCoordinates(100, 100));


let x: number, y: number
document.addEventListener('mousedown', (e) => {
    x = e.clientX
    y = e.clientY
    console.log(x, y)
});

setInterval(() => {
    const coordinateObject = game.mapToCellCoordinates(x, y);
    inker.expandTo(coordinateObject.x, coordinateObject.y)
}, 2000)
