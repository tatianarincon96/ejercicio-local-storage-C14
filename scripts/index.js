window.onload = () => {
  if (sessionStorage.length !== 0) {
    const sesion = JSON.parse(sessionStorage.getItem("sesion"));
    const correoElectronico = sesion.email;
    paginaBienvenida(correoElectronico); 
  }
}
const loader = document.querySelector("#loader");
const error = document.querySelector("#error-container");
const h1 = document.querySelector("h1");
const form = document.forms.login;
const email = form.email;
const password = form.password;
const button = form.button;

const datosDeSesion = {
  name: null,
  email: null,
  password: null
}

function cargarDatosEnSessionStorage(nombreUsuario, correoElectronico, contrasenia) {
  datosDeSesion.name = nombreUsuario;
  datosDeSesion.email = correoElectronico;
  datosDeSesion.password = contrasenia;

  sessionStorage.setItem("sesion", JSON.stringify(datosDeSesion));
}

function validarIngreso() {
  const correoElectronico = email.value;
  const contrasenia = password.value;
  const emailValido = validarEmail(correoElectronico);
  const passwordValida = validarContrasenia(contrasenia);
  const personaRegistrada = validarPersonaEnDB(correoElectronico);
  const nombreUsuario = obtenerNombre(correoElectronico);
  if (emailValido && passwordValida && personaRegistrada) {
    paginaBienvenida(correoElectronico);
    cargarDatosEnSessionStorage(nombreUsuario, correoElectronico, contrasenia);
  } else {
    error.innerHTML = '<small>Alguno de los datos ingresados son incorrectos</small>';
    loader.classList.add("hidden");
    error.classList.remove("hidden");
  }
}

button.onclick = () => {
  loader.classList.remove("hidden");
  setTimeout(() => {
    validarIngreso();
  }, 3000);
};

function paginaBienvenida(correoElectronico) {
  const nombreUsuario = obtenerNombre(correoElectronico)
  form.style.opacity = 0;
  h1.innerText = 'Bienvenid@ al sitio ' + nombreUsuario + ' 😀';
  botonCerrarSesion();
  const logoutButton = document.querySelector("#logout-btn");
  logoutButton.onclick = () => { sessionStorage.clear(); alert("Ha cerrado sesión"); location.reload() }
}

function botonCerrarSesion() {
  const container = document.querySelector("#logout-button-container");
  const template = `
      <button id="logout-btn" class="logout-btn">Cerrar Sesión</button>
    `;
  container.innerHTML += template;
}

function validarEmail(correoElectronico) {
  const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
  return regex.test(correoElectronico) ? true : false;
}

function validarContrasenia(contrasenia) {
  return contrasenia.length >= 5 ? true : false;
}

function validarPersonaEnDB(correoElectronico) {
  const arrayEmails = baseDeDatos.usuarios.map(usuario => usuario.email);
  return arrayEmails.includes(correoElectronico) ? true : false;
}

function obtenerNombre(correoElectronico) {
  const usuario = baseDeDatos.usuarios.find(usuario => usuario.email === correoElectronico);
  return usuario.name;
}