import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeTimersPopover from '../HomeTimersPopover.vue'

describe('HomeTimersPopover', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeTimersPopover)
        expect(wrapper.text()).not.toBeNull()
    })
})
