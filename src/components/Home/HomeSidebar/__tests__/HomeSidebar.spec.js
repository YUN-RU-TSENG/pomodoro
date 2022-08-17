import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeSidebar from '../HomeSidebar.vue'

describe('HomeSidebar', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeNavbar)
        expect(wrapper.text()).not.toBeNull()
    })
})
