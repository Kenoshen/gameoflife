import World from "../world"

export default class HarshWorld {
    constructor() {
        this.world = new World(10, 10);
        this.world.setRules(cell => {
            if (cell.alive) return cell.neighbors === 3 || cell.neighbors === 4;
            else return cell.neighbors === 2;
        });
        this.world.setSeed(cell => {
            return cell % 2 === 0
        });
        this.world.initialize();
        console.log(this.world._current.toString());
    }
}