<script setup></script>

<template>
    <div class="base-loading">
        <div class="box-wrapper"><div class="box"></div></div>
    </div>
</template>

<style scoped lang="scss">
.base-loading {
    position: fixed;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.base-loading .box-wrapper {
    padding: 24px;

    background-color: #7f7f7f70;
    border-radius: 4px;
}

.base-loading .box {
    width: 24px;
    height: 24px;
    border: 4px solid $gray-0;
    border-top: 4px solid $red-2;
    border-radius: 50%;
    animation: circle 1.2s linear infinite;
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
