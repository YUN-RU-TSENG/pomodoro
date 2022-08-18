import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeSidebar from '../HomeSidebar.vue'

describe('HomeSidebar', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeSidebar)
        expect(wrapper.text()).not.toBeNull()
    })
})
