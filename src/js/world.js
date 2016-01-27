function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

class Cell {
    constructor(index){
        this.index = index;
        this.alive = false;
        this.neighbors = 0;
        this.dirty = true;
    }
    equals(other){
        return other instanceof Cell && this.alive === other.alive && this.neighbors === other.neighbors;
    }
}

class Cells {
    constructor(width, height){
        this._width = width;
        this._height = height;
        this.size = width * height;

        let cellGenerator = function* (size){
            while (size-- > 0) yield new Cell(size)
        };
        this._cells = [...cellGenerator(this.size)]
    }
    getCell(x, y = 0){ return this._cells[y * this._width + x] }
    forEachNeighbor(cell, func){
        let index = cell.index;
        let neighborIndexes = [
            index - 1, // left
            index + 1, // right
            index - width, // top
            index + width, // bottom
            index - 1 - width, // top left
            index + 1 - width, // top right
            index - 1 + width, // bottom left
            index + 1 + width // bottom right
        ];
        for (let i of neighborIndexes) {
            let neighbor = this.getCell(i);
            if (neighbor) func(neighbor);
        }
    }
    forEachCell(func){
        for (let cell of this._cells) func(cell)
    }
    forEachDirtyCell(func){
        for (let cell of this._cells) if (cell.dirty) func(cell)
    }
    toString(neighbors){
        var str = "";
        for (var y = 0; y < this._height; y += 1){
            for (var x = 0; x < this._width; x += 1) {
                if (neighbors) str += this.getCell(x, y).neighbors;
                else str += (this.getCell(x, y).alive ? 1 : 0);
            }
            if (y + 1 < this._height) str += "\n";
        }
        return str;
    }
}

export default class World {
    constructor(width, height){
        this._width = width;
        this._height = height;
        this._a = new Cells(width, height);
        this._b = new Cells(width, height);
        this._switch = true;
    }
    setSeed(seedFunc){ if (isFunction(seedFunc)) this._seed = seedFunc }
    setRules(ruleFunc){ if (isFunction(ruleFunc)) this._rules = ruleFunc }
    initialize(){
        if (this._seed) this._a.forEachCell(cell => {
            let alive = this._seed(cell);
            cell.alive = alive;
            if (alive) this._a.forEachNeighbor(neighbor => neighbor.neighbors += 1)
        })
    }
    step(){
        if (this._switch){
            this._current = this._a;
            this._next = this._b;
        } else {
            this._current = this._b;
            this._next = this._a;
        }

        if (this._rules) this._current.forEachDirtyCell(cell => {
            let alive = this._rules(cell);
            let dirty = cell.alive !== alive;
            if (dirty) {
                if (alive) this._next.forEachNeighbor(cell, neighbor => {
                    neighbor.neighbors += 1;
                    neighbor.dirty = true;
                });
                else this._next.forEachNeighbor(cell, neighbor => {
                    neighbor.neighbors -= 1;
                    neighbor.dirty = true;
                })
            }
            let nextCell = this._next.getCell(cell.index);
            nextCell.alive = alive;
            nextCell.dirty = dirty;
        });

        this._switch = !this._switch;
    }
}