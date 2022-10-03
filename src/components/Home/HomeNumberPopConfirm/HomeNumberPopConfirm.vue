<script setup>
defineProps({
    value: {
        type: Number,
        required: true,
    },
})
defineEmits(['cancel', 'confirm', 'update:value'])
</script>

<template>
    <form>
        <BaseInput
            id="tomato-cache-add-form"
            class="number-input"
            type="number"
            placeholder="輸入數字"
            min="0"
            max="30"
            :value="value"
            @input="$emit('update:value', Number($event.target.value))"
        >
        </BaseInput>
        <section class="mention-check">
            <BaseButton color="primary" @click.prevent="$emit('confirm')">
                確定
            </BaseButton>
            <BaseButton @click.prevent="$emit('cancel')">取消</BaseButton>
        </section>
    </form>
</template>

<style scoped lang="scss">
.number-input {
    margin-bottom: 12px;
}

.mention-check {
    display: flex;
    justify-content: space-between;
}
</style>
