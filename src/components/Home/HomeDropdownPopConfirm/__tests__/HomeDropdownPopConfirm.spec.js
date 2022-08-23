import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeDropdownPopConfirm from '../HomeDropdownPopConfirm.vue'

describe('HelloWorld', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeDropdownPopConfirm)
        expect(wrapper.text()).not.toBeNull()
    })
})
