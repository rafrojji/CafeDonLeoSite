const toggle = document.querySelector('.mobile-toggle');
const shell = document.querySelector('.nav-shell');
if (toggle && shell) {
  toggle.addEventListener('click', () => shell.classList.toggle('open'));
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

function handleContactForm(event) {
  event.preventDefault();
  const form = event.target;
  const name = form.querySelector('[name="nombre"]').value.trim();
  const interest = form.querySelector('[name="interes"]')?.value || 'consulta';
  alert(`Gracias, ${name || 'cliente'}. Tu ${interest} fue registrada. Este sitio demo está listo para conectar con correo, WhatsApp o un backend.`);
  form.reset();
}
