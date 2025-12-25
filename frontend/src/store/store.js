import Vuex from 'vuex'


const store = Vuex.createStore({
    state() {
        return { 
            SERVER_BASE_URL: 'http://localhost:9007/api' 
        }
    }
})

export default store