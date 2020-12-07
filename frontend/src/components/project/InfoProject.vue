<template>
  <v-card>
    <v-toolbar dark color="secondary">
      <v-toolbar-title
        ><v-icon left small>fas fa-project-diagram</v-icon
        >{{ model.name || 'Project' }}</v-toolbar-title
      >
      <v-spacer></v-spacer>

      <v-btn @click="remove" text v-show="project" dark :loading="loading"
        >Remove</v-btn
      >

      <v-btn icon @click="close">
        <v-icon small>fas fa-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text>
      <v-form ref="form" lazy-validation onsubmit="return false;">
        <v-text-field
          name="name"
          label="Name"
          type="text"
          v-model="model.name"
          :disabled="loading"
          :rules="rules"
        ></v-text-field>

        <v-textarea
          name="name"
          label="Description"
          type="text"
          v-model="model.description"
          :disabled="loading"
        ></v-textarea>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="secondary"
        @click="create"
        :loading="loading"
        v-show="!project"
        >Create</v-btn
      >
      <v-btn
        color="secondary"
        @click="update"
        :loading="loading"
        v-show="project"
        >Update</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script>
import { create, getOne, update, remove } from '@/api/project'
export default {
  data() {
    return {
      model: {
        name: '',
        description: '',
      },

      rules: [v => !!v || 'Field is required.'],

      loading: false,
    }
  },
  props: {
    project: { type: Object },
  },
  watch: {
    project: {
      handler(p) {
        if (p) {
          this.loading = true

          getOne(p._id)
            .then(resAP => {
              this.model.name = resAP.project.name
              this.model.description = resAP.project.description
            })
            .catch(errAP => {
              window.getApp.$emit('GENERIC_CRUD_ERROR', errAP)
            })
            .finally(() => {
              this.loading = false
            })
        }
      },
      immediate: true,
    },
  },
  computed: {},
  methods: {
    close() {
      this.$emit('created', false)
    },
    remove() {
      this.loading = true

      remove(this.project._id)
        .then(resAP => {
          window.getApp.snackbar = {
            show: true,
            color: 'green',
            text: 'Project removed successfully!',
          }
          this.$emit('created', true)
        })
        .catch(errAP => {
          window.getApp.$emit('GENERIC_CRUD_ERROR', errAP)
        })
        .finally(() => {
          this.loading = false
        })
    },
    update() {
      if (!this.$refs.form.validate() || this.loading) {
        return
      }

      this.loading = true

      update(this.project._id, {
        project: this.model,
      })
        .then(resAP => {
          window.getApp.snackbar = {
            show: true,
            color: 'green',
            text: 'Project updated successfully!',
          }

          this.model = {
            name: '',
            description: '',
          }
          this.$refs.form.reset()
          this.$emit('created', true)
        })
        .catch(errAP => {
          window.getApp.$emit('GENERIC_CRUD_ERROR', errAP)
        })
        .finally(() => {
          this.loading = false
        })
    },
    create() {
      if (!this.$refs.form.validate() || this.loading) {
        return
      }

      this.loading = true

      create({
        project: this.model,
      })
        .then(resAP => {
          window.getApp.snackbar = {
            show: true,
            color: 'green',
            text: 'Project created successfully!',
          }

          this.model = {
            name: '',
            description: '',
          }
          this.$refs.form.reset()
          this.$emit('created')
        })
        .catch(errAP => {
          window.getApp.$emit('GENERIC_CRUD_ERROR', errAP)
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
  created() {},

  mounted() {},
}
</script>

<style lang="sass" scoped></style>
