import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import BaseNavbar from '../BaseNavbar.vue'

describe('BaseNavbar', () => {
    it('renders properly', () => {
        const wrapper = mount(BaseNavbar)
        expect(wrapper.text()).not.toBeNull()
    })
})
