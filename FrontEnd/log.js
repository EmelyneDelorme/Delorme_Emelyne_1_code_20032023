function send(event) {
  event.preventDefault();
  const value = {
    email: event.target.elements.email.value,
    password: event.target.elements.password.value,
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
        alert("Erreur dans l’identifiant ou le mot de passe");
        throw new Error("E-mail et/ou mot-de-passe incorrects");
      }
      return res.json();
    })
    .then((data) => {
      localStorage.setItem("token", data.token);
      document.location.href = `http://127.0.0.1:5500/FrontEnd/index.html`;
    })
    .catch((error) => {
      console.log(error);
    });
}
