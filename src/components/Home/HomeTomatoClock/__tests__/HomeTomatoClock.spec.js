import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeTomatoClock from '../HomeTomatoClock.vue'

describe('HomeTomatoClock', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeTomatoClock)
        expect(wrapper.text()).not.toBeNull()
    })
})
