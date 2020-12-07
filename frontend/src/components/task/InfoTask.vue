<template>
  <v-card>
    <v-toolbar dark color="secondary">
      <v-toolbar-title
        ><v-icon left small>fas fa-tasks</v-icon
        >{{ model.name || 'Task' }}</v-toolbar-title
      >

      <v-spacer></v-spacer>

      <v-btn @click="remove" text v-show="task" dark :loading="loading"
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

        <v-row>
          <v-col cols="12" lg="6">
            <v-menu
              v-model="menu1"
              :close-on-content-click="false"
              max-width="290"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="computedDateFormattedMomentjs"
                  label="Start at"
                  readonly
                  outlined
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="model.startAt"
                @change="menu1 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="12" lg="6">
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              max-width="290"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  :value="computedDateFormattedMomentjs2"
                  label="Finish At"
                  readonly
                  outlined
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="model.finishAt"
                @change="menu1 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>

      <v-btn color="secondary" @click="create" :loading="loading" v-show="!task"
        >Create</v-btn
      >

      <v-btn color="secondary" @click="update" :loading="loading" v-show="task"
        >Update</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { create, getOne, update, remove } from '@/api/task'
import moment from 'moment'

export default {
  data() {
    return {
      model: {
        name: '',
        description: '',
        startAt: new Date().toISOString().substr(0, 10),
        finishAt: new Date().toISOString().substr(0, 10),
      },

      rules: [v => !!v || 'Field is required.'],

      loading: false,

      menu1: false,
      menu2: false,
    }
  },

  props: {
    task: { type: String },
    project: { type: Object },
  },

  watch: {
    task: {
      handler(t) {
        if (t) {
          this.loading = true

          getOne(t)
            .then(resAP => {
              this.model.name = resAP.task.name
              this.model.description = resAP.task.description
              this.model.startAt = moment(resAP.task.startAt).format(
                'YYYY-MM-DD'
              )
              this.model.finishAt = moment(resAP.task.finishAt).format(
                'YYYY-MM-DD'
              )
            })

            .catch(errAP => {
              window.getApp.$emit('GENERIC_CRUD_ERROR', errAP)
            })

            .finally(() => {
              this.loading = false
            })
        } else {
          this.model = {
            name: '',
            description: '',
            startAt: new Date().toISOString().substr(0, 10),
            finishAt: new Date().toISOString().substr(0, 10),
          }
        }
      },

      immediate: true,
    },
  },

  computed: {
    computedDateFormattedMomentjs() {
      return this.model.startAt ? moment(this.model.startAt).format('LL') : ''
    },
    computedDateFormattedMomentjs2() {
      return this.model.finishAt ? moment(this.model.finishAt).format('LL') : ''
    },
  },

  methods: {
    close() {
      this.$emit('created', false)
    },

    remove() {
      this.loading = true

      remove(this.task)
        .then(resAP => {
          window.getApp.snackbar = {
            show: true,
            color: 'green',
            text: 'Task removed successfully!',
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

      this.model.startAt = moment(this.model.startAt).toISOString()
      this.model.finishAt = moment(this.model.finishAt).toISOString()
      this.model.project = this.project._id

      update(this.task._id, {
        task: this.model,
      })
        .then(resAP => {
          window.getApp.snackbar = {
            show: true,
            color: 'green',
            text: 'Task updated successfully!',
          }

          this.model = {
            name: '',
            description: '',
            startAt: new Date().toISOString().substr(0, 10),
            finishAt: new Date().toISOString().substr(0, 10),
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

      this.model.startAt = moment(this.model.startAt).toISOString()
      this.model.finishAt = moment(this.model.finishAt).toISOString()
      this.model.project = this.project._id

      create({
        task: this.model,
      })
        .then(resAP => {
          window.getApp.snackbar = {
            show: true,
            color: 'green',
            text: 'Task created successfully!',
          }

          this.model = {
            name: '',
            description: '',
            startAt: new Date().toISOString().substr(0, 10),
            finishAt: new Date().toISOString().substr(0, 10),
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
  },

  created() {},

  mounted() {},
}
</script>

<style lang="sass" scoped></style>
