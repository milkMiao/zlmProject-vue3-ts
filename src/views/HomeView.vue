<template>
  <div class="home">
    <!-- 计算属性 ref 也会在模板中自动解包，因此在模板表达式中引用时无需添加 .value -->
    <h1>Home页面</h1>
    <button @click="increment">{{ count }}</button>
    <div>Has published books: {{ publishedBooksMessage }}</div>

    <!-- 侦听器 watch-->
    <div style="margin: 20px 0;">
      <p>Ask a yes/no question: <input v-model="question" :disabled="loading" ></p>
      <p>{{ answer }}</p>
      <image :src="img"></image>

      <div  style="margin: 20px 0;">
        <div>Number------x: {{x}} , y: {{y}}</div>
        <input v-model="x"  placeholder="请输入x">
        <input v-model="y"  placeholder="请输入y" >

        <div>Obj---------{{obj.count}}</div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { ref, reactive, watch, watchEffect } from 'vue'

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

  //生命周期
  onMounted(()=>{
    console.log('生命周期---onMounted')
  })

  //侦听器
  const question = ref('')  
  const img = ref('')
  const answer = ref('(Questions usually contain a question mark. ;-)')
  const loading = ref(false)
  watch(question, async (newQuestion, oldQuestion) => {
    if(newQuestion.includes('?')){
      loading.value = true
      answer.value = 'Thinking ...'
      try{
        const res = await fetch('https://yesno.wtf/api')
        answer.value = (await res.json()).answer
        img.value = (await res.json()).image
      } catch(error){
        answer.value = 'Error! Could not reach the API. ' + error
      } finally{
        loading.value = false
      }
    }
  })

  //侦听器--数组
  //watch 的第一个参数：可以是不同形式的“数据源”：它可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组，等等
  const x = ref(0)
  const y = ref(0)
  // 1、单个 ref
  // watch(x, (newX) => {
  //   console.log(`x is ${newX}`)
  // })

  // 2、getter 函数
  // watch(
  //   () => x.value + y.value,
  //   (sum) => {
  //     console.log(`sum of x + y is: ${sum}`)
  //   }
  // )

  // 3、多个来源组成的数组
  // watch([x, () => y.value], ([newX, newY]) => {
  //   console.log(`x is ${newX} and y is ${newY}`)
  // })

  // 4、侦听对象：你不能直接侦听响应式对象的属性值
  // const obj = reactive({ count:0 })
  //错误，因为 watch() 得到的参数是一个 number
  // watch(obj.count, (count)=>{
  //   console.log('obj--count', count)
  // })

  // 一个返回该属性的 getter 函数：
  // watch(
  //   ()=>{ obj.count },
  //   (count)=>{
  //   //错误，因为 watch() 得到的参数是一个 number
  //   console.log('obj--count', count)
  // })

  //5、深层侦听器
  //直接给 watch() 传入一个响应式对象，会隐式地创建一个深层侦听器——该回调函数在所有嵌套的变更时都会被触发：
  const obj = reactive({ count:0 })
  // watch(obj, (newVal,oldVal)=>{
  //   console.log('监听对象', newVal, oldVal)
  // })

  // watch(
  //   ()=> state.someObject,
  //   (newVal, oldVal)=>{
  //     //state.someObject 触发时回掉
  //   },
  //   { deep: true } //强制转换成--深层侦听器
  // )

  //6、即时回调的侦听器
  // watch 默认是懒执行的：仅当数据源变化时，才会执行回调；但在某些场景中，我们希望在创建侦听器时，立即执行一遍回调。
  // 举例来说，我们想请求一些初始数据，然后在相关状态更改时重新请求数据。
  // watch(
  //   source,
  //   (newVal,oldVal)=>{
  //     //立即执行，且当 `source` 改变时再次执行
  //   },
  //   { immediate: true } //强制侦听器的回调---立即执行
  // )

  // 7、一次性侦听器 
  // 每当被侦听源发生变化时，侦听器的回调就会执行
  // watch(
  //   source,
  //   (newValue, oldValue) => {
  //     // 当 `source` 变化时，仅触发一次
  //   },
  //   { once: true }
  // )

  // 8、watchEffect
  //侦听器的回调使用与源完全相同的响应式状态是很常见的。例如下面的代码，在每当 todoId 的引用发生变化时使用侦听器来加载一个远程资源：
  const todoId = ref(1)
  const data = ref(null)
  watch(
    todoId,
    async () => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
      )
      data.value = await response.json()
    },
    { immediate: true }
  )
  //我们可以用 watchEffect 函数 来简化上面的代码。watchEffect() 允许我们自动跟踪回调的响应式依赖。上面的侦听器可以重写为：
  watchEffect(async ()=>{
    const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
      )
      data.value = await response.json()
  })

  // 9、watch vs. watchEffect
  //watch：只追踪明确侦听的数据源。它不会追踪任何在回调中访问到的东西。
  //      另外，仅在数据源确实改变时才会触发回调。watch 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。
  //watchEffect，则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。
  ///            这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。

</script>
