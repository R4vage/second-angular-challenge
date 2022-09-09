
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
            return data
        } catch (error) {
            window.alert = `An error has ocurred: ${error}`
        }
    }

    async fetchUser (userName) {
        try {        
            const res = await fetch(`https://api.github.com/users/${userName}`, this.options)
            const data = await res.json()
            this.currentUser = userName
            return data
        } catch (error) {
            window.alert = `An error has ocurred: ${error}`
        }
    }

    async getRepositories (userName){
        try {
            const res = await fetch(`https://api.github.com/users/${userName}/repos`, this.options)
            const data = await res.json();
            if(res.status === 200) {
                console.log(data)
                return data
            } else {
                console.log(res.status)
            }
        } catch (error){
            console.log(error)
        }  
    }
}

class UI {  
    static profileInfo = document.getElementById('display-profile__form')
    static profileImg = document.getElementById('display-profile__img')
    static repoList = document.getElementById('repositories-list__body')
    static profileName = document.getElementById('display-profile__name')
    static searchResults = document.getElementById('search-profile__results')
    static searchButton = document.getElementById('search-button')
    static searchInput = document.getElementById('search-profile__form__input')
    static profileInfo = document.getElementById('display-profile__form')
    static profileImg = document.getElementById('display-profile__img')
    static repoList = document.getElementById('repositories-list__body')
    static searchReset = document.getElementById('search-reset')

    static prepareCard(data){
        console.log(profileInfo.elements)
        this.profileName.innerText = data.name
        this.profileInfo.elements['followers'].value = data.followers
        this.profileInfo.elements['following'].value = data.following
        this.profileInfo.elements['company'].value = data.company || "No Company"
        this.profileInfo.elements['website'].value = data.website || "No Website"
        this.profileInfo.elements['location'].value = data.location || "No Location"  
        this.profileInfo.elements['member-since'].value = data.location || "No Website"  
        this.profileInfo.elements['link-to-profile'].value = data.html_url  
        this.profileInfo.elements['member-since'].value = new Date(data.created_at).toLocaleString ([], {year: 'numeric', month: 'numeric', day: 'numeric'})
        this.profileInfo.elements['number-repositories'].value = data.public_repos  
        this.profileImg.src= data.avatar_url
    }
    
    static addReposToTable(repos){
        UI.repoList.innerHTML = ''
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
    }

    static createNewRow (repo) {
        console.log(repo)
        let newTr = document.createElement ('tr') 
        newTr.className= `repositories-list__row`
        newTr.id= `js-repositories-row-${repo.id}`
    
        /* Acá se agregan los datos */
        for (const prop in repo) { 
            let td = document.createElement ('td')
            td.innerText = repo[prop]
            newTr.appendChild (td)
        }
        UI.repoList.appendChild (newTr)
    }

    static addResults (results) {
        UI.searchResults.innerHTML = ''
        console.log(results)
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
                newDiv.appendChild(newP);
                newDiv.appendChild(newButton);
                UI.searchResults.appendChild(newDiv);
            })
        }
        UI.searchResults.style.marginTop = '-3%';
        UI.searchReset.style.display = 'block';
    }

    static resetSearch (){
        UI.searchResults.style.marginTop = '-100%';
        UI.searchInput.value = '';
        UI.searchReset.style.display = 'none';
       
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