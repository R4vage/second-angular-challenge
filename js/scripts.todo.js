let currentSortBy = ['id', true]



const taskForm = document.getElementById ('js-add-task__form')
const tableWarning = document.getElementById ('js-task-list__warning')
const tableNoResults = document.getElementById ('js-task-list__warning--no-results')

/* Classes  */

class Storage {
    constructor (key) {
        this.key = key
        if (!JSON.parse (localStorage.getItem (key)) || JSON.parse (localStorage.getItem (key)).length === 0) {
            this.value = []
        } else {
            this.value = JSON.parse (localStorage.getItem (key))
        }
    }

    getStorageKey () {
        return JSON.parse (localStorage.getItem (key))
    }

    setStorageKey (value) {
        this.value = value
        localStorage.setItem (key, JSON.stringify (value)) 
    }

    removeItem (id) {
        let removedItemIndex = this.value.findIndex (element => element.id === id)
        this.value.splice (removedItemIndex, 1)
        localStorage.setItem (this.key, JSON.stringify (this.value))
    }

    modifyItem (index, newItem) {
        this.value[index] = newItem
        localStorage.setItem (this.key, JSON.stringify (this.value))
    }

    addItem (task) {
        this.value.push (task)
        localStorage.setItem (this.key, JSON.stringify (this.value))   
    }

    getItemsCount () {
        return this.value.length
    }

    getLastId () {
        return parseInt (this.value[this.value.length-1].id)
    }

    getItemIndex (id) {
        return this.value.findIndex (element => element.id === id)
    }
}

class TaskList {
    constructor () {
        this.currentItems = taskStorage.value.slice (0)
    }

    setCurrentTasks (tasks) {
        this.currentItems = tasks
    }

    addTask (task) {
        this.currentItems.push (task)
    }

    modifyTask (id, task) {
        currentlyShownIndex = this.currentItems.findIndex (task => task.id === id)
        this.currentItems[currentlyShownIndex] = task
    }

    removeTask (id) {
        console.log (id)
        let taskIndex = this.currentItems.findIndex (task => task.id === parseInt (id))
        this.currentItems.splice (taskIndex,1)
    }

    searchTask (searchedName, searchedStatus) {
        let searchResults
        if (searchedName === '') {
            searchResults = taskStorage.value.slice (0)
        } else {
            searchResults = taskStorage.value.filter (element => element.name.toLowerCase().includes (searchedName))
        }

        if (searchedStatus !== 'All') {
            searchResults = searchResults.filter (element => element.status === searchedStatus)
        }
        this.currentItems = searchResults
    }

    sortTasks (sorter, isAsc) {
        this.currentItems.sort ( (a,b) => {
            let varA
            let varB
            if (sorter === 'name') {    
                varA = a.name.toLowerCase();
                varB = b.name.toLowerCase();
            } else if (sorter === 'time') {
                varA = new Date (a.time).getTime()
                varB = new Date (b.time).getTime()
            } else if (sorter ==='id') {
                varA = parseInt (a.id)
                varB = parseInt (b.id)
            }
            if (isAsc) {
                if (varA < varB) {
                return -1;
                }
                if (varA > varB) {
                return 1
                }
            } else {
                if (varA < varB) {
                    return 1;
                }
                if (varA > varB) {
                    return -1
                }
            }
            return 0
        })
    }
}

class Task {
    constructor (id, name, asignee, status, time) {
        this.id = id,
        this.name = name,
        this.asignee = asignee,
        this.status = status,
        this.time = time
    }
}

