import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomePomodoroClock from '../HomePomodoroClock.vue'

describe('HomePomodoroClock', () => {
    it('renders properly', () => {
        const wrapper = mount(HomePomodoroClock)
        expect(wrapper.text()).not.toBeNull()
    })
})
