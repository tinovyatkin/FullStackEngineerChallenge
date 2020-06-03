<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <pay-pay-logo />
      </div>
      <v-card>
        <v-card-title class="headline">Hello</v-card-title>
        <v-card-text>
          <div v-if="$store.state.auth">
            <p>
              You are authenticated. You can see the
              <NuxtLink to="/secret">secret page</NuxtLink>!
            </p>
          </div>
          <v-btn v-else rounded nuxt to="/login">Login</v-btn>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import PayPayLogo from "~/components/PayPayLogo.vue";

export default {
  middleware: 'notAuthenticated',
  components: {
    PayPayLogo,
  },
  data() {
    return {
      showPassword: false,
    };
  },
};
</script>
