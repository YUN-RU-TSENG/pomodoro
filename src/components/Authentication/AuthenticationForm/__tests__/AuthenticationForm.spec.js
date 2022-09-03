import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import AuthenticationForm from '../AuthenticationForm.vue'

describe('AuthenticationForm', () => {
    it('renders properly', () => {
        const wrapper = mount(AuthenticationForm)
        expect(wrapper.text()).not.toBeNull()
    })
})
