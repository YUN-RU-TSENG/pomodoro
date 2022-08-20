import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import BaseInput from '../BaseInput.vue'

describe('BaseInput', () => {
    it('renders properly', () => {
        const wrapper = mount(BaseInput)
        expect(wrapper.text()).not.toBeNull()
    })
})
