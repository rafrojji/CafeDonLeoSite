// ==========================================
// MENÚ MÓVIL
// ==========================================

const toggle = document.querySelector('.mobile-toggle');
const shell = document.querySelector('.nav-shell');

if (toggle && shell) {
  toggle.addEventListener('click', () => {
    shell.classList.toggle('open');
  });
}


// ==========================================
// AÑO DEL PIE DE PÁGINA
// ==========================================

const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}


// ==========================================
// FORMULARIO DE CONTACTO
// ==========================================

function handleContactForm(event) {
  event.preventDefault();

  const form = event.target;

  const name =
    form.querySelector('[name="nombre"]')?.value.trim() || '';

  const interest =
    form.querySelector('[name="interes"]')?.value || 'consulta';

  alert(
    `Gracias, ${name || 'cliente'}. Tu ${interest} fue registrada.`
  );

  form.reset();
}


// ==========================================
// CHATBOT DON LEO CAFÉ
// ==========================================

const DON_LEO_API_URL =
  'https://donleo-backend-production.up.railway.app';

const chatbotButton =
  document.getElementById('chatbot-button');

const chatbotWindow =
  document.getElementById('chatbot-window');

const chatbotClose =
  document.getElementById('chatbot-close');

const chatbotForm =
  document.getElementById('chatbot-form');

const chatbotInput =
  document.getElementById('chatbot-input');

const chatbotSend =
  document.getElementById('chatbot-send');

const chatbotMessages =
  document.getElementById('chatbot-messages');


function addChatbotMessage(text, type = 'assistant') {
  if (!chatbotMessages) {
    return null;
  }

  const message = document.createElement('div');

  message.classList.add('chatbot-message');

  const classes = {
    user: 'chatbot-user-message',
    assistant: 'chatbot-assistant-message',
    error: 'chatbot-error-message',
    loading: 'chatbot-assistant-message'
  };

  message.classList.add(
    classes[type] || 'chatbot-assistant-message'
  );

  if (type === 'loading') {
    message.classList.add('chatbot-loading-message');
  }

  message.textContent = text;

  chatbotMessages.appendChild(message);

  /*
   * Para mensajes del usuario y de carga,
   * desplazamos el chat al final.
   */
  if (type === 'user' || type === 'loading') {
    chatbotMessages.scrollTo({
      top: chatbotMessages.scrollHeight,
      behavior: 'smooth'
    });
  }

  /*
   * Para respuestas largas del asistente,
   * mostramos el inicio del nuevo mensaje.
   */
  if (type === 'assistant' || type === 'error') {
    setTimeout(() => {
      const messageTop = message.offsetTop - 12;

      chatbotMessages.scrollTo({
        top: messageTop,
        behavior: 'smooth'
      });
    }, 50);
  }

  return message;
}

function setChatbotDisabled(disabled) {
  if (chatbotInput) {
    chatbotInput.disabled = disabled;
  }

  if (chatbotSend) {
    chatbotSend.disabled = disabled;
  }
}


function openChatbot() {
  if (!chatbotWindow) {
    console.error('No se encontró chatbot-window.');
    return;
  }

  chatbotWindow.hidden = false;

  chatbotButton?.setAttribute(
    'aria-label',
    'Cerrar asistente virtual'
  );

  setTimeout(() => {
    chatbotInput?.focus();
  }, 100);
}


function closeChatbot() {
  if (!chatbotWindow) {
    return;
  }

  chatbotWindow.hidden = true;

  chatbotButton?.setAttribute(
    'aria-label',
    'Abrir asistente virtual'
  );
}


function toggleChatbot() {
  if (!chatbotWindow) {
    console.error('No se encontró chatbot-window.');
    return;
  }

  if (chatbotWindow.hidden) {
    openChatbot();
  } else {
    closeChatbot();
  }
}


async function askDonLeo(pregunta) {
  const response = await fetch(
    `${DON_LEO_API_URL}/preguntar`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        pregunta
      })
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error(
      'El servidor respondió en un formato no válido.'
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error || 'No fue posible procesar la consulta.'
    );
  }

  if (!data.respuesta) {
    throw new Error(
      'El asistente no devolvió una respuesta.'
    );
  }

  return data.respuesta;
}


// Abrir o cerrar el chatbot.
if (chatbotButton) {
  chatbotButton.addEventListener('click', toggleChatbot);
} else {
  console.error('No se encontró chatbot-button.');
}


// Cerrar con la X.
if (chatbotClose) {
  chatbotClose.addEventListener('click', closeChatbot);
}


// Enviar una pregunta.
if (chatbotForm) {
  chatbotForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const pregunta = chatbotInput?.value.trim();

    if (!pregunta) {
      return;
    }

    addChatbotMessage(pregunta, 'user');

    chatbotInput.value = '';
    setChatbotDisabled(true);

    const loadingMessage = addChatbotMessage(
      'Don Leo Café está preparando la respuesta...',
      'loading'
    );

    try {
      const respuesta = await askDonLeo(pregunta);

      loadingMessage?.remove();

      addChatbotMessage(respuesta, 'assistant');
    } catch (error) {
      loadingMessage?.remove();

      console.error(
        'Error al consultar el asistente:',
        error
      );

      addChatbotMessage(
        'Lo siento, no pude comunicarme con el asistente. Intentalo nuevamente en unos segundos.',
        'error'
      );
    } finally {
      setChatbotDisabled(false);
      chatbotInput?.focus();
    }
  });
}


// Cerrar con Escape.
document.addEventListener('keydown', (event) => {
  if (
    event.key === 'Escape' &&
    chatbotWindow &&
    !chatbotWindow.hidden
  ) {
    closeChatbot();
  }
});


console.log('✅ Script y chatbot de Don Leo Café cargados.');