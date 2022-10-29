<script setup>
import { useToggleComponent } from '@/composables/useToggleComponent'

/* ========== component props ========== */

defineProps({
    text: {
        type: String,
        required: true,
    },
    onDestroy: {
        type: Function,
        default: () => {},
    },
})

/* ========== component logic ========== */

const { visible: isOpen, close, open } = useToggleComponent()

isOpen.value = true

/* ========== component expose ========== */

defineExpose({
    close,
    open,
    isOpen,
})
</script>

<template>
    <div v-if="isOpen" class="base-alert-wrapper">
        <div class="base-alert">
            <button class="close" @click="close">
                <img src="@/assets/images/delete-sign--v1.png" width="12" />
            </button>
            <img
                src="@/assets/images/external-alert-user-interface-anggara-glyph-anggara-putra.png"
                width="20"
            />
            <p>{{ text }}</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.base-alert-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.base-alert {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 240px;
    padding: 24px;

    transform: translate(-50%, -50%);
    background-color: #7f7f7f70;
    border-radius: 4px;
    text-align: center;

    img {
        margin-bottom: 12px;
    }

    p {
        font-size: 12px;
        line-height: 18px;
    }

    .close {
        font-size: 0;
        position: absolute;
        top: 4px;
        right: 4px;
    }
}
</style>
