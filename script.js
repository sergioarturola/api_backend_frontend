//NOTA HACER QUE ESTAS FUNCIONES PUEDAN IMPORTARSE DE OTRO ARCHIVO

function abrirFormulario(){
    const htmlModal = document.getElementById("modal");
    htmlModal.setAttribute("class", "modal opened");
  }

function cerrarModal(){
    const htmlModal = document.getElementById("modal");
    htmlModal.setAttribute("class", "modal");
  }


/*
NOTA: La direccion de la API se encuentra en 
https://localhost:7162
GET -> /api/customer
*/

//para que cuando se carge el documento se inicie la funcion
document.addEventListener("DOMContentLoaded", init);
const URL_API = 'https://localhost:7162/api/'
//vamos a crear una variable global para poder obtener cada "customer" por su id
//SOLO PARA EJEMPLO RECUERDA QUE ES MALA PRACTICA TENER VARIABLES GLOBALES
var customersLista = [];

function init(){
    search();
}

//funcion para que el formulario se limpie y no queden campos llenos

function clean(){
    document.getElementById("txtId").value =  '';
    document.getElementById("txtFirstname").value = '';
    document.getElementById("txtLastname").value = '';
    document.getElementById("txtEmail").value = '';
    document.getElementById("txtPhone").value = '';      
    document.getElementById("txtAddress").value = '';
}

function agregar(){
    clean();
    abrirFormulario();
}

//usaremos funciones asincronas para treaer la informacion desde el backend

//-- GET------------------------
async function search(){

    let url =  URL_API + 'customer';
    let response = await fetch(url, {
        "method" : 'GET',
        "headers" : {
            "Content-Type" : "application/json"
        }
    });

    //let result = await response.json(); sustituimos esto por el array
    customersLista = await response.json(); 

    let html = ''; //iniciando una cadena vacia

    //con un ciclo for llenamos la tabla
    for(customer of customersLista){
        let row = `
        <tr>
        <td>${customer.firstName}<td>
        <td>${customer.lastName}<td>
        <td>${customer.email}<td>
        <td>${customer.phone}<td>
        <td>${customer.adress}<td>
        <td>
            <a class="button-editar" onclick="edit(${customer.id})">Editar</a>
            <a class="button-eliminar" onclick="remove(${customer.id})">Eliminar</a>
        </td>    
        `

        html = html + row;
    }

    document.querySelector('#customer > tbody').outerHTML = html;
}


//-- DELETE------------------------
async function remove(id){
    resp = confirm("Seguro que desea eliminar el registro???");
    
    if(resp){
       
        let url =  URL_API + 'customer/'+ id;
        let response = await fetch(url, {
            "method" : 'DELETE',
            "headers" : {
                "Content-Type" : "application/json"
            }
        });

        console.log("ok elminado");
        window.location.reload();
    }

    
}


//-- PUT------------------------
function edit(id){
    
    abrirFormulario();
    //del array global buscamos el objeto con el id especifico
    let cu = customersLista.find(x => x.id == id);
    //ahora colocando la informacion en el formulario
    document.getElementById("txtId").value = cu.id;
    document.getElementById("txtFirstname").value = cu.firstName;
    document.getElementById("txtLastname").value = cu.lastName;
    document.getElementById("txtEmail").value = cu.email;
    document.getElementById("txtPhone").value = cu.phone;      
    document.getElementById("txtAddress").value = cu.adress;
    
}

//-- POST------------------------

async function save(){

        var id = document.getElementById("txtId").value;
        //guardamos los datos de un formulario en un objeto
        //el objeto DEBE SER EL MISMO QUE EL DEL ENDPOINT "POST" porque sino
        //marcara un error 400 (error del cliente) o sea los campos deben de
        //estar en el mismo orden
        let data = {
            "firstName" : document.getElementById("txtFirstname").value,
            "lastName"  : document.getElementById("txtLastname").value,
            "email" : document.getElementById("txtEmail").value,
            "phone" : document.getElementById("txtPhone").value,       
            "adress" : document.getElementById("txtAddress").value

        }

        //preguntando si hay id para diferenciar entre un post y un put

        if(id != ''){
             data.id = id;
        }
        let url =  URL_API + 'customer';
        let response = await fetch(url, {
            //CON EL OPERADOR TERNARIO VERIFICAMOS SI TIENE ID ENTONCES ES UN PUT SINO ES POST
            "method" : id != '' ? 'PUT' : 'POST',
            "body" : JSON.stringify(data), //hay que convertir el objeto "data" en string
            "headers" : {
                "Content-Type" : "application/json"
            }
        });

        window.location.reload();

    }

    
