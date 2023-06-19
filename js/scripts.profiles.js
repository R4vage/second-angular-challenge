class Users {
    constructor () {
        this.currentUser = {} 

    }

    options = {
        method: "GET",
        headers: {
            Authorization: "token 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"
        }
    }
    
    async searchUser (searchValue) {
        try{
            const res = await fetch(`https://api.github.com/search/users?q=${searchValue}&per_page=5`, this.options)
            const data = await res.json()
            if(res.status === 200) {
                return data
            } else {
                UI.openWarningModal(`An error has ocurred: ${data.message}`) 
            }
        } catch (error) {
            UI.openWarningModal(`An error has ocurred: ${error}`) 
        }
    }

    async fetchUser (userName) {
        try {        
            const res = await fetch(`https://api.github.com/users/${userName}`, this.options)
            const data = await res.json()
            if(res.status === 200) {
                this.currentUser = userName
                return data
            } else {
                UI.openWarningModal(`An error has ocurred: ${data.message}`) 
            }
        } catch (error) {
            UI.openWarningModal(`An error has ocurred: ${error}`) 
        }
    }

    async getRepositories (userName, page){
        try {
            const res = await fetch(`https://api.github.com/users/${userName}/repos?per_page=10&page=${page}`, this.options)
            const data = await res.json();
            if(res.status === 200) {
                return data
            } else {
                UI.openWarningModal(`An error has ocurred: ${data.message}`) 
            }
        } catch (error){
            UI.openWarningModal(`An error has ocurred: ${error}`) 
        }  
    }
}

class UI {  
    static profile = document.getElementById('display-profile');
    static profileInfo = document.getElementById('display-profile__form');
    static profileImg = document.getElementById('display-profile__img');
    static profileName = document.getElementById('display-profile__name');
    static profileCross = document.getElementById('display-profile__cross')

    static searchResults = document.getElementById('search-profile__results');
    static searchButton = document.getElementById('search-button');
    static searchInput = document.getElementById('search-profile__form__input');
    static searchReset = document.getElementById('search-reset');

    static repoList = document.getElementById('repositories-list__body');
    static repoTable = document.getElementById('repositories-table');
    static repoPages = document.getElementById('repositories-pages')
    
    static warnModal = document.getElementById('warning-modal')
    static warnModalText = document.getElementById('warning-modal__text')
    static warnModalButton = document.getElementById('warning-modal__button')

    static pages = document.getElementById('repositories-pages')

    

    static prepareCard(data){
        UI.profileName.innerText = data.name || data.login;
        UI.profileInfo.elements['followers'].value = data.followers;
        UI.profileInfo.elements['following'].value = data.following;
        UI.profileInfo.elements['company'].value = data.company || "No Company";
        UI.profileInfo.elements['website'].value = data.website || "No Website";
        UI.profileInfo.elements['location'].value = data.location || "No Location";
        UI.profileInfo.elements['member-since'].value = data.location || "No Website";  
        UI.profileInfo.elements['link-to-profile'].value = data.html_url;  
        UI.profileInfo.elements['member-since'].value = new Date(data.created_at).toLocaleString ([], {year: 'numeric', month: 'numeric', day: 'numeric'});
        UI.profileInfo.elements['number-repositories'].value = data.public_repos;  
        UI.profileImg.src= data.avatar_url;

        UI.profileInfo.elements['link-to-profile'].onclick = function (){
            window.open(UI.profileInfo.elements['link-to-profile'].value, '_blank').focus()
        }

        UI.displayCard()
    }
    
    static addReposToTable(repos){
        UI.repoList.innerHTML = ''
        if (!repos || repos.length === 0){
            UI.repoTable.style.display = 'none'
        } else {
            UI.repoTable.style.display = 'table'
            repos.forEach(element => {
                let repo = {
                    name:element.name,
                    stars:element.stargazers_count,
                    forks:element.forks_count,
                    watchers:element.watchers_count,
                    link:element.svn_url
                }
                UI.createNewRow(repo)
            });
            let links = document.getElementsByClassName('repositories-list__row__link')
            for (let item of links) {
                item.onclick = function (){
                    window.open(item.innerText, '_blank').focus()
                }
            }
        }
    }

    static createNewRow (repo) {
        let newTr = document.createElement ('tr') 
        newTr.className= `repositories-list__row`
        newTr.id= `js-repositories-row-${repo.id}`
    
        /* Here we add the data to the row */
        for (const prop in repo) { 
            let td = document.createElement ('td')
            td.innerText = repo[prop]
            td.className = `repositories-list__row__${prop}`
            newTr.appendChild (td)
        }
        UI.repoList.appendChild (newTr)
    }

