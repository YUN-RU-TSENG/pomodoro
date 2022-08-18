import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeStartTimer from '../HomeStartTimer.vue'

describe('HomeStartTimer', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeStartTimer)
        expect(wrapper.text()).not.toBeNull()
    })
})
