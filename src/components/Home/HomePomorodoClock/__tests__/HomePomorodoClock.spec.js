import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomePomorodoClock from '../HomePomorodoClock.vue'

describe('HomePomorodoClock', () => {
    it('renders properly', () => {
        const wrapper = mount(HomePomorodoClock)
        expect(wrapper.text()).not.toBeNull()
    })
})