    static addResults (results) {
        UI.searchResults.innerHTML = ''
        if(results.total_count === 0){
            let newP = document.createElement('div')
            newP.innerText = 'No results'
            newP.className = 'search-profile__results__warning'
            UI.searchResults.appendChild(newP)
        } else {
            results.items.forEach(result => {
                let newDiv = document.createElement ('div') ;
                newDiv.className = `search-profile__results__row`;
                let newP = document.createElement('p');
                newP.innerText = result.login;
                let newButton = document.createElement('button');
                newButton.className = 'search-profile__results__button';
                newButton.innerText = 'See User';
                newDiv.onclick = async function (){
                    let user = await users.fetchUser(newP.innerText)
                    let repos = await users.getRepositories(newP.innerText, 1)
                    UI.addReposToTable(repos)
                    UI.prepareCard(user)
                    UI.addPages(1, Math.ceil(user.public_repos/10))
                    UI.resetSearch()
                }
                newDiv.appendChild(newP);
                newDiv.appendChild(newButton);
                UI.searchResults.appendChild(newDiv);
            })
        }
        UI.searchResults.style.marginTop = '-3%';
        UI.searchReset.style.display = 'block';
    }

    static resetSearch () {
        UI.searchResults.style.marginTop = '-100%';
        UI.searchInput.value = '';
        UI.searchReset.style.display = 'none';

       
    }

    static displayCard () {
        UI.profile.style.height = '100%'
        UI.profile.style.marginLeft = '0'
        UI.profile.style.overflow = 'auto'
    }

    static closeCard () {
        UI.profile.style.marginLeft = '-200vw'
        UI.profile.style.height = '0'
        UI.profile.style.overflow = 'hidden'
        window.scrollTo(0, 0);
    }

    static openWarningModal (text){
        UI.warnModal.style.display = 'flex'
        UI.warnModalText.innerText = text

    }

    static closeWarningModal (){
        UI.warnModal.style.display = 'none'
    }

    static addPages (currentPage, totalPages){

        if (totalPages > 1){ 
            UI.pages.innerHTML = ''
            UI.pages.style.display = 'flex'
            const pagesList = []
            for (var i = currentPage -3; i < currentPage +3 ; i++){
                if (i > 0 && i <= totalPages){
                    pagesList.push(i)
                }
            }
            console.log(pagesList)
            if (currentPage > 1){
                let newP = document.createElement('p');
                newP.className = 'repositories-pages__arrows'
                newP.innerText = '<'
                newP.onclick = async function (){
                    let repos = await users.getRepositories(users.currentUser, currentPage-1)
                    UI.addReposToTable(repos)
                    UI.addPages(currentPage-1, totalPages)
                }
                UI.pages.appendChild(newP)
            }
            if (pagesList[0] > 1){
                let newP = document.createElement('p');
                newP.className = 'repositories-pages__dots'
                newP.innerText = '⋯'
                UI.pages.appendChild(newP)
            }
            pagesList.map( (page) => {
                let newP = document.createElement('p');
                if (page === currentPage){
                    newP.className = 'repositories-pages__page repositories-pages__current'
                } else {
                    newP.className = 'repositories-pages__page'
                }
                newP.innerText = page
                newP.onclick = async function (){
                    let repos = await users.getRepositories(users.currentUser, page)
                    UI.addReposToTable(repos)
                    UI.addPages(page, totalPages)
                }
                UI.pages.appendChild(newP)
            })
            if (pagesList[pagesList.length-1] < totalPages) {
                let newP = document.createElement('p');
                newP.className = 'repositories-pages__dots'
                newP.innerText = '⋯'
                UI.pages.appendChild(newP)
            }
            if (currentPage < totalPages) {
                let newP = document.createElement('p');
                newP.className = 'repositories-pages__arrows'
                newP.innerText = '>'
                newP.onclick = async function (){
                    let repos = await users.getRepositories(users.currentUser, currentPage+1)
                    UI.addReposToTable(repos)
                    UI.addPages(currentPage+1, totalPages)
                }
                UI.pages.appendChild(newP)
            }
        } else {
            console.log('here')
            UI.pages.style.display = 'none'
        }
    }
}


const users = new Users()


/* UI.searchForm.addEventListener ('submit', async (event) => {
    event.preventDefault()
    console.log(UI.searchForm.elements['username'].value)
    let userInfo = await users.fetchUser(searchForm.elements['username'].value)
    let repos = await users.getRepositories(searchForm.elements['username'].value)
    UI.prepareCard(userInfo)
    UI.addReposToTable(repos)
}) */



async function prepareResults() {
    if (UI.searchInput.value !== ''){
        let results = await users.searchUser(UI.searchInput.value);
        UI.addResults(results);
    } else {
        UI.resetSearch();
    }
}

UI.profileCross.onclick = function () {
    UI.closeCard()
}

UI.searchReset.onclick = function (){
    UI.resetSearch();
}
let timer;
UI.searchInput.addEventListener ("input", function (e) {
    
    function startTimer () {
        timer = setTimeout(
            () => {
               prepareResults()
            }
        ,0700)
    };
    clearTimeout(timer)
    startTimer()

});

UI.warnModalButton.onclick = function (){
    UI.closeWarningModal()
}