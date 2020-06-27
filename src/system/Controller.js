
import Inker from '../models/Inker';
import Piece from '../models/Piece'

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


export default Controller;