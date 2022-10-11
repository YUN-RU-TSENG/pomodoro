<script setup>
import { ref } from 'vue'

const props = defineProps({
    text: {
        type: String,
        required: true,
    },
    onDestroy: {
        type: Function,
        default: () => {},
    },
})

const { isOpen, close, open } = useModalToggle()

defineExpose({
    close,
    open,
    isOpen,
})

function useModalToggle() {
    const isOpen = ref(true)

    /**
     * @doc open modal and add class of body to prevent scroll
     */
    const open = () => {
        isOpen.value = true
        document.body.classList.add('modal-open')
    }

    /**
     * @doc close modal and remove class of body
     */
    const close = () => {
        isOpen.value = false
        document.body.classList.remove('modal-open')
        props.onDestroy()
    }

    return {
        isOpen,
        open,
        close,
    }
}
</script>

<template>
    <div v-if="isOpen" class="base-alert-wrapper">
        <div class="base-alert">
            <button class="close" @click="close">
                <img
                    src="https://img.icons8.com/ios/50/000000/delete-sign--v1.png"
                    alt=""
                    width="12"
                />
            </button>
            <img
                src="https://img.icons8.com/external-anggara-glyph-anggara-putra/32/000000/external-alert-user-interface-anggara-glyph-anggara-putra.png"
                alt=""
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
