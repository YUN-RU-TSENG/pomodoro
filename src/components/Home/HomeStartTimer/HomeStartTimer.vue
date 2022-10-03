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

<template>
    <label :for="id" class="home-start-timer"
        ><input
            :id="id"
            type="checkbox"
            :checked="value"
            @change="$emit('update:value', $event.target.checked)" />
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
            url('https://img.icons8.com/material-outlined/48/000000/circled-play.png');
    }

    input:checked ~ .box {
        background: no-repeat center/contain
            url('https://img.icons8.com/material-outlined/48/7c7c7c/retro-alarm-clock.png');
    }
}
</style>
