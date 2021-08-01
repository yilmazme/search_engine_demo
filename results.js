import { objArray } from "./index.js";

const List = document.getElementById("listRes");
const StaticList = document.getElementById("staticList");
const Query = document.getElementById("searchRes");
const SortBtn = document.getElementById("sortBtn");
const SortDateBtn = document.getElementById("sortDateBtn");

function setList(group) {
  clearList();
  for (const person of group) {
    const item = document.createElement("li");
    item.classList.add("list-group-item");
    const text = document.createTextNode(person.NameSurname);
    item.appendChild(text);
    List.appendChild(item);

    if (group.length === 0) {
      setNoResult();
    }
  }
}
function setResultList(group) {
  clearList();
  for (const person of group) {
    const item = document.createElement("li");
    item.classList.add("list-group-item");
    const text = document.createTextNode(person.NameSurname + person.Date);
    item.appendChild(text);
    StaticList.appendChild(item);

    if (group.length === 0) {
      setNoResult();
    }
  }
}

function clearList() {
  while (List.firstChild) {
    List.removeChild(List.firstChild);
  }
}
function clearStaticList() {
  while (StaticList.firstChild) {
    StaticList.removeChild(StaticList.firstChild);
  }
}

function setNoResult() {
  let item = document.createElement("li");
  item.classList.add("list-group-item");
  let text = document.createTextNode("No Result!");
  item.appendChild(text);
  List.appendChild(item);
}

function getRelevant(value, query) {
  if (value === query) {
    return 3;
  } else if (value.startsWith(query)) {
    return 2;
  } else {
    return 1;
  }
}

Query.addEventListener("input", (event) => {
  let value = event.target.value;
  if (value && value.trim().length > 0) {
    value = value.trim().toLowerCase();
    setList(
      objArray
        .filter((person) => {
          return person.NameSurname.includes(value);
        })
        .sort((p1, p2) => {
          return (
            getRelevant(p2.NameSurname, value) -
            getRelevant(p1.NameSurname, value)
          );
        })
    );
  } else {
    clearList();
  }
});

window.addEventListener("load", () => {
  let value = sessionStorage.getItem("lastQuery");
  Query.value = sessionStorage.getItem("lastQuery");
  if (value && value.trim().length > 0) {
    value = value.trim().toLowerCase();
    setResultList(
      objArray
        .filter((person) => {
          return person.NameSurname.includes(value);
        })
        .sort((p1, p2) => {
          return (
            getRelevant(p2.NameSurname, value) -
            getRelevant(p1.NameSurname, value)
          );
        })
    );
  } else {
    clearList();
  }
});

var passValue = [];
Query.addEventListener("input", (event) => {
  let value = event.target.value;
  passValue.push(value);
  sessionStorage.setItem("lastQuery", passValue[passValue.length - 1]);
  if (value && value.trim().length > 0) {
    value = value.trim().toLowerCase();
    setList(
      objArray
        .filter((person) => {
          return person.NameSurname.includes(value);
        })
        .sort((p1, p2) => {
          return (
            getRelevant(p2.NameSurname, value) -
            getRelevant(p1.NameSurname, value)
          );
        })
    );
  } else {
    clearList();
  }
});

//asc name func
SortBtn.addEventListener("click", () => {
  clearStaticList();
  let value = sessionStorage.getItem("lastQuery");
  setResultList(
    objArray
      .filter((person) => {
        return person.NameSurname.includes(value);
      })
      .sort((a, b) =>
        a.NameSurname > b.NameSurname
          ? 1
          : b.NameSurname > a.NameSurname
          ? -1
          : 0
      )
  );
});

// asc by date
SortDateBtn.addEventListener("click", () => {
  clearStaticList();
  let value = sessionStorage.getItem("lastQuery");
  setResultList(
    objArray
      .filter((person) => {
        return person.NameSurname.includes(value);
      })
      .sort((a, b) =>
        new Date(a.Date.replace(/(\d+[/])(\d+[/])/, "$2$1")) >
        new Date(b.Date.replace(/(\d+[/])(\d+[/])/, "$2$1"))
          ? 1
          : new Date(b.Date.replace(/(\d+[/])(\d+[/])/, "$2$1")) >
            new Date(a.Date.replace(/(\d+[/])(\d+[/])/, "$2$1"))
          ? -1
          : 0
      )
  );
  console.log(objArray);
});
