let pagina = 1;

//instaciamos una variable para la seccion de resumen
const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
};

document.addEventListener('DOMContentLoaded', function() {
    iniciaraApp();
});

function iniciaraApp() {
    showServicios();


    // Resalta el DIV actual segun el tab al que se presiona
    mostrarSeccion();


    // Ocualta o muestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    // Funciones de la seccion de paginacion
    // Pagina siguiente 
    paginaSiguiente();

    // Pagina anterior
    paginaAnterior();

    // Comprueba la pagina actual para ocultar o mostrar la paginacion

    botonesPaginador();

    // Muestra el resumen de la cita (o mensage de error en caso de no pasar la validacion
    // instaciamos una funcion para mostrarResumen() o mensaje de error  caso de pasaar la validacion para la seccion de cita
    mostrarResumen();

    // instaciamos una funcion para nombrecita que almacenara lo que introduzcamos en el input  de nombre
    nombreCita();

    // instaciamos una funcion para fechaCita que almacenara lo que introduzcamos en el input de fecha  
    fechaCita();

    // Desabitar dias pasados 
    deshabilitarFechaAnterior();

    //Almacenar hora 
    horaCita();

}

function mostrarSeccion() {

    // Aquí se ha modificado el codigo de la funcion cambiarSeccion() con la variable seccion y con la clase mostrar-seccion
    // Agrega mostrar-seccion donde dimos click
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Aquí se ha modificado el codigo de la funcion cambiarSeccion() con la variable tab y las clases .tab y actual
    // Eliminar la clase actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }

    // Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);
            mostrarSeccion();
            botonesPaginador();
        });
    });
}

async function showServicios() {
    // utilizamos el try catch cuando haya errores en tu aplicacion

    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const { servicios } = db;
        // Generar el HTML
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio; //este es un distroctorin de varias variables.

            // Generar nombre de servicio
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');

            const precioServicio = document.createElement('P');
            precioServicio.textContent = ` ${precio} XAF`;
            precioServicio.classList.add('precio-servicio');

            // Gemerar div contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList = ('servicio');
            servicioDiv.dataset.idServicio = id;
            // selecciona un servicio para la cita

            servicioDiv.onclick = seleccionarServicio;

            // Inyectar precio y nombre al div de servicio
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            console.log(servicioDiv);

            // Inyectar el id servicios en el HTML  

            document.querySelector('#servicios').appendChild(servicioDiv);
        });
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    console.log(e.target.tagName); // hace que el evento se propague a todos los hijos de una etiqueta.

    let elemento;
    // Forzar que el elemento el cual le damos click sea el DIV 
    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement;

    } else {
        elemento = e.target;
    }

    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');
        console.log(elemento.dataset.idServicio);
        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');
        //funcion que manda llamar un servicio en la seccion de servicios
        //console.log(elemento.nextElementSibling.textContent);
        // la funcion firstElementChild recorre el DOMContent, se llaman travers in the DOM en busca del primer elemento o elemento hijo
        // la fucion nextElementSibling recorre segundos elementos o elementos no hijos
        const servicioOBJ = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        };

        // console.log(servicioOBJ); //revisa si se muestra toda la informacion
        agregarServicio(servicioOBJ);
    }
}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
    console.log(cita);
    // filter es un arr ay metode
}

function agregarServicio(servicioOBJ) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioOBJ];
    // cita lee lo que contiene el arreglo de servicios instanciada como variable global a inicios del codigo
    // los tres puntos son para copiar un arreglo o un objeto dentro de una nueva variable arreglo u objeto
    console.log(cita);
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;

        // console.log(pagina);

        botonesPaginador();
    });

}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;

        // console.log(pagina);

        botonesPaginador();
    });

}

function botonesPaginador() {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); //Estamos en la pagina 3, carga el resumen de la cita

    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion(); //manda llamar esta funcion y cambia el contenido
}

