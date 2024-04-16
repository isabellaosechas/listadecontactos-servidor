const REGEX_NAME = /^[A-Z][a-z ]*[A-Z][a-z]*$/;
const NUMBER_REGEX = /^[0]((424)|(426)|(412)|(414))[0-9]{7}$/;

// Selectores
const inputName = document.querySelector('#input-name');
const inputNumber = document.querySelector('#input-number');
const formBtn = document.querySelector('#form-btn');
const form = document.querySelector('#form');
const list = document.querySelector('#list');
const logOut = document.querySelector('.log-out')

const user = JSON.parse(localStorage.getItem('user'));

// Validations
let nameValidation = false;
let numberValidation = false;

(() => {
  if (!user) {
    window.location.href = '../home/index.html'
  }
})();

// Functions
const validateInput = (input, validation) => {
  // Validar boton
  if (nameValidation && numberValidation) {
    formBtn.disabled = false;
    
  } else {
    formBtn.disabled = true;
    formBtn.classList.add('formbtn-disabled');
  }

  // 2. Mostrar validacion en el html
  const infoText = input.parentElement.children[2];

  if (input.value === '') {
    input.classList.remove('correct');
    input.classList.remove('incorrect');
    infoText.style.display = 'none';
  } else if (validation) {
    input.classList.add('correct');
    input.classList.remove('incorrect');
    infoText.style.display = 'none';
  } else {
    input.classList.add('incorrect');
    input.classList.remove('correct');
    infoText.style.display = 'block';
  }
}

// 1. Add event to inputs VALIDACION
inputName.addEventListener('input', (e) => {
  // 1. Comparar valor del input con mi regex
  nameValidation = REGEX_NAME.test(inputName.value);
  // 2. Mostrar en el html la validacion
  validateInput(inputName, nameValidation);
});

inputNumber.addEventListener('input', (e) => {
  // 1. Comparar valor del input con mi regex
  numberValidation = NUMBER_REGEX.test(inputNumber.value);
  validateInput(inputNumber, numberValidation);
});

// Cerrar sesion
logOut.addEventListener('click', async e => {
  localStorage.removeItem('user');
  window.location.href =  '../home/index.html';

})

// Guardar contactos en el servidor y mostrar en html
form.addEventListener('submit', async e => {
  e.preventDefault();
  const responseJSON = await fetch('http://localhost:3000/contactos', { 
    method: 'POST' ,
    headers: {
        'Content-Type': ''
    },
    body: JSON.stringify({name: inputName.value, number: inputNumber.value, user: user.username}),
  });

const response = await responseJSON.json();
console.log(response);

  const li = document.createElement('li');
    li.innerHTML = `
    <li class="list-item"  id="${response.id}">
      <button class="delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
      <p>${response.name}</p>
      <p>${response.number}</p>
      <button class="edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>
      </li>
    `;
    list.append(li);
});

// Borrar / Editar
list.addEventListener('click', async e => {
  const deleteBtn = e.target.closest('.delete-btn');
  const editBtn = e.target.closest('.edit-btn');

  if (deleteBtn) {
    const id = deleteBtn.parentElement.id;
    await fetch(`http://localhost:3000/contactos/${id}`, { method: 'DELETE'});
    deleteBtn.parentElement.remove();
  }

  if (editBtn) {
    const li = editBtn.parentElement;
    const name = li.children[1];
    const phone = li.children[2];
    const nameEditValidation =  REGEX_NAME.test(name.innerHTML);
    const phoneEditValidation = NUMBER_REGEX.test(phone.innerHTML);
    
    if (li.classList.contains('editando')) {

      console.log(nameEditValidation, phoneEditValidation);
    if (!nameEditValidation) {
      name.classList.remove('border-edit');
      name.classList.add('incorrect');
        return;
      }

      if (!phoneEditValidation) {
        phone.classList.remove('border-edit');
        phone.classList.add('incorrect');
          return;
        } 


      // Logica de negocio

      const response = await fetch(`http://localhost:3000/contactos/${li.id}`, {
        method: 'PATCH',
        headers: {
                'Content-Type': ''
            },
            body: JSON.stringify({name: name.innerHTML, number: phone.innerHTML, user: user.username}),
      });
      const updateContacto = await response.json();
      

      
      // Logica del renderizado
      li.classList.remove('editando');
      name.removeAttribute('contenteditable');
      phone.removeAttribute('contenteditable');
      name.classList.remove('border-edit');
      phone.classList.remove('border-edit');
      name.classList.remove('incorrect');
      phone.classList.remove('incorrect');
      editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
      `;
    } else {
      editBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
      </svg>
      `;
      li.classList.add('editando');
      name.setAttribute('contenteditable', true);
      phone.setAttribute('contenteditable', true);
      name.classList.add('border-edit');
      phone.classList.add('border-edit');
    }
  }
});

//Guardar contactos en user 
const getContacts = async () => {
  const response = await fetch('http://localhost:3000/contactos', {method: 'GET'});
  const contactos = await response.json();
  const userContactos = contactos.filter(contacto => contacto.user === user?.username);
  userContactos.forEach(contacto => {
    const li = document.createElement('li');
    li.innerHTML = `
    <li class="list-item" id="${contacto.id}">
      <button class="delete-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
      <p>${contacto.name}</p>
      <p>${contacto.number}</p>
      <button class="edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>
      </li>
    `;
    list.append(li);
  })
}

getContacts();
