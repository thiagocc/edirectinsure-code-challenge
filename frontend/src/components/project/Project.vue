<template>
  <v-col cols="12" lg="4">
    <v-dialog v-model="dialog" persistent max-width="75%">
      <info-project @created="handleCreate" :project="project"></info-project>
    </v-dialog>
    <v-dialog v-model="dialogTask" persistent max-width="75%">
      <info-task
        @created="handleCreate"
        :project="project"
        :task="task"
      ></info-task>
    </v-dialog>
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title
          ><v-icon left small>fas fa-project-diagram</v-icon
          >{{ project.name }}</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-btn text @click="infoTask(null)"
          ><v-icon left small>fas fa-plus</v-icon> New Task</v-btn
        >
        <v-btn icon @click="info">
          <v-icon small>fas fa-info-circle</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-list subheader two-line flat>
          <v-subheader>To Do</v-subheader>

          <v-list-item-group>
            <div v-for="(item, i) in tasks" :key="i">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-list-item v-on="on">
                    <v-list-item-action>
                      <v-btn icon @click="done(item)" v-show="!item.loading">
                        <v-icon small>fas fa-flag-checkered</v-icon>
                      </v-btn>

                      <v-progress-circular
                        indeterminate
                        color="primary"
                        v-show="item.loading"
                      ></v-progress-circular>
                    </v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }}</v-list-item-title>

                      <v-list-item-subtitle>{{
                        item.description
                      }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-btn icon @click="infoTask(item._id)">
                        <v-icon color="grey lighten-1"
                          >fas fa-info-circle</v-icon
                        >
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </template>
                <span>Finish At: {{ item.finishAt }}</span>
              </v-tooltip>
            </div>
          </v-list-item-group>
        </v-list>

        <v-list subheader two-line flat>
          <v-subheader>Done</v-subheader>

          <v-list-item-group>
            <v-list-item v-for="(item, i) in tasksDone" :key="i">
              <v-list-item-action>
                <v-icon>fas fa-check</v-icon>
              </v-list-item-action>

              <v-list-item-content>
                <v-list-item-title
                  ><div class="text-decoration-line-through">
                    {{ item.name }}
                  </div></v-list-item-title
                >

                <v-list-item-subtitle>{{
                  item.description
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { list, done } from '@/api/task'
import InfoProject from '@/components/project/InfoProject'
import InfoTask from '@/components/task/InfoTask'

export default {
  components: {
    InfoProject,
    InfoTask,
  },
  props: {
    project: { type: Object },
  },
  watch: {
    project: {
      handler(p) {
        this.refresh(p)
      },
      immediate: true,
    },
  },
  data() {
    return {
      tasks: [],
      tasksDone: [],
      dialog: false,
      dialogTask: false,
      task: null,
    }
  },
  computed: {},
  methods: {
    infoTask(task) {
      this.task = task
      this.dialogTask = true
    },
    info() {
      this.dialog = true
    },
    refresh(p) {
      list(p._id)
        .then(response => {
          this.tasks = []
          this.tasksDone = []

          response.tasks.forEach(t => {
            if (t.isDone) {
              this.tasksDone.push(t)
            } else {
              t.loading = false
              this.tasks.push(t)
            }
          })
        })
        .catch(err => {
          window.getApp.snackbar = {
            show: true,
            color: 'red',
            text: 'Ops! Something unexpected happened.',
          }
        })
    },
    done(item) {
      item.loading = true

      done(item._id)
        .then(response => {
          this.refresh({ _id: item.project })
        })
        .catch(err => {
          window.getApp.snackbar = {
            show: true,
            color: 'red',
            text: 'Ops! Something unexpected happened.',
          }
        })
        .finally(() => {
          item.loading = false
        })
    },
    handleCreate(refresh) {
      this.dialog = false
      this.dialogTask = false

      if (refresh) {
        this.$emit('created', true)
        this.refresh(this.project)
      }
    },
  },
  created() {},

  mounted() {},
}
</script>

<style lang="sass" scoped></style>
