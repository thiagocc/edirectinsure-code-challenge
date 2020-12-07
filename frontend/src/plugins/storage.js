import Vue from 'vue'
import Storage from 'vue-ls'

const options = {
  namespace: 'vma__',
  name: 'ls',
  storage: 'local',
}

Vue.use(Storage, options)
