<script setup>
import { computed } from 'vue'

/* ========== component props ========== */

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    value: {
        type: [Boolean, Array],
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
})

/* ========== component emit ========== */

const emit = defineEmits(['update:value'])

/* ========== component logic ========== */

const checkboxValue = computed({
    set(newValue) {
        emit('update:value', newValue)
    },
    get() {
        return props.value
    },
})
</script>

<template>
    <label :for="id" :class="['base-checkbox', $attrs.class]">
        <input
            :id="id"
            v-bind="{ ...$attrs, class: '' }"
            v-model="checkboxValue"
            type="checkbox"
            :name="name"
        />
        <div class="box"></div>
    </label>
</template>

<style scoped lang="scss">
.base-checkbox {
    display: inline-block;
    font-size: 0;

    cursor: pointer;

    input {
        display: none;
    }

    .box {
        display: inline-block;
        width: 20px;
        height: 20px;
        background: no-repeat center/contain
            url('@/assets/images/unchecked-checkbox.png');
    }

    input:checked ~ .box {
        background: no-repeat center/contain
            url('@/assets/images/checked-checkbox.png');
    }
}
</style>
