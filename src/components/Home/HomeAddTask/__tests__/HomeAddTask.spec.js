import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeAddTask from '../HomeAddTask.vue'

describe('HomeAddTask', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeAddTask)
        expect(wrapper.text()).not.toBeNull()
    })
})
