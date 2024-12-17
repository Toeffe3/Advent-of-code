const data = (require('node:fs').readFileSync('input.txt', { encoding: 'utf8' })).split("\n\n");

class Computer {

    static adv = 0n;
    static bxl = 1n;
    static bst = 2n;
    static jnz = 3n;
    static bxc = 4n;
    static out = 5n;
    static bdv = 6n;
    static cdv = 7n;

    regA = 0n;
    regB = 0n;
    regC = 0n;

    pointer = 0n;

    out = [];

    constructor(regA, regB, regC) {
        this.regA = regA;
        this.regB = regB;
        this.regC = regC;
    }
    
    opcode() {
        return this.program[this.pointer+1n]
    }

    literal() {
        return this.opcode();
    }

    combo() {
        switch (this.opcode()) {
            case 0n: // Fall though
            case 1n: // Fall though
            case 2n: // Fall though
            case 3n: return this.opcode();
            case 4n: return this.regA;
            case 5n: return this.regB;
            case 6n: return this.regC;
            case 7n: // Fall though
            default: throw Error("Invalid operand");
        }
    }

    jump() {
        if (this.regA !== 0n) this.pointer = this.literal();
        else this.pointer += 2n;
        return;
    }

    div(reg = "regA") {
        this[reg] = (this.regA / (2n**this.combo()));
        return;
    }

    xor(operand=true) {
        this.regB ^= operand ? this.literal() : this.regC;
        return;
    }

    mod() {
        this.regB = this.combo() % 8n;
        return;
    }

    output() {
        this.out.push(this.combo() % 8n);
        return;
    }

    step() {
        switch(this.program[this.pointer]) {
            case Computer.adv: this.div("regA"); break;
            case Computer.bxl: this.xor(true);   break;
            case Computer.bst: this.mod();       break;
            case Computer.jnz: return this.jump();
            case Computer.bxc: this.xor(false);  break;
            case Computer.out: this.output();    break;
            case Computer.bdv: this.div("regB"); break;
            case Computer.cdv: this.div("regC"); break;
        }
        this.pointer += 2n;
        return;
    }
    

    async run(program, debug) {
        this.program = program;
        this.halt = program.length;
        while(this.pointer <= this.halt) {
            if(debug) this.debugPrint();
            this.step();
            await new Promise(resolve => setTimeout(resolve, debug))
        }
        return this.out.join();
    }

    debugPrint() {
        process.stdout.cursorTo(0,0);
        process.stdout.clearLine();
        process.stdout.write(`A: ${this.regA}`);
        process.stdout.cursorTo(16);
        process.stdout.write(`B: ${this.regB}`);
        process.stdout.cursorTo(32);
        process.stdout.write(`C: ${this.regC}`);
        process.stdout.cursorTo(0, 1);
        process.stdout.clearLine();
        switch(this.program[this.pointer]) {
            case Computer.adv: console.log("Set A to "+(this.regA / (2n**this.combo()))); break;
            case Computer.bxl: console.log("Set B to "+(this.regB ^ this.literal())); break;
            case Computer.bst: console.log("Set B to "+(this.combo() % 8n)); break;
            case Computer.jnz: console.log(this.regA!==0n?'Jump to '+this.literal():'Continue'); break;
            case Computer.bxc: console.log("Set B to "+(this.regB ^ this.regC)); break;
            case Computer.out: console.log("Set B to "+(this.combo() % 8n)); break;
            case Computer.bdv: console.log("Set B to "+(this.regA / (2n**this.combo()))); break;
            case Computer.cdv: console.log("Set C to "+(this.regA / (2n**this.combo()))); break;
            default: console.log("EOP/ERROR");
        }
        process.stdout.write(`Prg:       ${this.program},EOP`);
        process.stdout.cursorTo(0, 3);
        process.stdout.clearLine();
        process.stdout.write(`Ptr (${this.pointer.toString().padStart(3, '0')}): `);
        process.stdout.moveCursor(this.pointer*2n);
        process.stdout.write(`^,_`);
        process.stdout.cursorTo(0, 4);
        process.stdout.clearLine();
        process.stdout.write(`Out: ${this.out.join()}\n`);
    }
}

const part1 = async () => {
    const computer = new Computer(...Array.from(data[0].matchAll(/Register .: (\d+)/g),(v) => BigInt(v[1])))
    return await computer.run(data[1].replace("Program: ", '').split(",").map(v => BigInt(v)), 50)
}

const part2 = async (itr = 0n) => {
    let iteration = itr, computer, program = data[1].replace("Program: ", '').split(",").map(BigInt);
    do {
        computer = new Computer(iteration++, 0n, 0n);
        console.log(`\nRunning iteration: ${iteration}`);
        await computer.run(program, 1);
    } while(computer.out.join()!==computer.program.join());
    return computer.regA;
}

(async() => {
    console.log("PART1", await part1());
    console.log("PART2", false);//await part2());
})()
