"use strict";
async function bootstrap() {
  const projects = await fillProjets();
  sortButtons(projects);
  defaultDisplay(projects);
  // sortProject(projects);
  createGallery(projects);
  createSelectCategory();
  console.log(projects);
}
bootstrap();

/* Fonction de récupération des données de l'API */
async function fillProjets() {
  const data = await fetch("http://localhost:5678/api/works");
  let projects = await data.json();
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

/* Création et insertion des boutons de tri */
async function sortButtons(projects) {
  const categoriesToSort = [];
  categoriesToSort.push("Tous");
  for (let project of projects) {
    categoriesToSort.push(project.category.name);
  }
  const sort = [...new Set(categoriesToSort)];
  const portfolio = document.getElementById("portfolio");
  const buttons = document.createElement("div");
  buttons.setAttribute("class", "sort");
  if (localStorage.token !== undefined) {
    buttons.style.display = "none";
  }
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
  const btnSort = document.getElementsByClassName("btnSort");
  for (let btn of btnSort) {
    btn.addEventListener("click", function () {
      btnSort[0].removeAttribute("id");
      document.getElementsByClassName("gallery")[0].replaceChildren();
      const btnValue = btn.value;
      const filterProject = projects.filter(
        (project) => project.category.name === btnValue
      );
      if (btnValue && btnValue !== "Tous") {
        createProject(filterProject);
      } else {
        createProject(projects);
      }
    });
  }
}

// async function sortProject(projects) {
//   const btnSort = document.getElementsByClassName("btnSort");
//   const categoryBtn = {
//     Objets: 1,
//     Appartements: 2,
//     "Hôtels & Restaurants": 3,
//   };

//   for (let btn of btnSort) {
//     btn.addEventListener("click", function () {
//       btnSort[0].removeAttribute("id");
//       document.getElementsByClassName("gallery")[0].replaceChildren();
//       const btnValue = btn.value;
//       const filterProject = projects.filter(
//         (project) => project.category.id === categoryBtn[btnValue]
//       );
//       if (categoryBtn[btnValue]) {
//         createProject(filterProject);
//       } else {
//         createProject(projects);
//       }
//     });
//   }
// }

// Fonction de récupération du token

//Affichage apres connexion
const editionMode = document.getElementsByClassName("editionMode");
if (localStorage.token === undefined) {
  for (let element of editionMode) {
    element.style.display = "none";
  }
}

//Gestion de l'affichage de la modale
let modal = null;
const focusableSelector = "button";
let focusables = [];
let previouslyFocusedElement = null;

//Fonction d'apparition de la modale
const openModal = function (e) {
  e.preventDefault();
  modal = document.getElementById("modal1");
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  previouslyFocusedElement = document.querySelector(":focus");
  modal.style.display = "flex";
  focusables[0].focus();
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelectorAll(".js-modal-close").forEach((a) => {
    a.addEventListener("click", closeModal);
  });
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
};

//fonction de disparition de la modale
const closeModal = function (e) {
  if (modal === null) return;
  if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
  e.preventDefault();
  window.setTimeout(function () {
    modal.style.display = "none";
    modal = null;
  }, 500);
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
};

//Ne pas fermer la modale au click dans la modale
const stopPropagation = function (e) {
  e.stopPropagation();
};

//Au click du bouton=ouvrir la modale
document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

//Fonction pour garder le focus dans la modale ()
const focusInModal = function (e) {
  e.preventDefault();
  let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));
  if (e.shiftKey === true) {
    index--;
  } else {
    index++;
  }
  if (index >= focusables.length) {
    index = 0;
  }
  if (index < 0) {
    index = focusables.length - 1;
  }
  focusables[index].focus();
};

//Fonction pour focus dans la modale ou fermer la modale avec le clavier (accessibilité lecteurs d'ecran)
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
  }
});

