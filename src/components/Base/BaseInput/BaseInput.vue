<script setup></script>

<template>
    <label for="input" class="base-input-label">
        <input type="text" class="base-input" id="input" />
    </label>
</template>

<style scoped lang="scss">
    .base-input {
        width: 100%;
        padding: 6px;

        border: 1px solid $gray-1;
        border-radius: 4px;
        font-size: 14px;
        line-height: 21px;
    }
    
    .base-input-label {
        display: inline-block;
        width: 100%;
    }
</style>
