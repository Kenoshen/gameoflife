function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

class Cell {
    constructor(index, width, size){
        this.index = index;
        this.alive = false;
        this.dirty = true;
        this.neighbors = [];

        let onLeft = index % width === 0;
        let onRight = index % width === width - 1;
        let tmp = [
            (onLeft ? -1 : index - 1), // left
            (onRight ? -1 : index + 1), // right
            index - width, // top
            index + width, // bottom
            (onLeft ? -1 : index - 1 - width), // top left
            (onRight ? -1 : index + 1 - width), // top right
            (onLeft ? -1 : index - 1 + width), // bottom left
            (onRight ? -1 : index + 1 + width) // bottom right
        ];
        tmp.forEach(cellIndex => {if(cellIndex >= 0 && cellIndex < size) this.neighbors.push(cellIndex)});
    }
    toString(){ return `[${this.alive} ${this.neighbors} ${this.dirty}]` }
}

class Cells {
    constructor(width, height){
        this._width = width;
        this._height = height;
        this.size = width * height;
        this._cells = [];
        for (let i = 0; i < this.size; i++) this._cells.push(new Cell(i, this._width, this.size));
    }
    getCell(x, y = 0){ return this._cells[y * this._width + x] }
    forEachNeighbor(cell, func){
        for (let i of cell.neighbors) {
            let neighbor = this.getCell(i);
            if (neighbor) func(neighbor);
        }
    }
    getCellNeighborCount(cell){
        var count = 0;
        this.forEachNeighbor(cell, neighbor => {
            if (neighbor.alive) count += 1;
        });
        return count;
    }
    forEachCell(func){
        for (let cell of this._cells) func(cell)
    }
    forEachDirtyCell(func){
        for (let cell of this._cells) if (cell.dirty) func(cell)
    }
    toString(){
        var str = "";
        for (var y = 0; y < this._height; y += 1){
            for (var x = 0; x < this._width; x += 1) {
                let cell = this.getCell(x, y);
                //str += `[${cell.alive} ${this.getCellNeighborCount(cell)} ${cell.dirty}]`;
                str += (cell.alive ? '0' : ' ');
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
        this._current = this._a;
        this._next = this._b;
        this._switch = true;
        this.generations = 0;
    }
    setSeed(seedFunc){ if (isFunction(seedFunc)) this._seed = seedFunc }
    setRules(ruleFunc){ if (isFunction(ruleFunc)) this._rules = ruleFunc }
    initialize(){
        if (this._seed) this._a.forEachCell(cell => { cell.alive = this._seed(cell) })
    }
    step(){
        this.generations += 1;

        if (this._rules) this._current.forEachDirtyCell(cell => {
            let nextCell = this._next.getCell(cell.index);
            nextCell.alive = this._rules(cell, this._current.getCellNeighborCount(cell));
            nextCell.dirty = cell.alive !== nextCell.alive;
            if (nextCell.dirty) this._next.forEachNeighbor(cell, neighbor => neighbor.dirty = true);
        });

        this._switch = !this._switch;
        if (this._switch){
            this._current = this._a;
            this._next = this._b;
        } else {
            this._current = this._b;
            this._next = this._a;
        }
    }
    draw(){
        document.getElementById("console").innerText = `Generations: ${this.generations} \n` + this._current.toString();
    }
}