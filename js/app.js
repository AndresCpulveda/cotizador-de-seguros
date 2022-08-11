//Variable
const form = document.querySelector('#cotizar-seguro');
const result = document.querySelector('#resultado');

//Event listener
document.addEventListener('DOMContentLoaded', () => {
    ui.fillYears();

})
form.addEventListener('submit', cotizar);

//Constructors
function Seguro(marca, year, tipo) {
    this.marca = marca,
    this.year = year,
    this.tipo = tipo
}

function UI() {}

//Instanciar UI
const ui = new UI();

//Prototype that fills the years options
UI.prototype.fillYears = ()=> {
    //Gets the current date's year
    const max = new Date().getFullYear();
    const min = max - 20;
    
    const year = document.querySelector('#year')

    //Uses a loop to fill the html options 20 years back from the current year
    for(let i = max; i > min; i--) {
        let option = document.createElement('option')
        option.value = i;
        option.textContent = i;
        year.appendChild(option);
    }    
}    

//Prototype that shows a message when the form is submitted, receives a parameter for the message and for the type of message (error or correcto)
UI.prototype.showMessage = (message, type) => {
    const div = document.createElement('div');
    //Assing styles to the message according to the type
    if(type == 'error'){
        div.classList.add('error');
    } else {
        div.classList.add('correcto')
        //Shows an spinner animation for 3 seconds
        const spinner = document.querySelector('#cargando')
        spinner.classList.remove('hidden')
        setTimeout( ()=> {
            spinner.classList.add('hidden')
        }, 3000)
    }
    //Adds the message 
    div.classList.add('mensaje', 'mt-10')
    div.textContent = message;
    form.insertBefore(div, result);
    setTimeout( () => {
        div.remove();
    }, 3000)
}


//Prototype that calculates the cost of the insurance based on the selected options
Seguro.prototype.quoteInsurance = function() {

    let precio;
    const base = 2000; //Base price of the insurance
    //Calculates the increase according to the selected option in marca
    switch(this.marca){
        case "1":
            precio = base * 1.15;
            break;
        case "2":
            precio = base * 1.05;
            break;
        case "3":
            precio = base * 1.35;
            break;
        default:
            break;
    }        

    const yearsOld = new Date().getFullYear() - this.year;

    //Increases by 3% the cost of the insurance for every additional year since released
    precio -= (precio * (yearsOld * 3 / 100));
    
    //Increases the cost of the insurance depending on the type selected
    if(this.tipo == "basico") {
        precio *= 1.30;
    }else{
        precio *= 1.50;
    }    
    console.log(precio);
    return precio;
}    

//Functions
//Collects the selected values from the options and validates them
function cotizar(e) {
    e.preventDefault();

    const marca = document.querySelector('#marca').value;

    const year = parseInt(document.querySelector('#year').value);

    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    //If form isnt valid calls error message
    if(marca == '' || year == '' || tipo == ''){
        ui.showMessage('Llena todos los campos para obtener un resultado', 'error');
        return;
    }
    //If form is valid calls cotizando message
    ui.showMessage('Cotizando...', 'correcto');

    //Instantiates the seguro object with the data collected
    const seguro = new Seguro(marca, year, tipo);
    seguro.quoteInsurance(); //Calls prototype with the data from the seguro object
    ui.showResult(seguro, seguro.quoteInsurance()); //Calls prototype using the return of the previous prototype as parameter
}

//Shows a box message with the data of the seguro and the calculated insurance
UI.prototype.showResult = function(seguro, precio) {
    cleanHTML();
    //Creates a message based on the selected data and shows it after 3 seconds when the spinner is hidden
    setTimeout( ()=> {
        let textoMarca;
        switch(seguro.marca){
            case '1':
                textoMarca = 'Americano'
                break;
            case '2':
                textoMarca = 'Asiatico'
                break;
            case '3':
                textoMarca = 'Europeo'
                break;
            default:
                break;
        }
    
        const resultMessage = document.createElement('div')
        resultMessage.innerHTML = `
        <p class='header'>Tu resumen</p> 
          <p>Marca: ${textoMarca}</p>
          <p>Año: ${seguro.year}</p>
          <p>Tipo: ${seguro.tipo}</p>
          <p>Total: $${precio}</p>
        `
        result.classList.add('mt-10')
        result.appendChild(resultMessage)
    }, 3000)
};

//Cleans the HTML of the result div
function cleanHTML() {
    while(result.firstChild){
        result.removeChild(result.firstChild);
    }
}