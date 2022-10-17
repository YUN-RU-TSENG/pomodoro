import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import BaseVeeNumberInput from '../BaseVeeNumberInput.vue'

describe('BaseVeeNumberInput', () => {
    it('renders properly', () => {
        const wrapper = mount(BaseVeeNumberInput)
        expect(wrapper.text()).not.toBeNull()
    })
})
