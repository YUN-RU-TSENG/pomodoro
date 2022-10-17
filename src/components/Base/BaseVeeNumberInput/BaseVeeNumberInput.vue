<script setup>
import { toRef } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps({
    name: { type: String, required: true },
})

const name = toRef(props, 'name')

const { value, errorMessage } = useField(name, undefined, {
    validateOnValueUpdate: false,
})
</script>

<script>
export default {
    inheritAttrs: false,
}
</script>

<template>
    <label class="base-input-label" :class="$attrs.class">
        <input
            v-model="value"
            type="number"
            class="base-input"
            :name="name"
            v-bind="{ ...$attrs, class: '' }"
            autocomplete
        />
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
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
