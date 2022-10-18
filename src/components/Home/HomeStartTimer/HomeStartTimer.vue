<script setup>
defineProps({
    id: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    checkedValue: {
        type: String,
        required: true,
    },
    name: { type: String, required: true },
})

defineEmits(['update:value'])
</script>

<template>
    <label :for="id" class="home-start-timer"
        ><input
            :id="id"
            type="radio"
            :name="name"
            :value="value"
            :checked="checkedValue === value"
            @change="$emit('update:value', value)" />
        <div class="box"></div
    ></label>
</template>

<style scoped lang="scss">
.home-start-timer {
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
            url('@/assets/images/circled-play.png');
    }

    input:checked ~ .box {
        background: no-repeat center/contain
            url('@/assets/images/retro-alarm-clock.png');
    }
}
</style>
