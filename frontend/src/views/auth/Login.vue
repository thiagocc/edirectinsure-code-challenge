<template>
  <div>
    <register
      :dialogRegister="dialogRegister"
      @created="handleCreate"
    ></register>

    <v-card class="elevation-1 pa-3 login-card">
      <v-card-text>
        <v-layout align-center justify-center column fill-height>
          <img src="/static/logo.png" height="90" />

          <h1 class="my-4 primary--text headline">
            ToDo List
          </h1>
        </v-layout>

        <v-form ref="form" lazy-validation onsubmit="return false;">
          <v-text-field
            append-icon="mail"
            name="login"
            label="E-mail"
            type="text"
            v-model="model.email"
            :rules="emailRules"
            @keyup.enter="login"
          ></v-text-field>

          <v-text-field
            append-icon="lock"
            name="password"
            label="Password"
            id="password"
            type="password"
            v-model="model.password"
            :rules="passwordRules"
            @keyup.enter="login"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="register" text>Register</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="login" :loading="loading" x-large
          >Login</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { login } from '@/api/users'
import Register from '@/components/user/Register'

export default {
  components: {
    Register,
  },
  data: () => ({
    loading: false,
    emailRules: [
      v => !!v || 'E-mail is required.',
      v =>
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i.test(
          v
        ) || 'E-mail is invalid.',
    ],
    passwordRules: [v => !!v || 'Password is required.'],
    model: {
      email: '',
      password: '',
    },

    dialogRegister: false,
  }),

  mounted() {},

  methods: {
    handleCreate() {
      this.dialogRegister = false
    },
    login() {
      if (!this.$refs.form.validate() || this.loading) {
        return
      }

      this.loading = true

      login({
        user: {
          email: this.model.email,
          password: this.model.password,
        },
      })
        .then(resAP => {
          this.$store.commit('setUsername', resAP.user.name.split(' ')[0])
          this.$router.push('/dashboard')
        })
        .catch(errAP => {
          if (errAP.response.status === 404) {
            window.getApp.snackbar = {
              show: true,
              color: 'red',
              text: 'Login ou Senha incorretos.',
            }
          } else {
            window.getApp.$emit('GENERIC_CRUD_ERROR', errAP)
          }

          this.loading = false
        })
    },
    register() {
      this.dialogRegister = true
    },
  },
}
</script>

<style lang="sass" scoped></style>
