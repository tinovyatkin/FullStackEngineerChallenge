<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <pay-pay-logo />
      </div>
      <v-card>
        <v-card-title class="headline"
          >Performance Reviews Requiring Your Feedback</v-card-title
        >
        <v-data-table
          :loading="loading"
          loading-text="Loading... Please wait"
          :items="reviews"
          :server-items-length="totalReviews"
          :headers="headers"
          :options.sync="options"
          class="elevation-1"
        >
          <template v-slot:item.created_at="{ item }">
            {{
              new Date(item.created_at).toLocaleDateString("en", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            }}
          </template>
        </v-data-table>
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
      return {
        totalReviews: 0,
        loading: true,
        reviews: [],
        options: {
          sortBy: ["created_at"],
        },
        headers: [
          {
            text: "Created At",
            align: "start",
            value: "created_at",
          },
          { text: "E-mail", value: "employee" },
        ],
      };
    },
    watch: {
      options: {
        async handler() {
          const data = await this.getDataFromApi();
          this.reviews = data.reviews;
          this.totalReviews = data.total;
        },
        deep: true,
      },
    },
    async mounted() {
      const data = await this.getDataFromApi();
      this.reviews = data.reviews;
      this.totalReviews = data.total;
    },
    methods: {
      async getDataFromApi() {
        try {
          this.loading = true;
          const { sortBy, sortDesc, page, itemsPerPage } = this.options;

          console.log(
            "sortBy: %s, page: %d, itemsPerPage: %d",
            sortBy[0],
            page,
            itemsPerPage,
            sortDesc[0]
          );
          const res = await fetch(
            `/rest.api/employee/feedback?sortBy=${
              sortBy[0] || "name"
            }&page=${page}&itemsPerPage=${itemsPerPage}&sortDesc=${
              sortDesc[0] === false ? 1 : -1
            }`,
            {
              credentials: "include",
            }
          );
          if (!res.ok) throw new Error(res.statusText);
          const data = await res.json();
          console.log(data);
          return data;
        } catch (err) {
          console.error(err);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>
