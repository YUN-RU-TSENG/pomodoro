import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeCalender from '../HomeCalender.vue'

describe('HomeCalender', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeCalender)
        expect(wrapper.text()).not.toBeNull()
    })
})
