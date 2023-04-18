function logIn(event) {
  event.preventDefault();
  const value = {
    email: document.login.email.value,
    password: document.login.password.value,
  };
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(value),
  })
    .then((res) => {
      if (res.ok === false) {
        throw new Error("Erreur dans l’identifiant ou le mot de passe");
      }
      return res.json();
    })
    .then((data) => {
      localStorage.setItem("token", data.token);
      const urlToChange = document.location.href.split("login");
      document.location.href = urlToChange[0] + "index.html";
    })
    .catch((error) => {
      alert(error);
    });
}

document.querySelector("#connect").addEventListener("click", logIn);
