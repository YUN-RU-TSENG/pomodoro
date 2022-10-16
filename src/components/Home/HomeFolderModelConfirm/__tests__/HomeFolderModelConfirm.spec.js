import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import HomeFolderModelConfirm from '../HomeFolderModelConfirm.vue'

describe('HomeFolderModelConfirm', () => {
    it('renders properly', () => {
        const wrapper = mount(HomeFolderModelConfirm)
        expect(wrapper.text()).not.toBeNull()
    })
})
