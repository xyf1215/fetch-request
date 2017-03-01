<template>
<div id="app">

  </div>
</template>

<script>
import {get} from './fetch-request'
export default {
  created() {
    get('ajax', {
      name: '张三',
      age: 18,
      clazz: {
        id: 302,
        name: '三年二班',
        tag: {
          name: '活跃',
          mm: ['a', 'b', {
            a: 1,
            b: 2
          }]
        }
      },
      firends: ['王五', '赵六']
    })
  }
}
</script>
