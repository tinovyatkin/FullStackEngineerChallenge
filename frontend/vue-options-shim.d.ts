declare module "vue/types/options" {
  interface ComponentOptions<V extends Vue> {
    layout?: string;
    middleware?: string | string[];
  }
}
