<template>
  <v-app class="primary split-bg">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-col cols="12" md="6" lg="4" sm="8">
            <router-view :key="$route.path"></router-view>
          </v-col>
        </v-layout>
      </v-container>

      <v-footer>
        <v-spacer></v-spacer>
        <p class="caption text--secondary">
          {{ version }}
        </p>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    version: process.env.VUE_APP_VERSION,
  }),

  methods: {},
}
</script>
<style lang="sass" scoped>
.split-bg
  height: 50%
  width: 100%
  position: absolute
  top: 0
  left: 0
  content: ""
  z-index: 0
</style>
