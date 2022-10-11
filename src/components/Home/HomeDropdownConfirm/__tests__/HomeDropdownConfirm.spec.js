import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeDropdownConfirm from '../HomeDropdownConfirm.vue'

describe('HelloWorld', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeDropdownConfirm)
        expect(wrapper.text()).not.toBeNull()
    })
})