function mostrarResumen() {
    //    Distructoring
    const { nombre, fecha, hora, servicios } = cita;
    // Validacion de Objetos

    // Generamos selectores para seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    if (Object.values(cita).includes('')) {

        // Generamos contenido para la seccion de Resumen
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';
        noServicios.classList.add('invalidar-cita');

        // Agregar a resumen Div
        resumenDiv.appendChild(noServicios);

        return;
    }

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';
    // Mostrar resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = ` <span> Fecha: </span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const servicioCita = document.createElement('DIV');
    servicioCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    servicioCita.appendChild(headingServicios);

    let cantidad = 0;

    servicios.forEach(servicio => {

        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('XAF');

        cantidad += parseInt(totalServicio[1].trim());

        // colocar texto y precio en el div
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        servicioCita.appendChild(contenedorServicio);


    });

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(servicioCita);
    // console.log(nombrecita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar: </span> ${cantidad} XAF`;

    resumenDiv.appendChild(cantidadPagar);
}


function nombreCita() {
    const nombreInput = document.querySelector('#nombre');

    nombreInput.addEventListener('input', e => {
        // cuando solo hay un valor colocamos solo e en lugar de poner el parentesis
        const nombreTexto = e.target.value.trim();
        // trim() es una funcion que elimina el espacio al principio y al final del texto cuando se muestra en consola. Junto con sus dos otras versiones trimStart y trimEnd que realizan la mismas funciones particular y respectivamente


        // Validar el contenido del texto no vacio

        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre no valido', 'error');
            // nombreImput.value = '';
        } else {
            const alerta = document.querySelector('.alerta'); //leemos en tiempo real para que si pasa la validacion de los tres segundos definidos al final se revalide el input de nuevo
            if (alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;
            // console.log(cita);
        }
    });
}

function mostrarAlerta(mensaje, tipo) {
    // verificar si hay una alerta previa, entonces no crear otra.
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) { //cuand detecta una alerta no se lee el codigo de abajo
        return;
    }

    // Creamos una alerta que se mostrara cuando el nombre introducido no es valido
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    // Insertar la alerta en el HTML 
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);


    // Eliminar la alerta despues de tres segundos
    // podemos utilizar las funcines setTimeout(espera una cantidad de tiempo y ejecuta la funcion)  o set interval(espera y en el intervalo definido ejecuata la funcion hasta que se acabe el tiempo)

    setTimeout(() => {
        alerta.remove();
    }, 3000);

}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        console.log(e.target.value);

        // los valores de fecha aparecen en formato texto, para transformalo a formato fecha utilizamos a funcion(Date) y el metodo(new)

        const dia = new Date(e.target.value).getUTCDay(); //getUTCDay es una funcion que contabiliza los dias de 0(dimingo) a 6(sabado) 
        // console.log(dia);

        if ([0, 6].includes(dia)) { //evaluar la seleccion de sabado o domingo como dia no laboral
            e.preventDefault();
            fechaInput.value = ''; //resetea el valor por defecto
            mostrarAlerta('Fines de semana no validos', 'error');
        } else {
            cita.fecha = fechaInput.value;

            console.log(cita);
        }


        /** Este codigo muestra como visualizar la fecha en consola, modificarla al formato local y editar sus opciones(dia, mes, año) */
        // const opciones = { //opciones para la funcion de tolocaleDateString
        //     weekday: 'long',
        //     year: 'numeric',
        //     month: 'long'
        // };
        // console.log(dia.toLocaleDateString('es-ES', opciones));
        // // tolocaleDateString convierte la fecha a la hora de la zona que introduzcas
    });
}

function deshabilitarFechaAnterior() { /**corregir error de fecha*/
    const inputFecha = document.querySelector('#fecha');
    const fechAhora = new Date();
    const yyyy = fechAhora.getFullYear();
    const mm = fechAhora.getMonth() + 1;
    const dd = fechAhora.getDate() + 1;
    // formato deseo: AAAA:MM:DD
    const DisableActualDate = `${yyyy}-${mm}-${dd}`;
    // console.log(DisableActualDate);
    inputFecha.min = DisableActualDate;

}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if (hora[0] < 10 || hora[0] > 18) {
            mostrarAlerta('Hora no válida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
        } else {
            cita.hora = horaCita;

            console.log(cita);
        }
    });
}