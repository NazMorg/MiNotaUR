/*** MINOTAUR: APLICACION DE NOTAS SIMPLE ***/
/*** QuerySelectors para nueva nota y popup(general) ***/
const nuevaNota = document.querySelector(".nuevaNota");
const cajaPopup = document.querySelector(".cajaPopup");
const tituloPopup = cajaPopup.querySelector("header h1");
const iconoCerrar = cajaPopup.querySelector("header i");
const btnAgregar = cajaPopup.querySelector("button");
const tituloForm = cajaPopup.querySelector("input");
const cuerpoForm = cajaPopup.querySelector("textarea");
const cajaNota = document.querySelector(".contenedor")


/*** Array para cargar o almacenar notas ***/
let notas = JSON.parse(localStorage.getItem("notas")) ?? [];


/*** EventListeners para control del popup ***/
nuevaNota.addEventListener("click", () => {
    tituloForm.focus();
    cajaPopup.classList.add("mostrar");
});

iconoCerrar.addEventListener("click", () => {
    actualizado = false;
    tituloForm.value = "";
    cuerpoForm.value = "";
    tituloPopup.innerText = "Agregar Nueva Nota...";
    cajaPopup.classList.remove("mostrar");
});


/*** Funcion mostrarNotas ***/
function mostrarNotas() {
    document.querySelectorAll(".nota").forEach(nota => nota.remove());
    notas.forEach((nota, index) => {
        const li = document.createElement("li");
        li.classList.add("nota");
        li.innerHTML = `
                        <div class="cuerpoNota">
                            <p>${nota.titulo}</p>
                            <span>${nota.cuerpo}</span>
                        </div>
                        <div class="bajoNota">
                            <span>${nota.fecha}</span>
                            <div class="desplegable">
                                <i onclick="mostrarMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="editarNota(${index}, '${nota.titulo}', '${nota.cuerpo}')"><i class="uil uil-pen"></i>Editar</li>
                                    <li onclick="borrarNota(${index})"><i class="uil uil-trash"></i>Borrar</li>
                                </ul>
                            </div>
                        </div>`
        cajaNota.appendChild(li);
    });
};


/*** Variables para control de edicion o modificacion del usuario ***/
let actualizado = false, actualizadoId;

/*** Funcion editarNota ***/
function editarNota(idNota, titulo, cuerpo) {
    actualizado = true;
    actualizadoId = idNota;
    nuevaNota.click();
    tituloForm.value = titulo;
    cuerpoForm.value = cuerpo;
    tituloPopup.innerText = "Editar Nota...";
};


/*** Funcion borrarNota ***/
function borrarNota(idNota) {
    notas.splice(idNota, 1);
    localStorage.setItem("notas", JSON.stringify(notas));
    mostrarNotas();
};

/*** Funcion mostrarMenu ***/
function mostrarMenu(elem) {
    elem.parentElement.classList.add("mostrarDesplegable");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("mostrarDesplegable");
        };
    });
};

/*** EventListener nuevaNota***/
btnAgregar.addEventListener("click", e => {
    e.preventDefault();
    let tituloNota = tituloForm.value;
    let cuerpoNota = cuerpoForm.value;

    //Condicion nota vacia
    if (tituloNota && cuerpoNota) {
        const fechaNota = new Date().toLocaleDateString();
        const nota = {
            titulo: tituloNota,
            cuerpo: cuerpoNota,
            fecha: fechaNota
        }
        if (!actualizado) {
            notas.push(nota);
        } else {
            actualizado = false;
            notas[actualizadoId] = nota;
        };
        localStorage.setItem('notas', JSON.stringify(notas));
        iconoCerrar.click();
        mostrarNotas();
    } else {
        //Notificacion sobre nota vacia con SweetAlert
        Swal.fire({
            title: 'Error!',
            text: 'Todos los campos deben estar llenos para guardar la nota!',
            icon: 'error',
            color: '#042A2B',
            background: '#CDEDF6',
            confirmButtonText: 'Continuar'
        });
    };
});

/*** Funcion cargarNotas ***/
async function cargarNotas() {
    const res = await fetch('../notas.json');
    const notasPrecargadas = await res.json();
    if (notas.length > 0) {
        mostrarNotas();
    } else {
        notas = notasPrecargadas;
        notas.forEach((nota) => {
            mostrarNotas();
        });
       
    };
};


cargarNotas();
