import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeFileModelConfirm from '../HomeFileModelConfirm.vue'

describe('HomeFileModelConfirm', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeFileModelConfirm)
        expect(wrapper.text()).not.toBeNull()
    })
})
