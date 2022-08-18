import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import BaseCheckbox from '../BaseCheckbox.vue'

describe('BaseCheckbox', () => {
    it('renders properly', () => {
        const wrapper = mount(BaseCheckbox)
        expect(wrapper.text()).not.toBeNull()
    })
})
