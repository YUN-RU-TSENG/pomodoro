<script setup>
defineProps({ isLoading: { type: Boolean, required: true } })
</script>

<template>
    <section class="home-list">
        <div v-show="isLoading" class="loading"><div class="box"></div></div>
        <h3 class="list-title">標題</h3>
        <ul class="list-wrapper">
            <slot></slot>
        </ul>
    </section>
</template>

<style scoped lang="scss">
.home-list {
    margin-bottom: 24px;
    position: relative;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $gray-0;
    opacity: 0.8;
}

.loading .box {
    width: 24px;
    height: 24px;
    border: 4px solid $gray-0;
    border-top: 4px solid $green-1;
    border-radius: 50%;
    animation: circle 1.2s linear infinite;
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

@keyframes circle {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
