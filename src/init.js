import Game from './system/Game'
import Inker from './models/Inker';

const GAME = new Game();

GAME.addInker(new Inker("#000000", 200, 200));