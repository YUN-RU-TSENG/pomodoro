import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import HomeTimeSum from '../HomeTimeSum.vue'

describe("HelloWorld", () => {
  it("renders properly", () => {
    const wrapper = mount(HomeTimeSum);
    expect(wrapper.text()).not.toBeNull();
  });
});
