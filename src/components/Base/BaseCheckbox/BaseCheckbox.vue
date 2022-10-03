<script setup>
defineProps({
    id: {
        type: String,
        default: () => new Date().getTime().toString(),
    },
    value: {
        type: Boolean,
        required: true,
    },
})
</script>

<script>
export default {
    inheritAttrs: false,
}
</script>

<template>
    <label :for="id" class="base-checkbox"
        ><input
            :id="id"
            v-bind="{ ...$attrs, class: '' }"
            type="checkbox"
            :checked="value"
            @change="$emit('update:value', $event.target.checked)" />
        <div class="box"></div
    ></label>
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
