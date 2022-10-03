<script setup></script>

<template>
    <section class="home-list">
        <h3 class="list-title">標題</h3>
        <ul class="list-wrapper">
            <slot></slot>
        </ul>
    </section>
</template>

<style scoped lang="scss">
.home-list {
    margin-bottom: 24px;
}

.home-list .list-title {
    margin-bottom: 12px;

    font-size: 14px;
    line-height: 21px;
    color: $gray-4;
}

.home-list .list-wrapper {
    max-height: 75vh;
    overflow: scroll;
}
</style>
