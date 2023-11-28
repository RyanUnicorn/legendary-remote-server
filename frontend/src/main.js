import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.mount('#app')

const globals = {};

if(process.env.NODE_ENV != 'production') {
    globals.$origin = 'http://localhost:8080'
} else {
    globals.$origin = window.location.origin.toString();
}

export { globals };