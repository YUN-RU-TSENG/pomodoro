<script setup></script>

<template>
    <button class="base-button">確定</button>
</template>

<style scoped lang="scss">
    .base-button {
        padding: 4px 12px;
        width: 96px;

        border-radius: 4px;
        font-size: 14px;
        line-height: 21px;
        border: 1px solid $gray-1;
        text-align: center;
        
        &:not(:last-of-type) {
            margin-right: 8px;
        }
    }
</style>
