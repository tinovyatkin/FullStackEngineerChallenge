import path from "path";
import { Nuxt, Builder } from "nuxt";
import config from "../../nuxt.config.js";

describe("server routes tests", () => {
  // We keep the nuxt and server instance
  // So we can close them at the end of the test
  let nuxt: Nuxt;

  // Init Nuxt.js and create a server listening on localhost:4000
  beforeAll(async () => {
    jest.setTimeout(30000);

    nuxt = new Nuxt({
      ...config,
      dev: true,
      rootDir: path.resolve(__dirname, "../.."),
    });
    await new Builder(nuxt).build();
    await nuxt.server.listen(0);
  });

  // Close server and ask nuxt to stop listening to file changes
  afterAll(() => {
    nuxt.close();
  });

  // Example of testing only generated html
  test("Route / exits and render HTML", async (t) => {
    const context = {};
    const { html } = await nuxt.server.renderRoute("/", context);
    expect(html).toContain('<h1 class="red">Hello world!</h1>');
  });

  // Example of testing via dom checking
  test("Route / exits and render HTML with CSS applied", async (t) => {
    const context = {};
    const { html } = await nuxt.server.renderRoute("/", context);
    document.write(html);
    const element = document.querySelector(".red");
    expect(element).not.toBeNull();
  });
});
