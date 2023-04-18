<script setup>
/* ========== component props ========== */
defineProps({
    name: { type: String, required: true },
    type: {
        type: String,
        default: 'text',
        validator(value) {
            return ['text', 'password'].includes(value)
        },
    },
    value: { type: String, required: true },
})

/* ========== component emit ========== */

defineEmits(['update:value'])
</script>

<template>
    <label class="add-task-label">
        <input
            class="add-task-input"
            :type="type"
            :name="name"
            :value="value"
            v-bind="$attrs"
            @input="$emit('update:value', $event.target.value)"
        />
    </label>
</template>

<style scoped lang="scss">
.add-task-label {
    width: 100%;
    display: inline-block;
}

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
