document.addEventListener("DOMContentLoaded", () => pageLoaded());

let txt1, txt2, op, btn, lblRes;

function pageLoaded() {
    txt1 = document.getElementById("txt1");
    txt2 = document.getElementById("txt2");
    op = document.getElementById("op");
    btn = document.getElementById("btnCalc");
    lblRes = document.getElementById("lblRes");

    btn.addEventListener("click", calculate);
}

function calculate() {
    let v1 = txt1.value.trim();
    let v2 = txt2.value.trim();

    if (v1 === "" || v2 === "" || isNaN(v1) || isNaN(v2)) {
        lblRes.value = "Invalid input";
        return;
    }

    let n1 = Number(v1);
    let n2 = Number(v2);
    let oper = op.value;

    let result;

    switch (oper) {
        case "+": result = n1 + n2; break;
        case "-": result = n1 - n2; break;
        case "*": result = n1 * n2; break;
        case "/": result = n2 === 0 ? "Error" : n1 / n2; break;
        case "^": result = n1 ** n2; break;
    }

    lblRes.value = result;

    print(`${n1} ${oper} ${n2} = ${result}`, true);
}

function print(msg, append = false) {
    const ta = document.getElementById("output");

    if (!ta) return console.log(msg);

    if (append)
        ta.value += msg + "\n";
    else
        ta.value = msg + "\n";
}
