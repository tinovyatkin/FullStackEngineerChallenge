import { shallowMount } from "@vue/test-utils";
import Logo from "@/components/PayPayLogo.vue";

describe("PayPayLogo.vue", () => {
  const wrapper = shallowMount(Logo);

  it("renders the correct markup", () => {
    expect(wrapper.html()).toMatchInlineSnapshot(
      `<img alt="PayPay Logo" src="/logo_paypay.svg" class="PayPayLogo">`
    );
  });

  it("has an image", () => {
    expect(wrapper.find("image")).toBeDefined();
  });
});
