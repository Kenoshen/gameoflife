import OriginalWorld from "./rules/original"
import HarshWorld from "./rules/harsh"


console.log("WORLD");
document.world = null;
function refresh(){
    document.world = new HarshWorld();
    //document.world = new OriginalWorld();
}
refresh();
function step(){
    document.world.world.step();
    document.world.world.draw();
}
//
//
//document.refresh = refresh;
//document.step = step;
//
//function loop(){
//    step();
//    requestAnimationFrame(loop);
//}


function callbackLoop(){
    step();
    window.setTimeout(callbackLoop, 100);
}
window.setTimeout(callbackLoop, 100);
