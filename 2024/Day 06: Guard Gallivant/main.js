const data = (require('node:fs').readFileSync('input.txt', { encoding: 'utf8' }));

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

class Guard {
    position = {x: 0, y: 0};
    orientation = UP;

    constructor({x, y}) {
        this.position.x = x;
        this.position.y = y;
    }

    walk(amount=1) {
        switch(this.orientation) {
            case UP:    this.position.y-=amount; break;
            case RIGHT: this.position.x+=amount; break;
            case DOWN:  this.position.y+=amount; break;
            case LEFT:  this.position.x-=amount; break;
        }
    }

    obtrusion() {
        this.walk(-1); // Undo walk
        this.orientation++;
        this.orientation%=4;
    }
}

class Trace {

    width = 0;
    area = new Array();
    guard;
    visited;

    iteration = 0;

    /**
     * 
     * @param {String} map 
     */
    constructor(map) {
        this.width = map.indexOf('\n');
        this.area = map.replaceAll('\n','').split('');
        this.guard = new Guard(this.l2d(this.area.findIndex(v => v === '^')));
        this.area = this.area.map(t => t === '#');
        this.visited = new Array(this.area.length).fill(0);
        // console.log(this);
    }

    /**
     * Linear array index to dimentional array indecies
     * @param {Number} index 
     * @returns 
     */
    l2d(index) {
        return {
            x: index%this.width,
            y: Math.floor(index/this.width)
        }
    }

    /**
     * Dimentional array indecies to linear array index
     * @param {Number} x 
     * @param {Number} y 
     * @returns 
     */
    d2l({x, y}) {
        return x+(y*this.width);
    }

    /**
     * Step simulation once
     * @returns {Number?} iterations while in bound, null if out of bounds
     */
    step() {
        let pos = this.d2l(this.guard.position);
        if(this.area[pos]) this.guard.obtrusion();
        else this.visited[pos]++;
        this.guard.walk();
        let newpos = this.guard.position;
        if(
            newpos.x < 0 || newpos.x >= this.width ||
            newpos.y < 0 || newpos.y > Math.floor(this.area.length/this.width)
        ) return null;
        return ++this.iteration;
    }

    debugPrint(simpel = true) {
        let text = "";
        for(let i in this.area) {
            if(i%this.width == 0) text += '\n'
            text += this.area[i] ? "#" : this.visited[i] ? (simpel ? 'X' : this.visited[i]) : '.';
        }
        console.clear();
        console.log(text);
        return text;
    }

}

const part1 = (data) => {
    const tracer = new Trace(data);
    while(tracer.step());
    return tracer.visited.filter(Boolean).length;
};
const part2 = (data) => {
    // Try another day
    return false;
};

console.log('PART1', part1(data));
console.log('PART2', part2(data));

const part1animate = async (data, tstep=50) => {
    const tracer = new Trace(data);
    while(tracer.step()) {
        tracer.debugPrint(false);
        await new Promise(resolve => setTimeout(resolve, tstep))
    }
}

//part1animate(data, 20)