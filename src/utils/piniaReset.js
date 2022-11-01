import { cloneDeep } from 'lodash-es'

// 透過 $patch、$state 實現 pinia reset 成初始狀態（ps: pinia 配合 setup 語法下沒有官方提供 $reset 方法，需要自己實現
// doc: https://github.com/YUN-RU-TSENG/me/issues/108
export function resetStore({ store }) {
    const initialState = cloneDeep(store.$state)
    store.$custom_reset = () => store.$patch(cloneDeep(initialState))
}
