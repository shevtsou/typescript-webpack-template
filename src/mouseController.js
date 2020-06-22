
/**
 * 
 * @param {(x: number, y: number)=>void} handler 
 * @param {() => void} onup
 */
function attachOnClick(handler, onup) {/** $IGNORE$ */}


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
