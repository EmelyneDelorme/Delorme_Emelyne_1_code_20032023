"use strict";
async function bootstrap() {
  const projects = await fillProjets();
  defaultDisplay(projects);
  sortProject(projects);
  createGallery(projects);
}

bootstrap();

/* Fonction de récupération des données de l'API */
async function fillProjets() {
  const data = await fetch("http://localhost:5678/api/works");
  const projects = await data.json();
  return projects;
}

/* Fonction de création des projets à afficher */
function createProject(projects) {
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

// Fonction pour l'affichage par défaut
async function defaultDisplay(projects) {
  createProject(projects);
  const btnSort = document.getElementsByClassName("btnSort");
  btnSort[0].setAttribute("id", "default");
}

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

// Fonction de tri - filtre
async function sortProject(projects) {
  const btnSort = document.getElementsByClassName("btnSort");
  const categoryBtn = {
    Objets: 1,
    Appartements: 2,
    "Hôtels & Restaurants": 3,
  };

  for (let btn of btnSort) {
    btn.addEventListener("click", function () {
      btnSort[0].removeAttribute("id");
      document.getElementsByClassName("gallery")[0].replaceChildren();
      const btnValue = btn.value;
      const filterProject = projects.filter(
        (project) => project.category.id === categoryBtn[btnValue]
      );
      if (categoryBtn[btnValue]) {
        createProject(filterProject);
      } else {
        createProject(projects);
      }
      console.log(projects);
    });
  }
}

// Fonction de récupération du token
const editionMode = document.getElementsByClassName("editionMode");
if (localStorage.token === undefined) {
  for (let element of editionMode) {
    element.style.display = "none";
  }
}

let modal = null;

const openModal = function (e) {
  e.preventDefault();
  const target = document.getElementById("modal1");
  target.style.display = "flex";
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
};

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal = null;
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

function createGallery(projects) {
  for (let project of projects) {
    // Récupération de la div gallery
    const gallery = document.getElementsByClassName("gallery");
    // Création d'une figure enfant de gallery
    const newFigure = document.createElement("figure");
    gallery[0].appendChild(newFigure);
    // Création d'une image enfant de figure
    const newImg = document.createElement("img");
    newImg.src = project.imageUrl;
    newImg.setAttribute("alt", project.title);
    newFigure.appendChild(newImg);
    // Création d'une figcaption enfant de figure
    const newFigCaption = document.createElement("figcaption");
    newFigCaption.innerHTML = project.title;
    newFigure.appendChild(newFigCaption);
  }
}