class UI {
    domTaskList = document.getElementById ('js-task-list__table__body')
    taskModal = document.getElementById ('js-task-modal')
    createNewRow (task) {
        let newTr = document.createElement ('tr') 
        newTr.className= `task-list__row`
        newTr.id= `js-task-row-${task.id}`
    
        /* Acá se agregan los datos */
        for (const prop in task) { 
            let td = document.createElement ('td')
            td.innerText = task[prop]
            newTr.appendChild (td)
        }
        
        let newDiv = document.createElement ('div') 
        newDiv.className= `task-list__row__icons`
        
        /* Agregamos el boton de eliminar */
        let newImg = document.createElement ('img') 
        newImg.className=`task-item-${task.id}--delete`
        newImg.src='assets/delete.png'

        newImg.onclick = function () {
            taskStorage.removeItem (task.id)
            taskList.removeTask (task.id)
            newTr.remove()
            if (taskStorage.getItemsCount() === 0) {
                tableWarning.style.display = 'block'
            } else if (this.domTaskList.childElementCount === 0) {
                tableNoResults.style.display = 'block'
            }
        }   

        newDiv.appendChild (newImg)

        /* Agregamos el boton de editar */
    
        newImg = document.createElement ('img')
        newImg.className=`task-item-${task.id}--edit`
        newImg.src='assets/edit.png'

        newImg.onclick = function () {
            userInterface.openModal()
            let listTask = document.getElementById (`js-task-row-${task.id}`).childNodes
            taskForm.elements['id'].value = task.id
            taskForm.elements['name'].value = listTask[1].innerText
            taskForm.elements['asignee'].value = listTask[2].innerText
            taskForm.elements['status'].value = listTask[3].innerText
            taskForm.elements['submit'].value = "Modify Task"
        }

        newDiv.appendChild (newImg)
        newTr.appendChild (newDiv)
        this.domTaskList.appendChild (newTr)
    }

    replaceTaskList (tasks) {
        this.domTaskList.innerHTML = ''
        tasks.forEach (task => {
            this.createNewRow (task);
        });
    }

    closeModal () {
        
        this.taskModal.style.display = 'none'}

    openModal () {this.taskModal.style.display = 'flex'}

    modifyTaskRow (task) {
        let rowTask = document.getElementById (`js-task-row-${task.id}`)
        rowTask.childNodes[1].innerText = task.name
        rowTask.childNodes[2].innerText = task.asignee
        rowTask.childNodes[3].innerText = task.status
    }

    deleteTaskRow(id){
        document.getElementById (`js-task-row-${id}`).remove()
    }

}

let taskStorage = new Storage ('tasks')
let taskList = new TaskList()
let userInterface = new UI()

/* Primer seteo de tasks. Checkeamos si hay tareas guardadas en la localStorage */

if (!taskStorage.value || taskStorage.getItemsCount() === 0) {
    tableWarning.style.display = 'block'
} else {
    userInterface.replaceTaskList (taskStorage.value)
    taskList.setCurrentTasks (taskStorage.value.slice (0))
    tableWarning.style.display = 'none'
}


/* Sección para botones de abrir y cerrar el modal */

const openModalButton = document.getElementById ('js-open-task-modal'); /* Botón de agregar tarea */

const closeModalButton = document.getElementById ('js-close-task-modal'); /* Cross para cerrar modal */

openModalButton.onclick = function () {
    taskForm.elements['submit'].value = "Add Task"
    if (taskStorage.getItemsCount() === 0) {
        taskForm.elements['id'].value = 1
    } else {
        taskForm.elements['id'].value = taskStorage.getLastId() +1 
    }
    taskForm.elements['name'].value = ''
    taskForm.elements['asignee'].value = 'Not Asigned'
    taskForm.elements['status'].value = 'Pending'
    userInterface.openModal()

}

window.onclick = function (event) { /* Al clickear afuera del modal, se cierra */
    if (event.target === taskModal) {
        userInterface.closeModal()
    }
}

closeModalButton.onclick = function () {userInterface.closeModal()}



/* Seccion para agregar tasks */



