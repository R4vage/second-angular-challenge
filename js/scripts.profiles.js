const searchForm = document.getElementById('search-profile')

class Users {
    constructor () {
        this.currentUser = {}
    }
    async searchUser (userName) {
        try {        
            const res = await fetch(`https://api.github.com/users/${userName}`)
            const data = await res.json()
            if(data.message === 'Not Found'){
                this.currentUser = 'Not Found'
            } else {
                this.currentUser = data
            }
        } catch (error) {
            this.currentUser = `An error has ocurred: ${error}`
        }
    }

}

class UI {

}

const users = new Users()



async function something (){
    await users.searchUser("R4vage")
    .then(console.log(users.currentUser))
}

something()