import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeTimersPopConfirm from '../HomeTimersPopConfirm.vue'

describe('HomeTimersPopover', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeTimersPopConfirm)
        expect(wrapper.text()).not.toBeNull()
    })
})
