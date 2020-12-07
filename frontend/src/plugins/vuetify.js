import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import pt from 'vuetify/src/locale/pt.ts'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {},
  icons: {
    iconfont: 'fa',
  },
  lang: {
    locales: { pt },
    current: 'pt',
  },
})
