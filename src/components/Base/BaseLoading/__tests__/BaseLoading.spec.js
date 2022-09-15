import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import BaseLoading from '../BaseLoading.vue'

describe('BaseLoading', () => {
    it('renders properly', () => {
        const wrapper = mount(BaseLoading)
        expect(wrapper.text()).not.toBeNull()
    })
})
