<script setup></script>

<template>
    <div class="authentication">
        <div class="authentication-wrapper">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.authentication {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: $gray-4;

    background-color: $gray-0;
}
</style>
