<template>
  <v-navigation-drawer
    app
    class="app--drawer"
    :mini-variant.sync="mini"
    v-model="drawer"
    :width="drawWidth"
    :dark="$vuetify.dark"
  >
    <v-toolbar color="primary4" dark>
      <v-layout justify-center>
        <img :src="computeLogo" height="48" alt="EdirectInsure" />
      </v-layout>
    </v-toolbar>
  </v-navigation-drawer>
</template>
<script>
import { checkToken } from '@/api/users'

export default {
  name: 'AppDrawer',
  components: {},

  data() {
    return {}
  },

  computed: {
    computeLogo() {
      return '/static/logo.png'
    },
  },
  methods: {},
}
</script>

<style lang="sass" scoped></style>
