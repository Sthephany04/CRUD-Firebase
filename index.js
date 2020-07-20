const db = firebase.firestore();

const eventForm = document.getElementById('event-form');
const eventsContainer = document.getElementById('events-container');

//Funcion para guardar el evento
const saveEvent = (sport, direction, description) => {
  db.collection('events').doc().set({   //Peticion asincrona que me devuelve una respuesta, se crea la coleccion en Firestore
    sport,
    direction,
    description
  })
}

//Funcion para obtener los eventos
const getEvents = () => db.collection('events').get();

window.addEventListener('DOMContentLoaded', async (evento) => {
  const querySnapshot = await getEvents(); //QuerySnapshot contiene los resultados de una consulta, segun documentacion. Un objeto que se puede recorrer.
  querySnapshot.forEach(doc => {
    console.log(doc.data());
    const event = doc.data();
    eventsContainer.innerHTML += `<div class= "card card-body mt-2 border-primary">
      <h3 class="h5">${event.sport}</h3>
      <p>${event.direction}</p>
      <p>${event.description}</p>
      <div>
        <button class="btn btn-primary">Eliminar</button>
        <button class="btn btn-secondary">Editar</button>      
      </div>
    </div>`
  })
})

eventForm.addEventListener('submit', async evento => {
  evento.preventDefault();

  const sport = eventForm['event-sport'];
  const direction = eventForm['event-direction'];
  const description = eventForm['event-description'];

  await saveEvent(sport.value, direction.value, description.value); 
  
  eventForm.reset();
  sport.focus();  
  
})