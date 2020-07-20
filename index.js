const db = firebase.firestore();

const eventForm = document.getElementById('event-form');
const eventsContainer = document.getElementById('events-container');

let editStatus = false;

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

const getEvent = (id) => db.collection('events').doc(id).get();

const onGetEvents = (callback) => db.collection('events').onSnapshot(callback);

const deleteEvent = id => db.collection('events').doc(id).delete();

window.addEventListener('DOMContentLoaded', async (evento) => {
  onGetEvents((querySnapshot) => {  //QuerySnapshot contiene los resultados de una consulta, segun documentacion. Un objeto que se puede recorrer.
    eventsContainer.innerHTML = '';
    querySnapshot.forEach(doc => {
      const event = doc.data();
      event.id = doc.id;
      console.log(event);


      eventsContainer.innerHTML += `<div class= "card card-body mt-2 border-primary">
        <h3 class="h5">${event.sport}</h3>
        <p>${event.direction}</p>
        <p>${event.description}</p>
        <div>
          <button class="btn btn-primary btn-delete" data-id="${event.id}">Eliminar</button>
          <button class="btn btn-secondary btn-edit" data-id="${event.id}">Editar</button>      
        </div>
      </div>`

      const btnsDelete = document.querySelectorAll('.btn-delete');
      btnsDelete.forEach(btn => {
        btn.addEventListener('click', async (evento) => {
          await deleteEvent(evento.target.dataset.id);
        })
      }) 
      
      const btnsEdit = document.querySelectorAll('.btn-edit');
      btnsEdit.forEach(btn => {
        btn.addEventListener('click', async (evento) => {
          const doc = await getEvent(evento.target.dataset.id);
          const event = doc.data();
           eventForm['event-sport'].value = event.sport;
           eventForm['event-direction'].value = event.direction;
           eventForm['event-description'].value = event.description;
        })
      })

    });
  });
});

  eventForm.addEventListener('submit', async evento => {
  evento.preventDefault();

  const sport = eventForm['event-sport'];
  const direction = eventForm['event-direction'];
  const description = eventForm['event-description'];

  await saveEvent(sport.value, direction.value, description.value);
  
  await getEvents();
  
  eventForm.reset();
  sport.focus();  
  
})