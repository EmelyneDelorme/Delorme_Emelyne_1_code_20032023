let projects = [];

/* Fonctions de récupération des données de l'API */
async function fillProjets() {
  const data = await fetch("http://localhost:5678/api/works");
  projects = await data.json();
}

/* Fonctions de création des projets à afficher */
function createProject() {
  for (let project of projects) {
    // Récupération de la div gallery
    const gallery = document.getElementsByClassName(`gallery`);
    // Création d'une figure enfant de gallery
    gallery[0].innerHTML += `
    <figure> 
      <img src="${project.imageUrl}" alt="${project.title}">
      <figcaption>${project.title}</figcaption>
    </figure>
    `;
  }
}
async function defaultDisplay() {
  await fillProjets();
  createProject();
  btnSort[0].setAttribute("id", "default");
}
defaultDisplay();

/* Création et insertion des bouttons de tri */
const sort = ["Tous", "Objets", "Appartements", "Hôtels & Restaurants"];
const portfolio = document.getElementById("portfolio");
const buttons = document.createElement("div");
buttons.setAttribute("class", "sort");
portfolio.appendChild(buttons);
const title = document.getElementsByTagName("h2");
portfolio.prepend(buttons);
portfolio.prepend(title[1]);

for (let obj of sort) {
  const btnSort = document.createElement("input");
  btnSort.setAttribute("type", "button");
  btnSort.setAttribute("class", "btnSort");
  btnSort.setAttribute("value", obj);
  buttons.appendChild(btnSort);
}

const projectsAll = projects;
const projectsObjects = [];
const projectsApartment = [];
const projectsRestaurant = [];
const btnSort = document.getElementsByClassName("btnSort");

async function sortProject() {
  await fillProjets();
  const projectsAll = projects;
  const projectsObjects = [];
  const projectsApartment = [];
  const projectsRestaurant = [];
  const btnSort = document.getElementsByClassName("btnSort");
  for (let project of projects) {
    switch (project.categoryId) {
      case 1:
        projectsObjects.push(project);
        break;
      case 2:
        projectsApartment.push(project);
        break;
      case 3:
        projectsRestaurant.push(project);
        break;
    }
  }
  for (let btn of btnSort) {
    btn.addEventListener("click", function () {
      switch (btn.value) {
        case "Objets":
          projects = projectsObjects;
          break;
        case "Appartements":
          projects = projectsApartment;
          break;
        case "Hôtels & Restaurants":
          projects = projectsRestaurant;
          break;
        case "Tous":
          projects = projectsAll;
          break;
      }
      console.log(projects);
      btnSort[0].removeAttribute("id");
      document.getElementsByClassName("gallery")[0].innerHTML = "";
      createProject();
    });
  }
}
sortProject();
