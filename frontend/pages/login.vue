<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <pay-pay-logo />
      </div>
      <form @submit.prevent="onSubmit">
        <v-card>
          <v-card-title class="headline">Please login:</v-card-title>
          <v-card-text>
            <p>
              Use <b>admin@test.com</b> / <b>admin</b> for test admin account or
              <br />
              <b>employee@test.com</b> / <b>employee1</b> for an employee
              account
            </p>

            <v-text-field
              id="email"
              ref="email"
              v-model="email"
              type="email"
              label="User email"
              prepend-icon="mdi-account-circle"
              autocomplete="email"
              required
              :disabled="loading"
            />
            <v-text-field
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              autocomplete="current-password"
              required
              :disabled="loading"
              @click:append="showPassword = !showPassword"
            />
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="orange"
            ></v-progress-circular>
            <v-spacer />
            <v-btn type="submit" :disabled="loading" color="primary"
              >Login</v-btn
            >
          </v-card-actions>
          <v-alert v-if="error" type="error">
            Failed to login with provided credentials.
          </v-alert>
        </v-card>
      </form>
    </v-flex>
  </v-layout>
</template>

<script>
  import PayPayLogo from "~/components/PayPayLogo.vue";
  const Cookie = process.client ? require("js-cookie") : undefined;

  export default {
    middleware: "notAuthenticated",
    components: {
      PayPayLogo,
    },
    data() {
      return {
        email: "",
        password: "",
        showPassword: false,
        loading: false,
        error: false,
      };
    },
    methods: {
      async onSubmit() {
        try {
          this.error = false;
          this.loading = true;
          const res = await fetch("/rest.api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: this.email,
              password: this.password,
            }),
            credentials: "include",
          });
          // a little wait to show our nice progress and form fields disable
          await new Promise((resolve) => setTimeout(resolve, 700));
          if (!res.ok) throw new Error(res.statusText);
          const credentials = await res.json();
          this.$store.commit("setAuth", credentials.token); // mutating to store for client rendering
          Cookie.set("auth", credentials.token); // saving token in cookie for server rendering
          this.$store.commit("setRoles", credentials.roles);
          this.$router.push("/");
        } catch (err) {
          console.error(err);
          this.$nextTick(() => this.$refs.email.focus());
          this.error = true;
          this.showPassword = true;
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>
