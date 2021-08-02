import { objArray } from "./index.js";

const List = document.getElementById("listRes");
const StaticList = document.getElementById("staticList");
const Query = document.getElementById("searchRes");
const SortNameBtn = document.getElementById("sortNameBtn");
const SortDateBtn = document.getElementById("sortDateBtn");
const SortNameDesBtn = document.getElementById("sortNameDesBtn");
const SortDateDesBtn = document.getElementById("sortDateDesBtn");
const PageBtns = document.getElementById("pageBtns");



//input alanının dışına tıklandığında önerileri kaldırır
Query.addEventListener("focusout", ()=>{
  clearList();
})

// input anında önerileri listeler
function setList(group) {
  clearList();
  if (group.length === 0) {
    setNoResult();
  }
  for (const person of group) {
    const item = document.createElement("li");
    item.classList.add("list-group-item");
    const text = document.createTextNode(person.NameSurname);
    item.appendChild(text);
    List.appendChild(item);

    
  }
}
// öneri listesini temizler, eklenmesini engeller
function clearList() {
  while (List.firstChild) {
    List.removeChild(List.firstChild);
  }
}
// sonuç kısmını siler yeni sonuçlerın eklenmesini önler
function clearStaticList() {
  while (StaticList.firstChild) {
    StaticList.removeChild(StaticList.firstChild);
  }
}
//öneri bolunmazsa uyarı yazısı için
function setNoResult() {
  let item = document.createElement("li");
  item.classList.add("list-group-item");
  item.classList.add("text-danger");
  let text = document.createTextNode("No Result!");
  item.appendChild(text);
  List.appendChild(item);
}

// arama ifadesinin yerine göre öncelik belirler, baştaysa ilk sıraya alır
function getRelevant(value, query) {
  if (value === query) {
    return 3;
  } else if (value.startsWith(query)) {
    return 2;
  } else {
    return 1;
  }
}

// sonuç sayfası yüklendiği anda session storageda kayıtlı arama ifadesini alır ve tekrar arama yapar
var filteredArray = [];
window.addEventListener("load", () => {
  let value = sessionStorage.getItem("lastQuery");
  Query.value = sessionStorage.getItem("lastQuery");
  if (value && value.trim().length > 0) {
    value = value.trim().toLowerCase();
    filteredArray = objArray
    .filter((person) => {
      return person.NameSurname.includes(value);
    }).sort((p1, p2) => {
      return (
        getRelevant(p2.NameSurname, value) -
        getRelevant(p1.NameSurname, value)
      );
    })
    if(filteredArray.length<4){
      PageBtns.style.display="none";
    }else{
      PageBtns.style.display="inherit";
    }
    
  } else {
    clearList();
  }
});

//sonuç kısmında tekrar arama yapılmasını sağlar, kayıtlı ifadeyi tekrar yazar
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

if(filteredArray.length<4){
  PageBtns.style.display="none";
}

//sonuçları isme göre alfabetik olarak düz ve ters sıralar
SortNameBtn.addEventListener("click", () => {
  filteredArray
      .sort((a, b) =>
        a.NameSurname > b.NameSurname
          ? 1
          : b.NameSurname > a.NameSurname
          ? -1
          : 0
      )
      changePage(currentPage)
});
SortNameDesBtn.addEventListener("click", () => {
  filteredArray
      .sort((a, b) =>
        a.NameSurname > b.NameSurname
          ? -1
          : b.NameSurname > a.NameSurname
          ? 1
          : 0
      )
      changePage(currentPage)
});

// tarihe göre sıralar
SortDateBtn.addEventListener("click", () => {
    filteredArray
      .sort((a, b) =>
        new Date(a.Date.replace(/(\d+[/])(\d+[/])/, "$2$1")) >
        new Date(b.Date.replace(/(\d+[/])(\d+[/])/, "$2$1"))
          ? 1
          : new Date(b.Date.replace(/(\d+[/])(\d+[/])/, "$2$1")) >
            new Date(a.Date.replace(/(\d+[/])(\d+[/])/, "$2$1"))
          ? -1
          : 0
      )
      changePage(currentPage)
});
SortDateDesBtn.addEventListener("click", () => {
    filteredArray.sort((a, b) =>
        new Date(a.Date.replace(/(\d+[/])(\d+[/])/, "$2$1")) >
        new Date(b.Date.replace(/(\d+[/])(\d+[/])/, "$2$1"))
          ? -1
          : new Date(b.Date.replace(/(\d+[/])(\d+[/])/, "$2$1")) >
            new Date(a.Date.replace(/(\d+[/])(\d+[/])/, "$2$1"))
          ? 1
          : 0
      )
      changePage(currentPage)
});


//pagination

var currentPage = 1;
var redordsPerPage = 3;

const NextBtn = document.getElementById("btn_next");
const PreevBtn = document.getElementById("btn_prev");


PreevBtn.addEventListener("click",()=>{
  clearStaticList()
  if (currentPage > 1) {
    currentPage--;
    changePage(currentPage);
}
})
NextBtn.addEventListener("click",()=>{
  clearStaticList()
  if (currentPage < numPages()) {
    currentPage++;
    changePage(currentPage);
}
})

  function changePage(page)
  {   clearStaticList()
      var page_span = document.getElementById("page");
   
      // Validate page
      if (page < 1) page = 1;
      if (page > numPages()) page = numPages();

      //sonuç listesinde filtrelenmiş elemanları doma yükler
      for (var i = (page-1) * redordsPerPage; i < (page * redordsPerPage) && i < filteredArray.length; i++) {
       if(filteredArray.length){
        const item = document.createElement("li");
        item.classList.add("list-group-item");
        const text = document.createTextNode("Title: "+filteredArray[i].NameSurname + " Country: "+filteredArray[i].Country + " Date: " + filteredArray[i].Date);
        item.appendChild(text);
        StaticList.appendChild(item);
       }
      }

      page_span.innerHTML = page + "/" + numPages();
  
      if (page == 1) {
          PreevBtn.style.visibility = "hidden"
      } else {
          PreevBtn.style.visibility = "visible";
      }
  
      if (page == numPages()) {
          NextBtn.style.visibility = "hidden";
      } else {
          NextBtn.style.visibility = "visible";
      }
  }


function numPages()
{
    return Math.ceil(filteredArray.length / redordsPerPage);
}

window.onload = function() {
  setTimeout(()=>{
    changePage(1);
  },100)
    
};