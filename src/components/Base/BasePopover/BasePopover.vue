<script setup>
import { useFloating } from '@/composables/useFloating'
import { useToggleComponent } from '@/composables/useToggleComponent'

defineProps({
    width: {
        type: String,
        default: '300px',
    },
})

const {
    x,
    y,
    reference,
    floating,
    strategy,
    arrow,
    arrowStrategy,
    arrowX,
    arrowY,
    staticSide,
} = useFloating()

const { close, toggle, visible } = useToggleComponent()
</script>

<template>
    <section ref="reference" class="base-popper-button-wrapper" @click="toggle">
        <slot name="button">
            <button class="base-popper-button">按鈕</button>
        </slot>
    </section>
    <section
        v-show="visible"
        ref="floating"
        class="base-popover"
        :style="{
            position: strategy,
            top: y,
            left: x,
            width,
        }"
    >
        <slot name="model" :close="close">內容</slot>
        <div
            ref="arrow"
            class="popover-arrow"
            :style="{
                position: arrowStrategy,
                top: arrowY,
                left: arrowX,
                [staticSide]: '-4px',
            }"
        ></div>
    </section>
</template>

<style scoped lang="scss">
.base-popover {
    margin-top: 12px;
    padding: 12px;
    z-index: 99;
    width: 300px;

    border-radius: 4px;
    background-color: $white-1;
    box-shadow: 0 0 4px $gray-1;
}

.base-popper-button-wrapper {
    display: inline-block;
}

.popover-arrow {
    width: 8px;
    height: 8px;
    z-index: 9;

    background-color: $white-1;
    box-shadow: -1px -1px 2px $gray-1;
    transform: rotate(45deg);
}
</style>
