const people = [
  { name: "mehmet" },
  { name: "ali riza" },
  { name: "ahmet" },
  { name: "canan" },
  { name: "can ali" },
  { name: "mehtap" },
];

const List = document.getElementById("list");
const Query = document.getElementById("search");

function setList(group) {
  clearList();
  for (const person of group) {
    const item = document.createElement("li");
    item.classList.add("list-group-item");
    const text = document.createTextNode(person.name);
    item.appendChild(text);
    List.appendChild(item);
  }
  if (group.length === 0) {
    setNoResult();
  }
}
function clearList() {
  while (List.firstChild) {
    List.removeChild(List.firstChild);
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
      people
        .filter((person) => {
          return person.name.includes(value);
        })
        .sort((p1, p2) => {
          return getRelevant(p2.name, value) - getRelevant(p1.name, value);
        })
    );
  } else {
    clearList();
  }
});
