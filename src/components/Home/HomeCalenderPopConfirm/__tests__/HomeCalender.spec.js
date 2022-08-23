import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeCalenderPopConfirm from '../HomeCalenderPopConfirm.vue'

describe('HomeCalenderPopConfirm', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeCalenderPopConfirm)
        expect(wrapper.text()).not.toBeNull()
    })
})
