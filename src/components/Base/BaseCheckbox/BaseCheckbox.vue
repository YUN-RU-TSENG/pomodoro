<script setup></script>

<template>
    <label for="checkbox" class="base-checkbox"
        ><input id="checkbox" type="checkbox" />
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
