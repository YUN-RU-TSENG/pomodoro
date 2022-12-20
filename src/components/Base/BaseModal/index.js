// 引入 vue component
import { h, render } from 'vue'
import BaseModal from './BaseModal.vue'

let modals = []
let index = 0

// 創建顯示 error modal
export function useBaseModal(props, { header, body, footer }) {
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
    const vm = h(BaseModal, propsData, {
        header: () => header,
        body: () => body,
        footer: () => footer,
    })

    render(vm, container)
    modals.push({ vm, id: propsData.id })

    document.body.appendChild(container)

    function close() {
        modals.splice(index, 1)
        render(null, container)
        container.remove()
    }

    // 返回關閉方法，可以使用此關閉方法直接關閉當前 modal
    return {
        close,
    }
}
