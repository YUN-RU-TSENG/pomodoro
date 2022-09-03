import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import BaseAlert from '../BaseAlert.vue'

describe('BaseAlert', () => {
    it('renders properly', () => {
        const wrapper = mount(BaseAlert)
        expect(wrapper.text()).not.toBeNull()
    })
})
