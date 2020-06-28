
/**
 * 
 * @param {(x: number, y: number)=>void} handler 
 * @param {() => void} onup
 */
function attachOnClick(handler, onup) {/** $IGNORE$ */}




let MOUSE_INTERVAL_ID;
attachOnClick((x, y) => {
    if (MOUSE_INTERVAL_ID === undefined) {
        MOUSE_INTERVAL_ID = setInterval(() => {addCircle(x, y)}, 300)
    }

}, () => {
    clearInterval(MOUSE_INTERVAL_ID)
    MOUSE_INTERVAL_ID = undefined;
})
