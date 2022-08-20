import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import BasePopover from '../BasePopover.vue'

describe('BasePopover', () => {
    it('renders properly', () => {
        const wrapper = mount(BasePopover)
        expect(wrapper.text()).not.toBeNull()
    })
})
