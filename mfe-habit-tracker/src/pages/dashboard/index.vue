<template>
	<section>
		<h1>Привычки</h1>
		<AddHabitForm @submit="addHabit" />
		<div class="grid">
			<HabitCard v-for="h in store.habits" :key="h.id" :habit="h" @complete="store.complete" />
		</div>
	</section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useHabitStore } from "../../entities/habit/model";
import HabitCard from "../../entities/habit/ui/HabitCard.vue";
import AddHabitForm from "../../features/add-habit/ui/AddHabitForm.vue";

const store = useHabitStore();

function addHabit(name: string) {
	store.add(name);
}

onMounted(() => {
	store.load("day");
});
</script>

<style scoped>
section { padding: 1rem; }
h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.75rem; margin-top: 0.75rem; }
</style>

