<template>
  <v-app-bar color="primary2" app>
    <v-img
      class="mx-2"
      src="/static/logo.png"
      max-height="60"
      max-width="60"
      contain
    ></v-img>
    <v-spacer />
    <v-toolbar-items>
      <v-btn text>
        {{ this.$store.state.App.username }}
      </v-btn>
      <v-menu offset-y :nudge-bottom="10" transition="scale-transition">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>account_circle</v-icon>
          </v-btn>
        </template>
        <v-list class="pa-0">
          <v-list-item
            v-for="(item, index) in items"
            :to="!item.href ? { name: item.name } : null"
            :href="item.href"
            @click="item.click"
            ripple="ripple"
            :disabled="item.disabled"
            :target="item.target"
            rel="noopener"
            :key="index"
          >
            <v-list-item-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-app-bar>
</template>
<script>
import { logout } from '@/api/users'
export default {
  name: 'AppToolbar',
  components: {},
  data() {
    return {
      username: '',
      items: [
        {
          icon: 'logout',
          href: '#',
          title: 'Logout',
          click: this.handleLogout,
        },
      ],
    }
  },
  computed: {
    toolbarColor() {
      return this.$vuetify.options.extra.mainNav
    },
  },
  methods: {
    handleLogout() {
      logout()
        .then(resTP => {})
        .catch(err => {
          window.getApp.$emit('GENERIC_CRUD_ERROR', err)
        })
        .finally(() => {
          this.$router.replace('/auth/login')
        })
    },
    handleSetting() {},
    handleProfile() {
      this.$router.push({ path: '/auth/alterar' })
    },
  },
  created() {},

  mounted() {
    // nome()
    //   .then(response => {
    //     this.username = response.nome_razao
    //     this.$store.commit('setUsername', response.nome_razao)
    //   })
    //   .catch(err => {
    //     window.getApp.snackbar = {
    //       show: true,
    //       color: 'red',
    //       text: 'Ops! Something unexpected happened.',
    //     }
    //   })
  },
}
</script>

<style lang="sass" scoped></style>
