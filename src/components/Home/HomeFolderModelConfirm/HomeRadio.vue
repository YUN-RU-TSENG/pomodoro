<script setup>
import { computed } from 'vue'

/*========== component props ========== */

const props = defineProps({
    name: { type: String, required: true },
    value: { type: String, required: true },
    id: {
        type: String,
        required: true,
    },
    color: { type: String, required: true },
    checkValue: { type: String, required: true },
})

/* ========== component emit ========== */

const emit = defineEmits(['update:check-value'])

const inputValue = computed({
    get() {
        return props.checkValue
    },
    set(value) {
        console.log(value)
        emit('update:check-value', value)
    },
})
</script>

<template>
    <div>
        <label class="base-radio" :for="id">
            <input
                :id="id"
                v-bind="$attrs"
                v-model="inputValue"
                type="radio"
                :name="name"
                :value="color"
            />
            <div
                class="box"
                :style="{
                    backgroundColor: color,
                }"
            ></div>
        </label>
    </div>
</template>

<style scoped lang="scss">
.base-radio {
    display: inline-block;

    cursor: pointer;

    input {
        display: none;
    }

    .box {
        width: 24px;
        height: 24px;
        border-radius: 50%;
    }

    input:checked ~ .box {
        background: url('@/assets/images/experimental-checkmark-puffy.png');
    }
}
</style>
