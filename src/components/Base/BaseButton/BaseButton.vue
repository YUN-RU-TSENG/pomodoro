<script setup>
defineProps({
    color: {
        type: String,
        default: 'default',
        validator(value) {
            return ['default', 'primary'].includes(value)
        },
    },
})
</script>

<template>
    <button :class="['base-button', color]"><slot>確定</slot></button>
</template>

<style scoped lang="scss">
button.base-button {
    padding: 4px 12px;
    width: 96px;

    border-radius: 4px;
    font-size: 14px;
    line-height: 21px;

    text-align: center;
    transition: all 0.3s ease;

    &:not(:last-of-type) {
        margin-right: 8px;
    }
}

.base-button.primary {
    border: 1px solid $green-1;
    background-color: $green-1;
    color: $white-1;

    &:hover {
        background-color: $green-2;
    }
}

.base-button.default {
    border: 1px solid $gray-1;
    background-color: $white-1;

    &:hover {
        background-color: $gray-0;
    }
}
</style>
