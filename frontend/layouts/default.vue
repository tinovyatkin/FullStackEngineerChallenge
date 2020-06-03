<template>
  <v-app>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn v-if="$store.state.auth" @click.once="logout">Logout</v-btn>
      <VuetifyI18nLanguageSwitcherNuxt
        :languages="languages"
        :current-language="currentLanguage"
      />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer :fixed="fixed" app>
      <span>&copy; {{ new Date().getFullYear() }} Konstantin Vyatkin</span>
    </v-footer>
  </v-app>
</template>

<script>
  const Cookie = process.client ? require("js-cookie") : undefined;

  export default {
    components: {
      VuetifyI18nLanguageSwitcherNuxt: () =>
        import("vuetify-i18n-language-switcher-nuxt"),
    },
    data() {
      return {
        clipped: false,
        drawer: false,
        fixed: false,
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: "PayPay Fullstack Challenge",
        currentLanguage: "en",
        languages: [
          {
            id: "en",
            title: "English",
            flagSrc: "https://cdn.vuetifyjs.com/images/flags/us.png",
          },
          {
            id: "jp",
            title: "日本語",
            flagSrc: "https://cdn.vuetifyjs.com/images/flags/jp.png",
          },
          {
            id: "ru",
            title: "Русский",
            flagSrc: "https://cdn.vuetifyjs.com/images/flags/ru.png",
          },
        ],
      };
    },
    methods: {
      logout() {
        Cookie.remove("auth");
        Cookie.remove("roles");
        this.$store.commit("setAuth", null);
        this.$store.commit("clearRoles");
        setTimeout(() => location.reload(), 200);
      },
    },
  };
</script>
