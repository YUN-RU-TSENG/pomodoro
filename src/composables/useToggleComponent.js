import { ref } from 'vue'

export function useToggleComponent() {
    const visible = ref(false)

    const open = () => {
        visible.value = true
    }
    const close = () => {
        visible.value = false
    }
    const toggle = () => {
        visible.value = !visible.value
    }

    return {
        open,
        close,
        toggle,
        visible,
    }
}
