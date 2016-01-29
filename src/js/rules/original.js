import World from "../world"

export default class OriginalWorld {
    constructor() {
        this.world = new World(100, 40);
        this.world.setRules((cell, neighborCount) => {
            if (cell.alive) return neighborCount === 2 || neighborCount === 3;
            else return neighborCount === 2;
        });
        this.world.setSeed(cell => {
            return (Math.random() * 100) > 99;
            //return cell.index % 3 === 0;
        });
        this.world.initialize();
    }
}