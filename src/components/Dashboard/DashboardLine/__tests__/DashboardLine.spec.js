import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import DashboardLine from '../DashboardLine.vue'

describe('DashboardLine', () => {
    it('renders properly', () => {
        const wrapper = mount(DashboardLine)
        expect(wrapper.text()).not.toBeNull()
    })
})