taskForm.addEventListener ('submit', (event) => {
    event.preventDefault()
    let searchValue = searchInput.value.toLowerCase()
    let selectValue = statusSelect.value
    
    let task = new Task (
        taskForm.elements['id'].value, 
        taskForm.elements['name'].value, 
        taskForm.elements['asignee'].value, 
        taskForm.elements['status'].value,
        ''
    )

    taskIndex = taskStorage.getItemIndex (task.id)
    /* Este submit es para el caso en que se este modificando una tarea que ya existe */
    if (taskIndex !== -1) {
        task.time = taskStorage.value[taskIndex].time
        taskStorage.modifyItem (taskIndex, task)
        userInterface.modifyTaskRow(task)
        /* Aca me aseguro de mostrar el task en la lista solo si esta dentro de las opciones de filtro, y ordeno la lista si hace falta */
        if ( (selectValue === 'All' || selectValue === task.status) 
        && (searchValue === '' || task.name.toLowerCase().includes (searchValue))) {
            /* Si hubo cambio de nombre, y el currentSortBy esta realizado por nombre, hay que sortear la lista nuevamente */
           
            if (currentSortBy[0]==='name') {
                taskList.modifyTask (task.id, task)
                taskList.sortTasks (currentSortBy[0],currentSortBy[1])
                userInterface.replaceTaskList (taskList.currentItems)
            }
        } else {
            /* Si el task modificado no entra dentro de las opciones de filtrado, debemos removerlo de la lista */
            userInterface.deleteTaskRow(task.id)
        }
    } else {
    /* Este submit es cuando el usuario desea agregar una tarea nueva */
        task.time = new Date().toLocaleString ([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})
        taskStorage.addItem (task)
        if ( (selectValue === 'All' || selectValue === task.status) 
        && (searchValue === '' || task.name.toLowerCase().includes (searchValue))) {
            userInterface.createNewRow (task)
            taskList.addTask (task)
            tableNoResults.style.display = 'none'
        } /* Lo agregamos también a la lista, si cumple con los parametros de búsqueda, para no tener que recargar la página */
    }
    tableWarning.style.display = 'none'
 
    userInterface.closeModal()
    
})

/* SECCIÓN DE FILTROS */

const searchInput = document.getElementById ('js-task-list__search__input')
const searchButton = document.getElementById ('js-task-list__search__button')
const statusSelect = document.getElementById ('js-task-list__filters__status__select')
const clearFiltersButton = document.getElementById ('js-task-list__filters__cross')


/* Sección para busqueda de tasks */

function searchTasks () {
    let searchValue = searchInput.value.toLowerCase()
    let selectValue = statusSelect.value
    taskList.searchTask (searchValue, selectValue)
    if (!taskList.currentItems || taskList.currentItems.length === 0 ) {
        clearFiltersButton.style.display = 'block'
        tableNoResults.style.display = 'block'
        userInterface.replaceTaskList ([])
    } else {
        tableNoResults.style.display = 'none'
        userInterface.replaceTaskList (taskList.currentItems)
    }
}

searchButton.onclick = function () { searchTasks()}

/* Por si el usuario presiona enter estando en el input */

searchInput.addEventListener ( "keypress", function (e) {
    if (e.code === 'Enter') {
        searchTasks()
    }
})

/* Filtro de tasks por estado */

statusSelect.onchange = function () {
    let selectValue = statusSelect.value
    let searchValue = searchInput.value.toLowerCase()
    taskList.searchTask (searchValue, selectValue)
    if (taskList.currentItems.length === 0 ) {
        clearFiltersButton.style.display = 'block'
        tableNoResults.style.display = 'block'
        userInterface.replaceTaskList ([])
    } else {
        clearFiltersButton.style.display = 'block'
        tableNoResults.style.display = 'none'
        userInterface.replaceTaskList (taskList.currentItems)
    }
}

/* Limpiar los filtros */

function cleanFilters () {
    currentSortBy = ['id', true]
    searchInput.value = ''
    statusSelect.value = 'All'
    userInterface.replaceTaskList (taskStorage.value)
}

clearFiltersButton.onclick = function () { 
    cleanFilters()
    clearFiltersButton.style.display = 'none'
    tableNoResults.style.display = 'none'
    if (taskStorage.getItemsCount() === 0) {
        tableWarning.style.display = 'block'
    } else {
        tableWarning.style.display = 'none'
    }
}


/* Funcionalidad de SortBy */
const sortByButtons = document.querySelectorAll ('.js-sortBy-buttons')



/* Function para los botones de sortBy */
function clickSortByButtons (elementId) {
    let stringArray = elementId.split ('-')
    let isAsc = stringArray[3] === 'true'
    taskList.sortTasks (stringArray[2], isAsc)    
    currentSortBy = [stringArray[2], isAsc]
    userInterface.replaceTaskList (taskList.currentItems)
}

sortByButtons.forEach (button => button.onclick = function () {clickSortByButtons (this.id)})

