<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn v-if="$store.state.auth" @click.once="logout">Logout</v-btn>
      <VuetifyI18nLanguageSwitcherNuxt :languages="languages" />
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
        items: [
          {
            icon: "mdi-apps",
            title: "Welcome",
            to: "/",
          },
          {
            icon: "mdi-chart-bubble",
            title: "Inspire",
            to: "/inspire",
          },
        ],
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
