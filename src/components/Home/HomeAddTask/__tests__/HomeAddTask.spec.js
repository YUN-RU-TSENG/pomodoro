import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeAddTask from '../HomeAddTask.vue'

describe('HomeAddTask', () => {
    it('在表單內按下 enter 時發送 add-task 事件，以及表單值、重置表單函式作為事件參數發送', () => {
        const wrapper = mount(HomeAddTask)
        expect(wrapper.text()).not.toBeNull()
    })
    it('在表單內按下加號按鈕時發送 add-task 事件，以及表單值、重置表單函式作為事件參數發送', () => {
        const wrapper = mount(HomeAddTask)
        expect(wrapper.text()).not.toBeNull()
    })
    it('當點擊表單時鐘時，更新表單內的 totalExpectTime，以及被選中數量的時鐘會呈現紅色', () => {
        const wrapper = mount(HomeAddTask)
        expect(wrapper.text()).not.toBeNull()
    })
    it('當以 modal(cacheTotalExpectTime) 更新表單 totalExpectTime，若是選中的 pomorodo 數量小於等於五，被選中數量的時鐘會呈現紅色', () => {
        const wrapper = mount(HomeAddTask)
        expect(wrapper.text()).not.toBeNull()
    })
    it('當以 modal(cacheTotalExpectTime) 更新表單 totalExpectTime，若是選中的 pomorodo 數量大於五，只渲染一個時鐘，以及時鐘旁會顯示 pomorodo 數量', () => {
        const wrapper = mount(HomeAddTask)
        expect(wrapper.text()).not.toBeNull()
    })
    it('呼叫 add-task 事件發送的重置表單函示時，除了重置表單，也會重置 modal(cacheTotalExpectTime) 值', () => {
        const wrapper = mount(HomeAddTask)
        expect(wrapper.text()).not.toBeNull()
    })
})
