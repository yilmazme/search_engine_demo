import {Data} from "./Data.js";

const List = document.getElementById("list");
const Query = document.getElementById("search");



export var objArray = [];

// verilen json datayı object array haline getirir
for(let i = 0; i< Data.data.length; i++){
  let obj ={
    NameSurname: Data.data[i][0].toLowerCase(),
    Company:Data.data[i][1],
    Email:Data.data[i][2],
    Date:Data.data[i][3],
    Country:Data.data[i][4],
    City:Data.data[i][5], 
  }
objArray.push(obj)

}



//öneri listesini oluşturur
function setList(group) {
  clearList();
  if(group.length === 0){
    setNoResult();
  }
  else if (group.length<5) {
    for (const person of group) {
      const item = document.createElement("li");
      item.classList.add("list-group-item");
      const text = document.createTextNode(person.NameSurname);
      item.appendChild(text);
      List.appendChild(item);
    }
    const item = document.createElement("li");
    item.classList.add("list-group-item");
    item.classList.add("text-info");
    const text = document.createTextNode("Show More");
    const link = document.createElement("a");
    link.href="./results.html"
    link.appendChild(text)
    item.appendChild(link);
    List.appendChild(item);
  }
  else{
    for (const person of group.slice(0,5)) {
      const item = document.createElement("li");
      item.classList.add("list-group-item");
      const text = document.createTextNode(person.NameSurname);
      item.appendChild(text);
      List.appendChild(item);
    }
    const item = document.createElement("li");
    item.classList.add("list-group-item");
    item.classList.add("tex-info");
    const text = document.createTextNode("Show More");
    const link = document.createElement("a");
    link.href="./results.html"
    link.appendChild(text)
    item.appendChild(link);
    List.appendChild(item);
  }
}
//yeni aramada yeni öneriler eskisini eklenmesini önler, eskileri siler
function clearList() {
  while (List.firstChild) {
    List.removeChild(List.firstChild);
  }
}
// sonuç yoks uyarı ekler
function setNoResult() {
  let item = document.createElement("li");
  item.classList.add("list-group-item");
  item.classList.add("text-danger");
  let text = document.createTextNode("No Result!");
  item.appendChild(text);
  List.appendChild(item);
}

// arama ifadesinin bulunduğu yere göre öncelik tanır, baştaysa önde gelir
function getRelevant(value, query) {
  if (value === query) {
    return 3;
  } else if (value.startsWith(query)) {
    return 2;
  } else {
    return 1;
  }
}


var passValue=[];


// inputa göre object arrayi filtreler 
if(Query){
  Query.addEventListener("input", (event) => {
    let value = event.target.value;
    passValue.push(value)
    sessionStorage.setItem("lastQuery", passValue[passValue.length-1]);
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
