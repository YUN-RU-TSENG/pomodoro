import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import BaseDropdown from '../BaseDropdown.vue'

describe('HelloWorld', () => {
    it('renders properly', () => {
        const wrapper = mount(BaseDropdown)
        expect(wrapper.text()).not.toBeNull()
    })
})
