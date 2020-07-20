const db = firebase.firestore(); //con el script se importo la variable global firebase.firestore.

const eventForm = document.getElementById("event-form");
const eventsContainer = document.getElementById("events-container");

let editStatus = false; //variable que almacena el estado de la aplicacion (editar o guardar)
let id = "";

//Funcion para guardar el evento
const saveEvent = (sport, direction, description) => {
  db.collection("events").doc().set({
    //Peticion asincrona que me devuelve una respuesta, se crea la coleccion en Firestore con el nombre events.
    sport,
    direction,
    description, //set de datos que se van a guardar en firebase
  });
};

//FUNCIONES DE FIREBASE
//Funcion para obtener todos los eventos de Firebase
const getEvents = () => db.collection("events").get();

//Obtener el evento por id
const getEvent = (id) => db.collection("events").doc(id).get();

//Cada ves que un dato cambie, se va a manejar con una funcion (onSnapshot)
const onGetEvents = (callback) => db.collection("events").onSnapshot(callback);

//Eliminar una tarea por id
const deleteEvent = (id) => db.collection("events").doc(id).delete();

//Actualizar un evento por id y los nuevos campos del evento
const updateEvent = (id, updatedEvent) =>
  db.collection("events").doc(id).update(updatedEvent);

window.addEventListener("DOMContentLoaded", async (evento) => {
  //Cuando carga el navegador
  onGetEvents((querySnapshot) => {
    eventsContainer.innerHTML = "";
    querySnapshot.forEach((doc) => {
      //QuerySnapshot contiene los resultados de una consulta, segun documentacion. Un objeto que se puede recorrer.
      const event = doc.data(); //doc.data() Devuelve los datos de cada evento
      event.id = doc.id; //llamar de doc la propiedad del id para visualizar el id de cada boton
      console.log(event);

      //template para añadir los eventos guardados y poder visualizarlos
      eventsContainer.innerHTML += `<div class= "card card-body mt-2 border-primary">
        <h3 class="h5">${event.sport}</h3>
        <p>${event.direction}</p>
        <p>${event.description}</p>
        <div>
          <button class="btn btn-primary btn-delete" data-id="${event.id}">Eliminar</button>  
          <button class="btn btn-secondary btn-edit" data-id="${event.id}">Editar</button>      
        </div>
      </div>`; //data-id propiedad de html

      const btnsDelete = document.querySelectorAll(".btn-delete");
      btnsDelete.forEach((btn) => {
        btn.addEventListener("click", async (evento) => {
          await deleteEvent(evento.target.dataset.id); //con dataset puedo traer el id de cada boton
        });
      });

      const btnsEdit = document.querySelectorAll(".btn-edit");
      btnsEdit.forEach((btn) => {
        btn.addEventListener("click", async (evento) => {
          const doc = await getEvent(evento.target.dataset.id);
          const event = doc.data(); //traer datos del evento para poder editar
          editStatus = true;
          id = doc.id;
          //Mostrar los datos del evento en el formulario para poder editar
          eventForm["event-sport"].value = event.sport;
          eventForm["event-direction"].value = event.direction;
          eventForm["event-description"].value = event.description;
          eventForm["btn-event-form"].innerHTML = "Actualizar";
        });
      });
    });
  });
});

eventForm.addEventListener("submit", async (evento) => {
  evento.preventDefault(); //Evitar refrescar la pagina

  const sport = eventForm["event-sport"]; // Traer los que esta en el input event-sport
  const direction = eventForm["event-direction"];
  const description = eventForm["event-description"];

  //Validacion del estado de la aplicacion
  if (!editStatus) {
    await saveEvent(sport.value, direction.value, description.value);
  } else {
    await updateEvent(id, {
      sport: sport.value,
      direction: direction.value,
      description: description.value,
    });
    editStatus = false;
    id = "";
    eventForm["btn-event-form"].innerHTML = "Publicar";
  }

  await getEvents();

  eventForm.reset();
  sport.focus();
});
