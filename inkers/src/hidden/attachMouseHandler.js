

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


module.exports = attachOnClick