import { cloneDeep } from 'lodash-es'

export function resetStore({ store }) {
    const initialState = cloneDeep(store.$state)
    store.$custom_reset = () => store.$patch(cloneDeep(initialState))
}
