class Cell {
    constructor(){
        this.alive = false;
        this.neighbors = 0;
        this.dirty = false;
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
            while (size-- > 0) yield new Cell()
        };
        this._cells = [...cellGenerator(this.size)]

    }

}