<script setup>
defineProps({
    value: {
        type: String,
        required: true,
    },
})

defineEmits(['update:value'])
</script>

<template>
    <input
        type="text"
        class="add-task-input"
        :value="value"
        @input="$emit('update:value', $event.target.value.trim())"
    />
</template>

<style scoped lang="scss">
.add-task-input {
    width: 100%;
    font-size: 14px;
    line-height: 21px;
    color: $gray-3;

    *::placeholder {
        color: $gray-2;
    }
}
</style>
