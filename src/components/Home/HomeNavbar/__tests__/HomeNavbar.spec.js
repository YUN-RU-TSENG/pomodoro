import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeNavbar from '../HomeNavbar.vue'

describe('HomeNavbar', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeNavbar)
        expect(wrapper.text()).not.toBeNull()
    })
})
