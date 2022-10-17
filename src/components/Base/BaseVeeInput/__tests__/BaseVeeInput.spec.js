import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import BaseVeeInput from '../BaseVeeInput.vue'

describe('BaseVeeInput', () => {
    it('renders properly', () => {
        const wrapper = mount(BaseVeeInput)
        expect(wrapper.text()).not.toBeNull()
    })
})
