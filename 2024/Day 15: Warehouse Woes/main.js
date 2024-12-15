const data = (require('node:fs').readFileSync('input.txt', { encoding: 'utf8' })).split("\n\n");

const getPosition = (match) => match.index;
const sum = (a, b) => a + b;

class Simulation {
    constructor(map) {
        this.width = map.indexOf('\n');
        this.height = map.length / this.width;
        map = map.replaceAll(/\n/g, '');
        this.robot = map.indexOf('@');
        this.boxes = Array.from(map.matchAll(/O/g), getPosition);
        this.walls = Array.from(map.matchAll(/#/g), getPosition);
    }

    pos2index = ({x, y}) => x+(y*this.width);
    index2pos = (index) => ({x: index%this.width, y: Math.floor(index/this.width)})

    scanAhead(direction, {x, y}) {
        const cx = x, cy = y;
        switch(direction) {
            case '>': x++; break;
            case 'v': y++; break;
            case '<': x--; break;
            case '^': y--; break;
        }
        switch(this.typeAt({x, y})) {
            case '.': return [this.pos2index({x:cx, y:cy})];
            case 'O':{
                let deeper = this.scanAhead(direction, {x, y})
                if(deeper == null) return null
                else return [...this.scanAhead(direction, {x, y}), this.pos2index({x:cx, y:cy})];
            }
            default: return null
        }
    }

    typeAt({x, y}) {
        const index = this.pos2index({x, y});
        if(index == this.robot) return '@';
        if(this.boxes.includes(index)) return 'O';
        if(this.walls.includes(index)) return '#';
        return '.'
    }

    move(direction, {x, y}) {
        let index = this.pos2index({x, y});
        const object = this.typeAt({x, y});
        
        switch(direction) {
            case '>': x++; break;
            case 'v': y++; break;
            case '<': x--; break;
            case '^': y--; break;
        }

        switch(object) {
            case '@': this.robot = this.pos2index({x, y}); break;
            case 'O': {
                this.boxes.splice(this.boxes.indexOf(index), 1);
                this.boxes.push(this.pos2index({x, y}));
                break;
            }
        }
    }

    step(direction) {
        if(direction === undefined) return false; // End of instructions
        const ahead = this.scanAhead(direction, this.index2pos(this.robot));
        if(ahead !== null) ahead.forEach(moveable => this.move(direction, this.index2pos(moveable)));
        return true;
    }

    debugPrint() {
        let out = "";
        for(let y = 0; y < this.width; y++) {
            for(let x = 0; x < this.width; x++) out += this.typeAt({x, y});
            out += '\n'
        }
        return out;
    }
}

const part1animate = async (data, tstep=50) => {
    const sim = new Simulation(data[0]);
    const instructions = data[1].split('');
    while(sim.step(instructions.shift())) {
        if(tstep == -1) continue; // tstep of 0 still have delay due to printing speed, use -1 to skip
        console.log(sim.debugPrint());
        await new Promise(resolve => setTimeout(resolve, tstep));
    }
    return sim.boxes.map(index => index%sim.width + (100 * Math.floor(index/sim.width))).reduce(sum);
}

(async () => {
    console.log("PART1", await part1animate(data, -1));
})();
