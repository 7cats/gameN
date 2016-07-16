window.onload = function(){
  gen();
}

function clearTable() {
  var table = document.getElementById('gameTable');
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

function gen() {
  clearTable();
  let size = $("input:radio:checked").attr("value");
  size = parseInt(size);
  let rand = new Rand(size);
  for (let i = 1; i <= size; i++) {
    let newRow = document.createElement("tr");
    for (let j = 0; j < size; j++) {
      let newCell = document.createElement("td");
      let cellId = rand.getRandNumber();
      if (cellId == 0) {
          newCell.className = "clearCell";
      } else {
        newCell.className = "gameCell";
        newCell.innerText = cellId;
      }
      newCell.setAttribute("id", i * (1 + size + 1) + j + 1);
      newCell.setAttribute("onclick", "move(this)");
      newRow.appendChild(newCell);
    }
    document.getElementById("gameTable").appendChild(newRow);
  }
}

function Rand(size) {
  this.__randNumbers = new Array();
  this.__usedNumbers = new Array();
  while (!genRand(this.__randNumbers, this.__usedNumbers)) {}

  var curr = 0;

  this.getRandNumber = function() {
    if (curr < this.__randNumbers.length) {
      return this.__randNumbers[curr++];
    } else {
      throw "Error";
    }
  }

  function genRand(__randNumbers, __usedNumbers) {
    for (let i = 0; i < size * size; i++) {
      __randNumbers[i] = 0;
      __usedNumbers[i] = false;
    }

    let goodNumbers = 0;
    for (let i = 0; i < size  * size;) {
      let randN = Math.floor(Math.random() * __randNumbers.length);
      if (!__usedNumbers[randN]) {
        if (size % 2 === 0 && randN === 0) {
          goodNumbers += Math.ceil((i + 1) / size);
        }
        __usedNumbers[randN] = true;
        __randNumbers[i]     = randN;
        i++;
      }
    }

    for (let i = 0; i < size * size - 1; i++) {
      for (let j = i + 1; j < size * size; j++) {
        if (__randNumbers[i] !== 0 && __randNumbers[i] > __randNumbers[j]) {
          goodNumbers++;
        }
      }
    }
    return goodNumbers % 2 == 0;
  }
}

function swapCell(idN, idC) {
  let nCell = document.getElementById(idN);
  let cCell = document.getElementById(idC);
  cCell.innerText = nCell.innerText;
  cCell.className = "gameCell";
  nCell.innerText = "";
  nCell.className = "clearCell";
}

function isEmptySibling(id) {
  return document.getElementById(id) !== null && !document.getElementById(id).innerText;
}

function move(elem) {
  if (elem.innerText) {
    let cellId = 1 * elem.getAttribute("id");
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let size = (1 + document.getElementById("gameTable").childNodes.length + 1);
        if (i * i + j * j == 1 && isEmptySibling(cellId + size * i + j)) {
          swapCell(cellId, cellId + size * i + j);
          checkSolution();
          return;
        }
      }
    }
  }
}

function checkSolution() {
  let size = document.getElementById("gameTable").childNodes.length;
  size = parseInt(size);
  expectedText = "1";
  for (let i = 1 + size + 2; i < (1 + size + 1) * (size + 1) - 1; i += 2) {
    for (let j = 0; j < size && i * 1 !== (1 + size + 1) * (size + 1) - 2; j++, i++) {
      if (document.getElementById(i).innerText !== expectedText) {
        return;
      }
      expectedText = (expectedText * 1 + 1).toString();
    }
  }
  alert("Solved!");
}