//Fonction de l'affichage des projets dans la modale
function createGallery(projects) {
  for (let project of projects) {
    // Récupération de la div modal-gallery
    const gallery = document.getElementById("modal-gallery");
    // Création d'une figure enfant de gallery
    const newFigure = document.createElement("figure");
    gallery.appendChild(newFigure);
    // Création d'une div image enfant de figure
    const newDiv = document.createElement("div");
    newDiv.setAttribute("class", "modal-image");
    newFigure.appendChild(newDiv);
    //Création du bouton delete
    const newButton = document.createElement("button");
    newButton.setAttribute("type", "button");
    newButton.setAttribute("class", "delete-img");
    newButton.setAttribute("id", project.id);
    newButton.innerHTML = `<i class="fas fa-trash-alt fa-xs"></i>`;
    newDiv.appendChild(newButton);
    //Creation de l'image
    const newImg = document.createElement("img");
    newImg.src = project.imageUrl;
    newImg.setAttribute("alt", project.title);
    newDiv.appendChild(newImg);
    // Création d'une figcaption enfant de figure
    const newEditionButton = document.createElement("p");
    newEditionButton.innerHTML = "éditer";
    newFigure.appendChild(newEditionButton);
  }

  //Fonction de suppression de projet
  const deleteButtons = document.querySelectorAll(".delete-img");
  for (let button of deleteButtons) {
    button.addEventListener("click", deleteItem);
  }
  async function deleteItem() {
    const token = localStorage.token;
    const res = await fetch(`http://localhost:5678/api/works/${this.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      alert(`Le projet ${this.id} a été supprimé`);
    } else {
      alert(`Le projet ${this.id} n'a pas pu être supprimé`);
    }
  }
}

// const newButtonMove = document.createElement("button");
// newButtonMove.setAttribute("type", "button");
// newButtonMove.setAttribute("class", "move-img");
// newButtonMove.innerHTML = `<i class="fas fa-arrows-alt fa-xs"></i>`;
// document.getElementsByClassName("modal-image")[0].appendChild(newButtonMove);
// }
const firstModal = document.getElementById("modalDeleteImg");
const secondModal = document.getElementById("modalAddImg");
const changeModal = function () {
  firstModal.style.display = "none";
  secondModal.style.display = "flex";
};

const backModal = function () {
  firstModal.style.display = "flex";
  secondModal.style.display = "none";
};
document.querySelector("#post-img-btn").addEventListener("click", changeModal);
document.querySelector("#modal-back").addEventListener("click", backModal);

const disconnect = function () {
  localStorage.removeItem("token");
  document.location.reload();
};
document.querySelector("#edition-btn").addEventListener("click", disconnect);

function createSelectCategory() {
  const selectCategory = document.getElementById("categories");
  const btnSort = Array.from(document.getElementsByClassName("btnSort"));
  btnSort.shift();
  for (let btn of btnSort) {
    const option = document.createElement("option");
    option.setAttribute("value", btn.value);
    option.innerHTML = btn.value;
    selectCategory.appendChild(option);
  }
}

// const fileInput = document.querySelector('input[type="file"]');

// // Create a new File object
// const myFile = new File(["Hello World!"], "+ Ajouter photo", {
//   type: "text/plain",
//   lastModified: new Date(),
// });

// // Now let's create a DataTransfer to get a FileList
// const dataTransfer = new DataTransfer();
// dataTransfer.items.add(myFile);
// fileInput.files = dataTransfer.files;

function addProject(event) {
  event.preventDefault();
  const formData = new FormData();
  console.log(document.newImg.image.files);
  formData.append("title", document.newImg.title.value);
  formData.append("image", document.newImg.image.files[0]);
  formData.append("category", document.newImg.category.selectedIndex);
  const token = localStorage.token;
  console.log(formData);
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((res) => {
      if (res.ok === false) {
        throw new Error("La photo n'a pas pu être ajoutée");
      }
    })
    .catch((error) => {
      alert(error);
    });
}

document.querySelector("#post-img").addEventListener("click", addProject);
