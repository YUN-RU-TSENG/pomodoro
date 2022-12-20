import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import BaseForm from '../BaseForm.vue'

describe('HelloWorld', () => {
    it('renders properly', () => {
        const wrapper = mount(BaseForm)
        expect(wrapper.text()).not.toBeNull()
    })
})
