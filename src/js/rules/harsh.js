import World from "../world"

export default class HarshWorld {
    constructor() {
        this.world = new World(200, 100);
        this.world.setRules((cell, neighborCount) => {
            if (cell.alive) return neighborCount === 2 || neighborCount === 3;
            else return neighborCount === 3;
        });
        this.world.setSeed(cell => {
            return (Math.random() * 100) > 70;
            //return cell.index % 3 === 0;
        });
        this.world.initialize();
        console.log(this.world._current.toString());
    }
}