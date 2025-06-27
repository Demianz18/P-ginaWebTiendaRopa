// Cargar HTML dinámicamente en el elemento con id específico
function cargarHTML(id, archivo) {
  return fetch(archivo)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (id === "header") {
        actualizarHeaderConUsuario();
      }
    });
}

// Actualiza el header con avatar del usuario o enlace de login
function actualizarHeaderConUsuario() {
  const userArea = document.getElementById('userArea');
  const usuario = JSON.parse(localStorage.getItem('usuarioUrbanVibe'));

  if (!userArea) return;

  if (usuario) {
    const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`;
    const avatarURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreCompleto)}&background=000&color=fff&size=64`;

    userArea.innerHTML = `
      <li class="nav-item d-flex align-items-center gap-2">
        <img src="${avatarURL}" alt="Avatar" class="rounded-circle" width="50" height="50">
        <a href="#" class="btn btn-sm btn-outline-light rounded-pill cerrar-sesion ms-2 px-3 py-1">
          Cerrar sesión
        </a>
      </li>
    `;

    const cerrarSesionBtn = userArea.querySelector('.cerrar-sesion');
    cerrarSesionBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('usuarioUrbanVibe');
      location.reload();
    });
  } else {
    userArea.innerHTML = `
      <li class="nav-item mx-2">
        <a class="nav-link text-light fw-light" href="/login.html">
          Ingresar | Registrarse
        </a>
      </li>
    `;
  }
}

// Ajuste responsive de columnas
function ajustarColumnas() {
  const seccion = document.querySelector('.mision-vision');
  const columnas = document.querySelectorAll('.columna');

  if (!seccion || columnas.length === 0) return;

  if (window.innerWidth <= 768) {
    seccion.style.flexDirection = 'column';
    seccion.style.alignItems = 'center';
    columnas.forEach(col => {
      col.style.width = '90%';
      col.style.maxWidth = '500px';
    });
  } else {
    seccion.style.flexDirection = 'row';
    seccion.style.alignItems = 'flex-start';
    columnas.forEach(col => {
      col.style.flex = '1 1 300px';
      col.style.width = '';
      col.style.maxWidth = '';
    });
  }
}

// Inicializar login y registro (solo si estás en login.html)
function inicializarLoginYRegistro() {
  const usuarios = [];

  // Tabs
  const tabs = document.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
      panels.forEach(panel => panel.classList.remove('active'));
      tab.setAttribute('aria-selected', 'true');
      document.getElementById(tab.getAttribute('aria-controls')).classList.add('active');
      tab.focus();
    });
  });

  // Función de validación personalizada
  function validarRegistro() {
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const fechaNacimiento = document.getElementById('fechaNacimiento');
    const sexo = document.querySelector('input[name="sexo"]:checked');
    const email = document.getElementById('emailRegistro');
    const password = document.getElementById('passwordRegistro');

    const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regexNombre.test(nombre.value.trim())) {
      alert("Nombre inválido.");
      nombre.focus();
      return false;
    }

    if (!regexNombre.test(apellido.value.trim())) {
      alert("Apellido inválido.");
      apellido.focus();
      return false;
    }

    if (!fechaNacimiento.value) {
      alert("Debes ingresar tu fecha de nacimiento.");
      fechaNacimiento.focus();
      return false;
    } else {
      const fechaNac = new Date(fechaNacimiento.value);
      const hoy = new Date();

      // Calcular edad exacta
      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();

      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
      }

      if (edad < 18) {
        alert("Debes ser mayor de edad (mínimo 18 años).");
        fechaNacimiento.focus();
        return false;
      }

      if (edad > 100) {
        alert("Edad no válida (máximo 100 años).");
        fechaNacimiento.focus();
        return false;
      }
    }

    if (!sexo) {
      alert("Debes seleccionar tu sexo.");
      return false;
    }

    if (!regexEmail.test(email.value.trim())) {
      alert("Correo electrónico inválido.");
      email.focus();
      return false;
    }

    if (password.value.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      password.focus();
      return false;
    }

    return true;
  }

  // Registro
  const formRegistro = document.getElementById('panel-registrar');
  if (formRegistro) {
    formRegistro.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validarRegistro()) return;

      const nombre = document.getElementById('nombre').value.trim();
      const apellido = document.getElementById('apellido').value.trim();
      const email = document.getElementById('emailRegistro').value.trim();
      const password = document.getElementById('passwordRegistro').value;

      usuarios.push({ nombre, apellido, email, password });

      alert("¡Registro exitoso! Ahora inicia sesión.");
      document.getElementById('tab-login').click();
      formRegistro.reset();
    });
  }

  // Login
  const formLogin = document.getElementById('panel-login');
  if (formLogin) {
    formLogin.addEventListener('submit', function (e) {
      e.preventDefault();

      const email = document.getElementById('emailLogin').value.trim();
      const password = document.getElementById('passwordLogin').value;

      const usuario = usuarios.find(u => u.email === email && u.password === password);

      if (usuario) {
        localStorage.setItem('usuarioUrbanVibe', JSON.stringify(usuario));
        alert("Inicio de sesión exitoso. Redirigiendo...");
        setTimeout(() => {
          window.location.href = "/index.html";
        }, 2000);
      } else {
        alert("Correo o contraseña incorrectos.");
      }
    });
  }
}

// Inicialización segura al cargar la página
window.onload = function () {
  Promise.all([
    cargarHTML("header", "header/header.html"),
    cargarHTML("footer", "footer/footer.html")
  ]).then(() => {
    ajustarColumnas();
  });
};

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener('resize', ajustarColumnas);
  ajustarColumnas();
  inicializarLoginYRegistro();
});

// Script para ocultar el ícono mientras el offcanvas está abierto y reiniciar animación al cerrarse -->

document.addEventListener('DOMContentLoaded', function () {
  const carritoBtn = document.getElementById('carritoIcono');
  const offcanvasEl = document.getElementById('carritoOffcanvas');

  if (carritoBtn && offcanvasEl) {
    offcanvasEl.addEventListener('show.bs.offcanvas', function () {
      carritoBtn.classList.add('d-none');
    });

    offcanvasEl.addEventListener('hidden.bs.offcanvas', function () {
      carritoBtn.classList.remove('d-none');
      // Reiniciar animación
      carritoBtn.classList.remove('animate-carrito');
      void carritoBtn.offsetWidth;
      carritoBtn.classList.add('animate-carrito');
    });
  }
});
