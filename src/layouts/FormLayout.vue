<script setup></script>

<template>
    <div class="form-layout">
        <div class="form-wrapper">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.form-layout {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: $gray-4;

    background-color: $gray-0;
}
</style>
