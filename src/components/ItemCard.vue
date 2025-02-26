<script setup>
defineProps({
  item: Object,
  goToItem: Function,
})
</script>

<template>
  <div class="bg-white p-4 shadow rounded-lg">
    <img :src="item.image" alt="Item Image" class="w-full h-40 object-cover rounded-lg" />
    <h3 class="mt-2 text-lg font-semibold text-gray-800">{{ item.name }}</h3>
    <p class="text-gray-500 text-sm truncate">{{ item.description }}</p>
    <button
      @click="goToItem(item.id)"
      class="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded transition"
    >
      View Item
    </button>
  </div>
</template>
