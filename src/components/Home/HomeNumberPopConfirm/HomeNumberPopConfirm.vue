<script setup>
import useToggleComponent from '@/composables/useToggleComponent'

defineProps({
    value: {
        type: Number,
        required: true,
    },
})
defineEmits(['cancel', 'confirm', 'update:value'])

const { open, close, toggle, visible } = useToggleComponent()

defineExpose({ open, close, toggle })
</script>

<template>
    <BasePopover v-if="visible" style="width: 160px" class="home-number">
        <form>
            <BaseInput
                id="tomato-cache-add-form"
                class="number-input"
                type="number"
                placeholder="輸入數字"
                min="0"
                max="30"
                :value="value"
                @input="
                    $emit(
                        'update:value',
                        $event.target.value <= 30 ? $event.target.value : 0
                    )
                "
            >
            </BaseInput>
            <section class="mention-check">
                <BaseButton color="primary" @click.prevent="$emit('confirm')">
                    確定
                </BaseButton>
                <BaseButton @click.prevent="$emit('cancel')">取消</BaseButton>
            </section>
        </form>
    </BasePopover>
</template>

<style scoped lang="scss">
.home-number {
}

.home-number .number-input {
    margin-bottom: 12px;
}

.home-number .mention-check {
    display: flex;
    justify-content: space-between;
}
</style>
