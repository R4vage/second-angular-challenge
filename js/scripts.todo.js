
  /* En esta variable se storea la lista completa de tareas */
let currentlyShownTasks = [] /* Esta variable es para storear los tasks que el usuario está viendo */
let currentSortBy = ['id', true]

const taskList = document.getElementById('js-task-list__table__body')
const taskModal = document.getElementById('js-task-modal')
const taskForm = document.getElementById('js-add-task__form')
const tableWarning = document.getElementById('js-task-list__warning')
const tableNoResults = document.getElementById('js-task-list__warning--no-results')


/* Funciones para abrir y cerrar el modal para agregar/modificar gastos */

function closeModal(){taskModal.style.display = 'none'}
function openModal(){taskModal.style.display = 'flex'}

/* Classes  */

class Storage {
    constructor (key){
        this.key = key
        if(!JSON.parse(localStorage.getItem(key)) || JSON.parse(localStorage.getItem(key)).length === 0){
            this.value = []
        } else {
            this.value = JSON.parse(localStorage.getItem(key))
        }
        
    }

    getStorageKey(){
        return JSON.parse(localStorage.getItem(key))
    }

    setStorageKey(value){
        this.value = value
        localStorage.setItem(key, JSON.stringify(value)) 
    }

    removeItem(id){
        let removedItemIndex = this.value.findIndex(element => element.id === id)
        this.value.splice(removedItemIndex, 1)
        localStorage.setItem(this.key, JSON.stringify(this.value))
    }

    modifyItem(index, newItem){
        this.value[index] = newItem
        localStorage.setItem(this.key, JSON.stringify(this.value))
    }

    addItem(task){
        this.value.push(task)
        localStorage.setItem(key, JSON.stringify(this.value))   
    }

    getItemsCount(){
        return this.value.length
    }

    getLastId(){
        return parseInt(this.value[this.value.length-1].id)
    }

    getItemIndex(id){
        return this.value.findIndex(element => element.id === id)
    }

}

let taskStorage = new Storage('tasks')
let tasks = taskStorage.value

/* Funcion para agregar una fila a la lista de tareas */

function createNewRow(task) {
    
    /* Este es el padre de la fila */

    let newTr = document.createElement('tr') 
    newTr.className= `task-list__row`
    newTr.id= `js-task-row-${task.id}`

    /* Acá se agregan los datos */
    
    for (const prop in task){ 
        let td = document.createElement('td')
        td.innerText = task[prop]
        newTr.appendChild(td)
    }
    /* Agregamos un contenedor para los iconos */
    
    let newDiv = document.createElement('div') 
    newDiv.className= `task-list__row__icons`
    
    /* Agregamos el boton de eliminar */

    let newImg = document.createElement('img') 
    newImg.className=`task-item-${task.id}--delete`
    newImg.src='assets/delete.png'

    newImg.onclick = function (){
        taskStorage.removeItem(task.id)
        newTr.remove()
        if (taskStorage.getItemsCount() === 0){
            tableWarning.style.display = 'block'
        } else if (taskList.childElementCount === 0){
            tableNoResults.style.display = 'block'
        }
    }

    newDiv.appendChild(newImg)

    /* Agregamos el boton de editar */

    newImg = document.createElement('img')
    newImg.className=`task-item-${task.id}--edit`
    newImg.src='assets/edit.png'

    newImg.onclick = function (){
        openModal()
        listTask = document.getElementById(`js-task-row-${task.id}`).childNodes
        taskForm.elements['id'].value = task.id
        taskForm.elements['name'].value = listTask[1].innerText
        taskForm.elements['asignee'].value = listTask[2].innerText
        taskForm.elements['status'].value = listTask[3].innerText
        taskForm.elements['submit'].value = "Modify Task"
    }

    newDiv.appendChild(newImg)
    newTr.appendChild(newDiv)
    taskList.appendChild(newTr)
}

/* Función para mapear un array y remplazar la lista actual */

function replaceTaskList (tasks){
    taskList.innerHTML = ''
    tasks.forEach(task => {
        createNewRow(task);
    });
}


