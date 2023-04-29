let addToy = false;

function createCardElement(toy) {
  let card = document.createElement('div');
  card.classList.add('card');

  let h2 = document.createElement('h2');
  h2.textContent = toy.name;

  let img = document.createElement('img');
  img.src = toy.image;
  img.classList.add('toy-avatar');

  let p = document.createElement('p');
  p.textContent = `${toy.likes} Likes`;

  let button = document.createElement('button');
  button.addEventListener('click', () => {
    p.textContent = `${(toy.likes += 1)} Likes`;
    updateLikes(toy.id, toy.likes);
  });
  button.classList.add('like-btn');
  button.id = toy.id;
  button.textContent = 'Like ❤️';

  card.append(h2, img, p, button);
  document.getElementById('toy-collection').appendChild(card);
}

function updateLikes(id, newNumberOfLikes) {
  fetch(`http://localhost:3000/toys/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      likes: newNumberOfLikes,
    }),
  });
}

function sendItOut(newToy) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      ...newToy,
      likes: 0,
    }),
  })
    .then((response) => response.json())
    .then((responseToy) => createCardElement(responseToy));
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/toys')
    .then((res) => res.json())
    .then((toys) => toys.forEach((toy) => createCardElement(toy)));

  const form = document.querySelector('form.add-toy-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(event.target));
    sendItOut(formData);
  });

  const addBtn = document.querySelector('#new-toy-btn');
  const toyFormContainer = document.querySelector('.container');
  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = 'block';
    } else {
      toyFormContainer.style.display = 'none';
    }
  });
});
