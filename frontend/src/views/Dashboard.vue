<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="4">
        <info-project @created="handleCreate"></info-project>
      </v-col>
      <project
        v-for="(item, i) in projects"
        :key="i"
        :project="item"
        @created="handleCreate"
      ></project>
    </v-row>
  </v-container>
</template>

<script>
import Project from '@/components/project/Project'
import InfoProject from '@/components/project/InfoProject'
import { list } from '@/api/project'

export default {
  components: {
    Project,
    InfoProject,
  },
  data: () => ({
    projects: [],
  }),
  methods: {
    refresh() {
      list()
        .then(response => {
          this.projects = response.projects
        })
        .catch(err => {
          window.getApp.snackbar = {
            show: true,
            color: 'red',
            text: 'Ops! Something unexpected happened.',
          }
        })
    },
    handleCreate() {
      this.refresh()
    },
  },
  mounted() {
    this.refresh()
  },
}
</script>
