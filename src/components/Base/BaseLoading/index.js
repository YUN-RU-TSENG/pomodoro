// 引入 vue component
import { h, render } from 'vue'
import BaseLoading from './BaseLoading.vue'

let modals = []
let index = 0

// 創建顯示 error modal
export function useBaseLoading(props) {
    // 創建顯示 modal 的 container
    const container = document.createElement('div')
    container.className = `base-modal-${index++}-container`

    // 需要設置顯示 modal 的 props
    const id = `base-modal-${index++}`
    const propsData = {
        ...props,
        id,
        onDestroy: close,
    }

    // 創建 modal 並顯示
    const vm = h(BaseLoading, propsData)
    render(vm, container)
    modals.push({ vm, id: propsData.id })

    document.body.appendChild(container)

    const timeoutId = setTimeout(() => {
        close()
    }, 3000)

    function close() {
        modals.splice(index, 1)
        render(null, container)
        container.remove()
        clearTimeout(timeoutId)
    }

    // 返回關閉方法，可以使用此關閉方法直接關閉當前 modal
    return {
        close,
    }
}