/* Primer seteo de tasks. Checkeamos si hay tareas guardadas en la localStorage */

if(!taskStorage.value || taskStorage.getItemsCount() === 0){
    tableWarning.style.display = 'block'
} else {
    replaceTaskList(taskStorage.value)
    currentlyShownTasks = taskStorage.value.slice(0)
    tableWarning.style.display = 'none'
}


/* Sección para botones de abrir y cerrar el modal */

const openModalButton = document.getElementById('js-open-task-modal'); /* Botón de agregar tarea */

const closeModalButton = document.getElementById('js-close-task-modal'); /* Cross para cerrar modal */

openModalButton.onclick = function (){
    taskForm.elements['submit'].value = "Add Task"
    if (taskStorage.getItemsCount() === 0) {
        taskForm.elements['id'].value = 1
    } else {
        taskForm.elements['id'].value = taskStorage.getLastId() +1 
    }
    taskForm.elements['name'].value = ''
    taskForm.elements['asignee'].value = 'Not Asigned'
    taskForm.elements['status'].value = 'Pending'
    openModal()

}

window.onclick = function(event) { /* Al clickear afuera del modal, se cierra */
    if (event.target === taskModal) {
        closeModal()
    }
}

closeModalButton.onclick = function (){closeModal()}



/* Seccion para agregar tasks */



taskForm.addEventListener('submit', (event) => {
    event.preventDefault()
    let searchValue = searchInput.value.toLowerCase()
    let selectValue = statusSelect.value
    let date
    let task
    let name = taskForm.elements['name'].value
    let asignee = taskForm.elements['asignee'].value
    let status = taskForm.elements['status'].value
    let id = taskForm.elements['id'].value

    taskIndex = taskStorage.getItemIndex(id)
    /* Este submit es para el caso en que se este modificando una tarea que ya existe */
    if (taskIndex !== -1){
        date = taskStorage.value[taskIndex].time
        task = {id:id, name:name,asignee:asignee, status:status, time: date}
        taskStorage.modifyItem(taskIndex, task)

        listTask = document.getElementById(`js-task-row-${task.id}`)
        listTask.childNodes[1].innerText = name
        listTask.childNodes[2].innerText = asignee
        listTask.childNodes[3].innerText = status
   
        /* Aca me aseguro de mostrar el task en la lista solo si esta dentro de las opciones de filtro, y ordeno la lista si hace falta */
        if((selectValue === 'All' || selectValue === status) 
        && (searchValue === '' || name.toLowerCase().includes(searchValue))){
            /* Si hubo cambio de nombre, y el currentSortBy esta realizado por nombre, hay que sortear la lista nuevamente */
           
            if(currentSortBy[0]==='name'){
                currentlyShownIndex = currentlyShownTasks.findIndex(task => task.id === id)
                currentlyShownTasks[currentlyShownIndex] = task
                sortBy(currentSortBy[0],currentSortBy[1], currentlyShownTasks)
                replaceTaskList(currentlyShownTasks)
            }
        } else {
            /* Si el task modificado no entra dentro de las opciones de filtrado, debemos removerlo de la lista */
            listTask.remove()
        }
    } else {
    /* Este submit es cuando el usuario desea agregar una tarea nueva */

        date = new Date().toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})
        task = {id:id, name:name,asignee:asignee, status:status, time: date}
        taskStorage.addItem(task)
        if((selectValue === 'All' || selectValue === status) 
        && (searchValue === '' || name.toLowerCase().includes(searchValue))){
            createNewRow(task)
            tableNoResults.style.display = 'none'
        } /* Lo agregamos también a la lista, si cumple con los parametros de búsqueda, para no tener que recargar la página */
    }
    tableWarning.style.display = 'none'
 

    closeModal()
    
})

/* SECCIÓN DE FILTROS */

const searchInput = document.getElementById('js-task-list__search__input')
const searchButton = document.getElementById('js-task-list__search__button')
const statusSelect = document.getElementById('js-task-list__filters__status__select')
const clearFiltersButton = document.getElementById('js-task-list__filters__cross')


/* Sección para busqueda de tasks */

