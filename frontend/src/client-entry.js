import application from './main.js'

const { app, router, store } = application()

const storeInitialState = window.INITIAL_DATA

if (storeInitialState){
    store.replaceState(storeInitialState)
}
__webpack_public_path__ = myRuntimePublicPath;

console.log(`My runtime publick puth: ${myRuntimePublicPath}`)

app.mount('#app')