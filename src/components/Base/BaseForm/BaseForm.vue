<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
})

defineEmits(['submit-form'])
</script>

<template>
    <form class="form-box" @submit.prevent="$emit('submit-form')">
        <h3>{{ title }}</h3>
        <p class="subtitle">{{ text }}</p>
        <slot></slot>
    </form>
</template>

<style scoped lang="scss">
.form-box {
    width: 320px;
    margin: 0 auto;
    padding: 32px 20px;
    text-align: center;

    border-radius: 4px;
    background-color: $white-1;
    box-shadow: 0 0 4px $gray-1;

    &:not(:last-child) {
        margin-bottom: 24px;
    }

    & *:not(:last-child) {
        margin-bottom: 12px;
    }

    h3 {
        font-size: 24px;
        line-height: 36px;
        font-weight: 100;
        color: $green-1;
    }

    a {
        color: $green-1;
        cursor: pointer;
    }

    .subtitle {
        font-size: 12px;
        line-height: 18px;
        color: $gray-3;
    }
}
</style>
