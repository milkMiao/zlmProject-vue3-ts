<script setup lang="ts">
import { computed } from 'vue';
import { ref, reactive } from 'vue'

const count = ref(0)
const increment= ()=>{
  count.value++
}

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})
const publishedBooksMessage = computed(()=>{
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
  <div class="home">
    <!-- 计算属性 ref 也会在模板中自动解包，因此在模板表达式中引用时无需添加 .value。 -->
    <h1>Home页面</h1>
    <button @click="increment">{{ count }}</button>
    
    <div>
      <span>Has published books: {{ publishedBooksMessage }}</span>
    </div>
  </div>
</template>
