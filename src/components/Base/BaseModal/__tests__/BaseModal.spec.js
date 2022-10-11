import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import BaseModal from '../BaseModal.vue'

describe('BaseModal', () => {
    it('renders properly', () => {
        const wrapper = mount(BaseModal)
        expect(wrapper.text()).not.toBeNull()
    })
})
