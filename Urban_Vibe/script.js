function cargarHTML(id, archivo) {
  fetch(archivo)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    });
}

window.onload = function () {
  cargarHTML("header", "header/header.html");
  cargarHTML("footer", "footer/footer.html");
};

// Cargar el header
fetch('header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header').innerHTML = data;
  });
  

// Columnas

document.addEventListener("DOMContentLoaded", function () {
    const seccion = document.querySelector('.mision-vision');
    const columnas = document.querySelectorAll('.columna');

    function ajustarColumnas() {
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

  //LOGIN -- Script
  const usuarios = []; // Aquí se almacena los registrados

  // Cambio de pestañas
  const tabs = document.querySelectorAll('[role="tab"]');
  const panels = document.querySelectorAll('[role="tabpanel"]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });
      panels.forEach(panel => panel.classList.remove('active'));
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      document.getElementById(tab.getAttribute('aria-controls')).classList.add('active');
      tab.focus();
    });
  });

  // Registro
  document.getElementById('panel-registrar').addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('emailRegistro').value;
    const password = document.getElementById('passwordRegistro').value;

    usuarios.push({ nombre, apellido, email, password });

    alert("¡Registro exitoso! Ahora inicia sesión.");
    document.getElementById('tab-login').click(); // Cambia a pestaña login
  });

  // Login validacion y mostrar si los datos son correctos o no 
  document.getElementById('panel-login').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;

    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (usuario) {
      localStorage.setItem('userNombre', usuario.nombre);
      localStorage.setItem('userApellido', usuario.apellido);
      localStorage.setItem('userEmail', usuario.email);

    // Redirigir a la pantalla principal
    window.location.href = "inicio.html";
    } else {
      alert("Correo o contraseña incorrectos");
    }
  });
 
  // cierre ambito logueo

    window.addEventListener('resize', ajustarColumnas);
    ajustarColumnas(); // Ejecutar al cargar
  });