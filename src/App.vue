<script setup lang="ts">
import { markRaw, onMounted, ref } from 'vue';




const file = import.meta.glob("@/canvas/*.vue", { eager: true });
let init: Record<string, any> = {}
const components: Record<string, any> = Object.keys(file).reduce((oldValue, newValue) => {
  let len = newValue.split("/").length;
  let c = file[newValue] as any
  oldValue[newValue.split("/")[len - 1]] = markRaw(c.default as any);
  return oldValue;
}, init);
console.log(components);

let current_component = ref()
const changeComponent = (component: any) => {
  current_component.value = component
}

let application_list = [
  {
    component_name: 'fillStyle', application_name: '停车场'
  }
]

function get_application_name(name: string) {
  const component_name = name
  let result = application_list.filter((item) => {
    return component_name == item.component_name + '.vue'
  })
  if (result.length) {
    return result[0].application_name
  } else {
    return name
  }
}

onMounted(() => {
  changeComponent(components['fillStyle.vue'])
})
</script>

<template>
  <div class="container">
    <el-container class="container">
      <el-aside>
        <el-menu :default-active="1">
          <el-menu-item v-for="(item, name) in components" :key="name" @click="changeComponent(item)">
            <span> {{ get_application_name(name) }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <component :is="current_component"></component>
      </el-main>
    </el-container>

  </div>

</template>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
}
</style>
