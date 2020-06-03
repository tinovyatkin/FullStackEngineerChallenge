<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <pay-pay-logo />
      </div>
      <v-card>
        <v-card-title class="headline">Manage Employees</v-card-title>
        <v-data-table
          :loading="loading"
          loading-text="Loading... Please wait"
          :items="employees"
          :server-items-length="totalEmployees"
          :headers="headers"
          :options.sync="options"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <!-- <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon> -->
            <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon>
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
        totalEmployees: 0,
        loading: true,
        employees: [],
        options: {
          sortBy: ["name"],
        },
        headers: [
          {
            text: "Name",
            align: "start",
            value: "name",
          },
          { text: "E-mail", value: "email" },
          { text: "Actions", value: "actions", sortable: false },
        ],
      };
    },
    watch: {
      options: {
        async handler() {
          const data = await this.getDataFromApi();
          this.employees = data.employees;
          this.totalEmployees = data.total;
        },
        deep: true,
      },
    },
    async mounted() {
      const data = await this.getDataFromApi();
      this.employees = data.employees;
      this.totalEmployees = data.total;
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
            `/rest.api/admin/employees?sortBy=${
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

      async deleteItem(item) {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
          const res = await fetch(`/rest.api/admin/employees/${item.email}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!res.ok) throw new Error(res.statusText);
          const data = await this.getDataFromApi();
          this.employees = data.employees;
          this.totalEmployees = data.total;
        } catch (err) {
          console.error(err);
        }
      },
    },
  };
</script>
