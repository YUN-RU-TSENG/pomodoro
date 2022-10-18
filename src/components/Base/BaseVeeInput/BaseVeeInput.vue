<script setup>
import { computed, toRef } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps({
    name: { type: String, required: true },
    type: { type: String, default: 'text' },
})

const name = toRef(props, 'name')

const { value, errorMessage, handleChange } = useField(name, undefined, {
    validateOnValueUpdate: false,
})

const validationListeners = computed(() => {
    // Lazy
    if (!errorMessage.value) {
        return {
            blur: handleChange,
            change: handleChange,
            // 可以作為事件處理器，handleChange 會處理 event。當傳地的不是 event，handleChange 會直接設置為 field 新值
            input: (e) => handleChange(e, false),
        }
    }
    // Aggressive
    return {
        blur: handleChange,
        change: handleChange,
        input: handleChange,
    }
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
            class="base-input"
            :type="type"
            :name="name"
            :value="value"
            v-bind="$attrs"
            autocomplete
            v-on="validationListeners"
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
    color: $green-1;
    text-align: left;
}
</style>
