<script setup>
import { computed } from 'vue'

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    error: {
        type: String,
        default: '',
    },
    value: {
        type: [String, Number],
        default: '',
    },
    type: {
        type: String,
        default: 'text',
    },
})

const emits = defineEmits(['update:value'])

const inputTrimValue = computed({
    get() {
        return props.value
    },
    set(event) {
        emits('update:value', event)
    },
})
</script>

<script>
export default {
    inheritAttrs: false,
}
</script>

<template>
    <label :for="id" class="base-input-label" :class="$attrs.class">
        <input
            :id="id"
            v-bind="{ ...$attrs, class: '' }"
            v-model="inputTrimValue"
            :type="type"
            class="base-input"
            autocomplete
        />
        <p v-if="error" class="error">{{ error }}</p>
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
    transition: all 0.3s ease;
}

.base-input:focus {
    border: 1px solid $gray-3;
}
.base-input-label {
    display: inline-block;
    width: 100%;
}

.error {
    padding-left: 6px;

    font-size: 12px;
    line-height: 18px;
    color: $red-2;
    text-align: left;
}
</style>
