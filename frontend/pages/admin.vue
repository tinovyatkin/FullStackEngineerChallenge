<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <pay-pay-logo />
      </div>
      <v-card>
        <v-card-title class="headline">Welcome to Admin Dashboard</v-card-title>
        <v-list rounded>
          <v-subheader>ACTIONS</v-subheader>
          <v-list-item-group color="primary">
            <v-list-item nuxt to="/manage-employees">
              <v-list-item-content>
                <v-list-item-title>View/remove employees</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item disabled>
              <v-list-item-content>
                <v-list-item-title
                  >Add/update/view performance reviews</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-list-item disabled>
              <v-list-item-content>
                <v-list-item-title
                  >Assign employees to participate in another employee's
                  performance review</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  import PayPayLogo from "~/components/PayPayLogo.vue";

  export default {
    middleware: "authenticated",
    components: {
      PayPayLogo,
    },
    data() {
      return {};
    },
  };
</script>
