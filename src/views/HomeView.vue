<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import { ref, reactive, watch } from 'vue'

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
  const obj = reactive({ count:0 })
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

  //深度监听
  watch(obj, (newVal,oldVal)=>{
    console.log('监听对象', newVal, oldVal)
  })
</script>

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
