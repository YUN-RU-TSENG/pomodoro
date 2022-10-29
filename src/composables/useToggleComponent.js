import { ref } from 'vue'

// toggle 元素顯示
export function useToggleComponent() {
    // 元素可見
    const visible = ref(false)

    // 開啟可見
    const open = () => {
        visible.value = true
    }

    // 關閉可見
    const close = () => {
        visible.value = false
    }

    // 開關可見
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
