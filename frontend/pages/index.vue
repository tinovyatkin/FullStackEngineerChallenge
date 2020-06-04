<script lang="ts">
  import { Vue, Component } from "nuxt-property-decorator";

  @Component({
    middleware: ["notAuthenticated"],
  })
  export default class HomePage extends Vue {}
</script>
