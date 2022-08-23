import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeDropdown from '../HomeDropdown.vue'

describe('HelloWorld', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeDropdown)
      expect(wrapper.text()).not.toBeNull()
    })
})
