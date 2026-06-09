document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const btnCrearCuenta = document.getElementById("btnCrearCuenta");
  const btnExplorar = document.getElementById("btnExplorar");

  if (usuario) {
    if (btnCrearCuenta) {
      btnCrearCuenta.style.display = "none";
    }

    if (btnExplorar) {
      btnExplorar.style.display = "none";
    }
  }
});

function filtrarServicio(oficio) {
  localStorage.setItem("filtroOficio", oficio);
  window.location.href = "buscar.html";
}