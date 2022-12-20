import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import DashboardBar from '../DashboardBar.vue'

describe('DashboardBar', () => {
    it('renders properly', () => {
        const wrapper = mount(DashboardBar)
        expect(wrapper.text()).not.toBeNull()
    })
})
