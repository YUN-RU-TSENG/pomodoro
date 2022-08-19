import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ExampleComponent from '../HomeTaskEditBar.vue'

describe('HomeTaskEditBar', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeTaskEditBar)
        expect(wrapper.text()).not.toBeNull()
    })
})
