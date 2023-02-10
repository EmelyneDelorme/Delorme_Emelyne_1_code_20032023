const value = {
  email: document.getElementById("emaillog").value,
  password: document.getElementById("password").value,
};

function send(e) {
  e.preventDefault();
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(value),
  });
}
document.getElementById("connect").addEventListener("click", send());
