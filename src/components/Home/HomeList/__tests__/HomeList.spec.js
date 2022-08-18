import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeList from '../HomeList.vue'

describe('HomeList', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeList)
        expect(wrapper.text()).not.toBeNull()
    })
})
