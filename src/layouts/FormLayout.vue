<script setup></script>

<template>
    <div class="form">
        <div class="form-wrapper">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.form {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: $gray-4;

    background-color: $gray-0;
}
</style>
