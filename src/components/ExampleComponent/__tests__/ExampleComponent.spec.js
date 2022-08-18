import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ExampleComponent from '../ExampleComponent.vue'

describe('HelloWorld', () => {
    it('renders properly', () => {
        const wrapper = mount(ExampleComponent)
        expect(wrapper.text()).toContain('ExampleComponent')
    })
})
