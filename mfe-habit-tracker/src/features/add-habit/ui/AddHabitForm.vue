<template>
	<form class="form" @submit.prevent="onSubmit">
		<input v-model="name" type="text" placeholder="Новая привычка" class="input" />
		<button class="btn" :disabled="!name.trim()">Добавить</button>
	</form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{ (e: "submit", name: string): void }>();
const name = ref("");

function onSubmit() {
	const value = name.value.trim();
	if (!value) return;
	emit("submit", value);
	name.value = "";
}
</script>

<style scoped>
.form { display: flex; gap: 0.5rem; }
.input { flex: 1; border: 1px solid #d1d5db; padding: 0.4rem 0.6rem; border-radius: 0.375rem; }
.btn { padding: 0.4rem 0.8rem; border: 1px solid #d1d5db; border-radius: 0.375rem; }
</style>

