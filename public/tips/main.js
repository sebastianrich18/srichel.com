let BLOCK_LIST = []
let tips;
let NUM_EMPLOYEES = 8;
let EMPLOYEE_LIST = ["Matt", "Drew", "Fred", "Jakob", "Sebastian", "Hannah", "John", "Cameron", "Conor", "Pual"];

function setup() {
    createCanvas(displayWidth, displayHeight);
    background(220);
    for (let i = 1; i < NUM_EMPLOYEES + 1; i++) {
        new Block(i * 30);
    }
    tips = createInput();
    tips.size(50, 20);
    tips.position(165, 300)
    button = createButton('Submit');
    button.position(165, 340);
    button.mousePressed(calc);
    text("Total Tips", 165, 290);
    text("Employee", 20, 20);
    text("Hours", 110, 20);
    text("Pay", 160, 20)
}

function draw() {
    BLOCK_LIST.forEach(b => { b.show(); })
}

function Block(y) {
    this.y = y;
    this.list = createList();
    this.out = "$";
    list.position(30, this.y);
    this.hours = createInput();
    this.hours.size(15, 13);
    this.hours.position(120, this.y)
    this.show = function() {
        text(this.out, 160, this.y + 5)
    }
    BLOCK_LIST.push(this);
}

function calc() {
    let vals = [];
    BLOCK_LIST.forEach(b => {
        vals.push([b.list.value(), b.hours.value()]);
    })
    let totalTips = tips.value();
    let totalHours = 0;
    let hourList = [];
    let employeeList = [];
    let out = [];
    vals.forEach(v => {
        if (v[0] != "") {
            totalHours += parseInt(v[1]);
            hourList.push(parseInt(v[1]));
            employeeList.push(v[0]);

        }
    });
    // console.log(totalHours);
    // console.table(hourList);
    // console.table(employeeList);
    let perHour = totalTips / totalHours;
    for (let i = 0; i < hourList.length; i++) {
        out.push([employeeList[i], +(perHour * hourList[i]).toFixed(2)])
    }
    for(let i=0; i<out.length; i++) {
        for(let j=0; j<BLOCK_LIST.length; j++) {
            if(out[i][0] == BLOCK_LIST[j].list.value()) {
                BLOCK_LIST[j].out = "$ " + out[i][1];
            }
        }
    }

}

function createList() {
    list = createSelect();
    list.option('');
    EMPLOYEE_LIST.forEach(e => {
        list.option(e);
    })
    list.selected('');
    return list;
}
