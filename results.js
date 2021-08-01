import { objArray } from "./index.js";



const List = document.getElementById("listRes");
const Query = document.getElementById("searchRes");




function setList(group) {
  clearList();
 
    for (const person of group) {
      const item = document.createElement("li");
      item.classList.add("list-group-item");
      const text = document.createTextNode(person.NameSurname);
      item.appendChild(text);
      List.appendChild(item);
    
      if(group.length === 0){
        setNoResult();
      }
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
        objArray
          .filter((person) => {
            return person.NameSurname.includes(value); 
          })
          .sort((p1, p2) => {
            return getRelevant(p2.NameSurname, value) - getRelevant(p1.NameSurname, value);
          })
      );
    } else {
      clearList();
    }
  });


if(Query){
  window.addEventListener("load", () => {
    let value = sessionStorage.getItem("lastQuery");
    Query.value = sessionStorage.getItem("lastQuery");
    if (value && value.trim().length > 0) {
      value = value.trim().toLowerCase(); 
      setList(
        objArray
          .filter((person) => {
            return person.NameSurname.includes(value); 
          })
          .sort((p1, p2) => {
            return getRelevant(p2.NameSurname, value) - getRelevant(p1.NameSurname, value);
          })
      );
    } else {
      clearList();
    }
  });
}
