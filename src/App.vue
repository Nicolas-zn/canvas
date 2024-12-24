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

let current_component = ref()
const changeComponent = (component: any) => {
  current_component.value = component
}

let application_list = [
  {
    component_name: 'parking', application_name: '停车场'
  },
  {
    component_name: 'brick', application_name: '红砖'
  },
  {
    component_name: 'arrow', application_name: '箭头'
  },
  {
    component_name: 'cross', application_name: '十字架'
  },
  {
    component_name: 'dolby', application_name: '杜比音效'
  },
  {
    component_name: 'traffic_limit_speed', application_name: '交通-限速'
  },
  {
    component_name: 'traffic_forbid_driveIn', application_name: '交通-禁止驶入'
  },
  {
    component_name: 'traffic_yield', application_name: '交通-停车让行'
  },
  {
    component_name: 'traffic_slow_yield', application_name: '交通-减速让行'
  },
  {
    component_name: 'traffic_limit_height', application_name: '交通-限高'
  },
  {
    component_name: 'traffic_limit_width', application_name: '交通-限宽'
  },
  {
    component_name: 'traffic_forbid_park', application_name: '交通-禁止停车'
  },
  {
    component_name: 'traffic_slow_drive', application_name: '交通-慢行'
  },
  {
    component_name: 'traffic_highway', application_name: '交通-高速标识'
  },
  {
    component_name: 'traffic_forbid_access', application_name: '交通-禁止通行'
  },
  {
    component_name: 'traffic_forbid_straight', application_name: '交通-禁止直行'
  },
  {
    component_name: 'traffic_forbid_UTurn', application_name: '交通-禁止掉头'
  },
  {
    component_name: 'traffic_turn_left', application_name: '交通-左转'
  },
  {
    component_name: 'traffic_road_sign', application_name: '交通-指示牌'
  },

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
  changeComponent(components['parking.vue'])
})
</script>

<template>
  <div class="container">
    <el-container class="container">
      <el-aside>
        <el-menu>
          <el-menu-item v-for="(item, name) in components" :key="name" :index="name" @click=changeComponent(item)>
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
