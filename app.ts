import { Application, config } from "./deps.ts";
import BitBucketRoutes from "./routes/bitbucket.ts";

config({ export: true, safe: true });

const PORT = Number(Deno.env.get("PORT")) || 3000;

const app = new Application();

app.addEventListener("listen", (
  { hostname, port, secure },
) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${hostname ??
      "localhost"}:${port}`,
  );
});

app.addEventListener("error", (evt) => {
  console.log(evt.error);
})

app.use(async (ctx, next) => {
  ctx.state = {
    gChatUrl: Deno.env.get("G_CHAT_URL") || "",
    teamsUrl: Deno.env.get("TEAMS_URL") || "",
  };
  await next();
});

app.use(BitBucketRoutes.routes());
app.use(BitBucketRoutes.allowedMethods());

app.use(async (ctx) => {
  const { url, data } = ctx.state.fetch;

  await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });

  ctx.response.body = JSON.stringify({ message: "Update sent" });
});

await app.listen({ port: PORT });