function searchTasks (){
    let searchValue = searchInput.value.toLowerCase()
    let selectValue = statusSelect.value
    if( selectValue === 'All') {
        if(searchValue === '') {
            clearFiltersButton.style.display = 'none'
        } else {
            currentlyShownTasks = tasks.filter(element => element.name.toLowerCase().includes(searchValue))
            clearFiltersButton.style.display = 'block'
        }
        
    } else {
        clearFiltersButton.style.display = 'block'
        currentlyShownTasks = tasks.filter(element => element.status === selectValue && element.name.toLowerCase().includes(searchValue))
    }
    if (currentlyShownTasks.length === 0 ){
        clearFiltersButton.style.display = 'block'
        tableNoResults.style.display = 'block'
        replaceTaskList([])
    } else {
        tableNoResults.style.display = 'none'
        replaceTaskList(currentlyShownTasks)
    }
}

searchButton.onclick = function (){ searchTasks()}

/* Por si el usuario presiona enter estando en el input */

searchInput.addEventListener ( "keydown", function (e){
    if (e.code === "Enter") {
        searchTasks()
    }
})

/* Filtro de tasks por estado */

statusSelect.onchange = function (){
    let selectValue = statusSelect.value
    let searchValue = searchInput.value.toLowerCase()
    if (searchValue === '') {
        if (selectValue === 'All') {
            currentlyShownTasks = tasks.slice(0)
            clearFiltersButton.style.display = 'none'
        } else {
            currentlyShownTasks = tasks.filter(element => element.status === selectValue)
            clearFiltersButton.style.display = 'block'
        }
    } else {
        clearFiltersButton.style.display = 'block'
        if (selectValue === 'All') {
            currentlyShownTasks = tasks.filter(element => element.name.toLowerCase().includes(searchValue))
        } else {
            currentlyShownTasks = tasks.filter(element => element.status === selectValue && element.name.toLowerCase().includes(searchValue))
        }
    }
    if (currentlyShownTasks.length === 0 ){
        clearFiltersButton.style.display = 'block'
        tableNoResults.style.display = 'block'
        replaceTaskList([])
    } else {
        clearFiltersButton.style.display = 'block'
        tableNoResults.style.display = 'none'
        replaceTaskList(currentlyShownTasks)
    }
    
    
}

/* Limpiar los filtros */

function cleanFilters(){
    currentSortBy = ['id', true]
    searchInput.value = ''
    statusSelect.value = 'All'
    replaceTaskList(tasks)
}

clearFiltersButton.onclick = function(){ 
    cleanFilters()

    if(taskStorage.getItemsCount < 0){
        clearFiltersButton.style.display = 'none'
        tableNoResults.style.display = 'none'
    } else {
        tableNoResults.style.display = 'block'
    }
}


/* Funcionalidad de SortBy */
const sortByButtons = document.querySelectorAll('.js-sortBy-buttons')

function sortBy (sorter, isAsc, toBeSorted){

    toBeSorted.sort((a,b) => {
        let varA
        let varB
        if (sorter === 'name'){    
            varA = a.name.toLowerCase();
            varB = b.name.toLowerCase();
        } else if (sorter === 'time') {
            varA = new Date(a.time).getTime()
            varB = new Date(b.time).getTime()
        } else if (sorter ==='id'){
            varA = parseInt(a.id)
            varB = parseInt(b.id)
        }
        if (isAsc){
            if (varA < varB) {
            return -1;
            }
            if (varA > varB){
            return 1
            }
        } else {
            if (varA < varB) {
                return 1;
            }
            if (varA > varB){
                return -1
            }
        }
        return 0
    })


}

/* Function para los botones de sortBy */
function clickSortByButtons(elementId){
    let stringArray = elementId.split('-')
    let isAsc = stringArray[3] === 'true'
    sortBy(stringArray[2], isAsc, currentlyShownTasks)    
    currentSortBy = [stringArray[2], isAsc]
    replaceTaskList(currentlyShownTasks)
}

sortByButtons.forEach(button => button.onclick = function (){clickSortByButtons(this.id)})

