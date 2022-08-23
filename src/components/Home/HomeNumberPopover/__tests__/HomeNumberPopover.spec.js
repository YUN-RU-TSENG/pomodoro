import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeNumberPopover from '../HomeNumberPopover.vue'

describe('HomeNumberPopover', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeNumberPopover)
        expect(wrapper.text()).not.toBeNull()
    })
})
