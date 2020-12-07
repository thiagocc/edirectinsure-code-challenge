<template>
  <v-dialog v-model="dialogRegister" persistent max-width="75%">
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title
          ><v-icon left>fas fa-user</v-icon>Register</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon small>fas fa-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form" lazy-validation onsubmit="return false;">
          <v-text-field
            append-icon="fas fa-user"
            name="name"
            label="Name"
            type="text"
            v-model="model.name"
            :rules="nameRule"
          ></v-text-field>

          <v-text-field
            append-icon="mail"
            name="email"
            label="E-mail"
            type="text"
            v-model="model.email"
            :rules="emailRules"
          ></v-text-field>

          <v-text-field
            append-icon="lock"
            name="password1"
            label="Password"
            type="password"
            v-model="model.password"
            :rules="passwordRules"
          ></v-text-field>

          <v-text-field
            append-icon="lock"
            name="password2"
            label="Confirm Password"
            type="password"
            v-model="model.passwordConfirmed"
            :rules="passwordRulesC"
            @keyup.enter="register"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="register">Register</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { register } from '@/api/users'
import Register from '@/components/user/Register'

export default {
  components: {
    Register,
  },
  props: {
    dialogRegister: { type: Boolean },
  },
  watch: {
    dialogRegister: {
      handler(val) {
        // console.log(val)
      },
      immediate: true,
    },
  },
  data: () => ({
    loading: false,
    nameRule: [v => !!v || 'Name is required.'],
    emailRules: [
      v => !!v || 'E-mail is required.',
      v =>
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i.test(
          v
        ) || 'E-mail is invalid.',
    ],
    passwordRules: [
      v => !!v || 'Password is required. ',
      v =>
        /^[a-zA-Z0-9]{6,20}$/.test(v) ||
        'Between 5 and 20 alphanumeric characters.',
    ],

    model: {
      name: '',
      email: '',
      password: '',
      passwordConfirmed: '',
    },
  }),
  computed: {
    passwordRulesC() {
      return [
        () =>
          this.model.password === this.model.passwordConfirmed ||
          'Passwords do not match',
      ]
    },
  },

  mounted() {},

  methods: {
    close() {
      this.$emit('created')
    },
    register() {
      if (!this.$refs.form.validate() || this.loading) {
        return
      }

      this.loading = true

      register({
        user: this.model,
      })
        .then(resAP => {
          window.getApp.snackbar = {
            show: true,
            color: 'green',
            text: 'User created successfully!',
          }

          this.$emit('created')
        })
        .catch(errAP => {
          window.getApp.$emit('GENERIC_CRUD_ERROR', errAP)

          this.model = {
            name: '',
            email: '',
            password: '',
            passwordConfirmed: '',
          }

          this.loading = false
        })
    },
  },
}
</script>

<style lang="sass" scoped></style>
