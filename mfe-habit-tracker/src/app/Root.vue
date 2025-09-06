<template>
  <div>
    <DashboardPage />
  </div>
  <!-- more UI will be wired via FSD pages/components -->
</template>

<script setup lang="ts">
// Root shell for the remote; accepts props via mount(options.props)
import DashboardPage from "../pages/dashboard/index.vue";
import { onMounted } from "vue";
import { useHabitStore } from "../entities/habit/model";

const store = useHabitStore();
onMounted(() => {
  store.subscribeToEvents();
});
</script>

<style scoped>
/* minimal styles */
</style>
