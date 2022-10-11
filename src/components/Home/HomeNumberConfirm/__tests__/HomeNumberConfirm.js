import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeNumberConfirm from '../HomeNumberConfirm.vue'

describe('HomeNumberPopover', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeNumberConfirm)
        expect(wrapper.text()).not.toBeNull()
    })
})
