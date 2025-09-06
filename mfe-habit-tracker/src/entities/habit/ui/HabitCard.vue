<template>
	<div class="card">
		<div class="title">{{ habit.name }}</div>
		<div class="meta">Создано: {{ new Date(habit.createdAt).toLocaleDateString() }}</div>
		<div class="progress">
			<div class="bar" :style="{ width: Math.round(habit.progress * 100) + '%' }"></div>
		</div>
		<button class="btn" @click="$emit('complete', habit.id)">Отметить прогресс</button>
	</div>
</template>

<script setup lang="ts">
import type { Habit } from "../../model";

defineProps<{ habit: Habit }>();
defineEmits<{ (e: "complete", id: string): void }>();
</script>

<style scoped>
.card { border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 0.75rem; }
.title { font-weight: 600; }
.meta { font-size: 0.8rem; color: #6b7280; margin-bottom: 0.5rem; }
.progress { background: #f3f4f6; height: 6px; border-radius: 999px; overflow: hidden; margin: 0.5rem 0; }
.bar { background: #3b82f6; height: 100%; }
.btn { font-size: 0.85rem; padding: 0.25rem 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem; }
</style>

