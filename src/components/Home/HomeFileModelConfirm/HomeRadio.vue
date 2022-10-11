<script setup>
import { toRef } from 'vue'
import { useField } from 'vee-validate'

const props = defineProps({
    name: { type: String, required: true },
    value: { type: String, required: true },
    id: {
        type: String,
        required: true,
    },
    color: { type: String, required: true },
})

const name = toRef(props, 'name')

const { value: checkedValue, handleChange } = useField(name)
</script>

<template>
    <div>
        <label class="base-radio" :for="id">
            <input
                :id="id"
                type="radio"
                :name="name"
                :value="value"
                :checked="checkedValue == value"
                v-bind="$attrs"
                @change="handleChange"
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
        background: url(https://img.icons8.com/puffy/24/ffffff/experimental-checkmark-puffy.png);
    }
}
</style>
