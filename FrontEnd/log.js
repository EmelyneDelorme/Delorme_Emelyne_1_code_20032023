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
        alert("E-mail et/ou mot-de-passe incorrects");
      } else if (res.ok === true) {
        document.location.href = `http://127.0.0.1:5500/FrontEnd/index.html`;
        res.json().then((data) => {
          localStorage.setItem("token", data.token);
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
