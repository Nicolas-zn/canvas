<!-- 首页 -->
<script lang="ts" setup>
import author_info from '../../author_info'
import friendly_links from '../../friendly_links'
</script>
<template>
    <div class="page">
        <div>
            <h1>纯canvas实现的各类标志</h1>
            <ul>
                <li>国旗</li>
                <li>汽车</li>
                <li>交通</li>
                <li>.......</li>
            </ul>
            <h1>优势</h1>
            <h2>1.完全的 canvas 实现，不含任何图片</h2>
            <div>发现一张图片转成的canvas示例=删库跑路</div>
            <h2>2.完全的对接兼容 three.js</h2>
            <div>发现一个示例不兼容 three.js=删库跑路</div>
            <h2>3.高清</h2>
            <div>发现一个示例不高清=删库跑路</div>
            <h2>4.点击即生成完全易于调试的代码</h2>
            <div>发现一个示例不容易调试=删库跑路</div>
            <h2>5.兼容，极速，快、准、狠！用过的都说好</h2>
            <div>极速加载，完美兼容</div>
            <div style="color: red;">爱好驱动；删库跑路=老实修改代码</div>
        </div>
        <div class="info-panel">
            <h2>作者信息</h2>
            <div v-for="(value, key, index) in author_info" class="author">
                <div>
                    {{ key }}:
                </div>
                <div style="width: 5px;"></div>
                <div>
                    <span v-if="index < 2">
                        <a :href="value">{{ value }}</a>
                    </span>
                    <span v-else>{{ value }}</span>
                </div>
            </div>
            <h2>友情链接</h2>

            <div v-for="(value, key) in friendly_links" class="author">
                <div>
                    {{ key }}:
                </div>
                <div style="width: 5px;"></div>
                <div>
                    <span>
                        <a :href="value">{{ value }}</a>
                    </span>
                </div>
            </div>
        </div>
    </div>

</template>

<style lang="scss" scoped>
.page {
    display: flex;

    >div {
        width: 50%;
    }
}

.author {
    display: flex;
}

.info-panel {
    padding-top: 10%;
}
</style>