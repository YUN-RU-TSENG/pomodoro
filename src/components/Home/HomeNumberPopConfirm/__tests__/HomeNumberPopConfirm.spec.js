import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeNumberPopConfirm from '../HomeNumberPopConfirm.vue'

describe('HomeNumberPopover', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeNumberPopConfirm)
        expect(wrapper.text()).not.toBeNull()
    })
})
