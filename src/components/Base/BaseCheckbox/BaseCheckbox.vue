<script setup>
import { computed } from 'vue'

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

const emits = defineEmits(['update:value'])

const checkboxValue = computed({
    set(newValue) {
        emits('update:value', newValue)
    },
    get() {
        return props.value
    },
})
</script>

<script>
export default {
    inheritAttrs: false,
}
</script>

<template>
    <label :for="id" class="base-checkbox">
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
            url('https://img.icons8.com/fluency-systems-filled/48/000000/unchecked-checkbox.png');
    }

    input:checked ~ .box {
        background: no-repeat center/contain
            url('https://img.icons8.com/fluency-systems-filled/48/000000/checked-checkbox.png');
    }
}
</style>
