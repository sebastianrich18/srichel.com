let BLOCK_LIST = []
let tips;
let NUM_EMPLOYEES = 8;
let EMPLOYEE_LIST = [];

function setup() {
    EMPLOYEE_LIST = getEmployees()
    console.log(EMPLOYEE_LIST)
    createCanvas(windowWidth, windowHeight);
    background(220);
    for (let i = 1; i < NUM_EMPLOYEES + 1; i++) {
        new Block((i * 50) + 100);
    }
    tips = createInput();
    tips.size(50, 20);
    tips.position(width / 2.45, height * .67)

    let submitButton = createButton('Submit');
    submitButton.position(width / 2.45, height * .72);
    submitButton.mousePressed(calc);

    let addButton = createButton("Add Employee")
    addButton.position(width / 1.5, height * .35);
    addButton.mousePressed(addEmployee);

    let removeButton = createButton("Remove Employee")
    removeButton.position(width / 1.5, height * .45);
    removeButton.mousePressed(removeEmployee);

    textSize(20)
    text("Total Tips", width / 2.5, height * .65);
    text("Employee", (width / 6) - 13, 120);
    text("Hours", width / 3.75, 120);
    text("Pay", width / 3, 120)
}

function draw() {
    BLOCK_LIST.forEach(b => { b.show(); })
}

function Block(y) {
    this.y = y;
    this.list = createSelect();
    this.list.position((width / 6), this.y);
    this.list.size(100, 25)
    this.list.option("")
    for (let e of EMPLOYEE_LIST) {
        this.list.option(e)
    }
    this.out = "$";
    this.hours = createInput();
    this.hours.size(25, 20);
    this.hours.position(width / 3.5, this.y)
    this.show = () => {
        text(this.out, width / 3, this.y + 5)
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
    for (let i = 0; i < out.length; i++) {
        for (let j = 0; j < BLOCK_LIST.length; j++) {
            if (out[i][0] == BLOCK_LIST[j].list.value()) {
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

function addEmployee() {
    let name = prompt("Enter the name of the employee you would like to add")
    if (!name) return
    setCookie('employees', getCookie('employees') + "," + name, 500)
    EMPLOYEE_LIST.push(name);
    updateList(name);
}

function removeEmployee() {
    let name = prompt("Enter the name of the employee you would like to remove")
    if (!name) return

    employees = getEmployees();
    index = employees.indexOf(name);
    if (index != -1) {
        employees.splice(index, 1);
        EMPLOYEE_LIST.splice(EMPLOYEE_LIST.indexOf(name), 1)
    } else {
        alert('Employee ' + name + ' not found')
        console.error('Employee ' + name + ' not found')
    }
    setCookie('employees', employees, 500)
}

function getEmployees() {
    let cookies = [];
    try {
        cookies = getCookie('employees').split(",");
    } catch(e) {
        console.error(e)
        let name = prompt('Add your first employee')
        setCookie('employees', getCookie('employees') + "," + name, 500)
        EMPLOYEE_LIST.push(name);
        updateList(name);
    }
    return cookies
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function updateList(name) {
    // console.log(name);
    if (!name) return
    for (let block of BLOCK_LIST) {
        // console.log('ADDING')
        block.list.option(name)
    }
}