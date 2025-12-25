import application from './main.js'

const { app, router, store } = application()

const storeInitialState = window.INITIAL_DATA

if (storeInitialState){
    store.replaceState(storeInitialState)
}
__webpack_public_path__ = myRuntimePublicPath;
app.mount('#app')