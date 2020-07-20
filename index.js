const db = firebase.firestore();

const eventForm = document.getElementById('event-form');

eventForm.addEventListener('submit', evento => {
  evento.preventDefault();

  const sport = eventForm['event-sport'].value;
  const direction = eventForm['event-direction'].value;
  const description = eventForm['event-description'].value;

  console.log(sport, direction, description)
})