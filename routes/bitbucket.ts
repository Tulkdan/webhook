import { Router } from "../deps.ts";
import { GChatPROPened, PROpened } from "../payloads.ts";
import { BitbucketEventKeys, IBitbucketWebhook } from "../interfaces.ts";

// TODO: search along to remove this any and use the "assert"
async function teamsRoute(ctx: any, next: Function) {
  ctx.assert(ctx.state.teamsUrl !== "", 500);

  const result = ctx.request.body({ type: "json" });
  const body = await result.value;

  const createPayloadBasedEvent = ((payload: IBitbucketWebhook) => {
    switch (payload.eventKey) {
      case BitbucketEventKeys.OPENED:
        return PROpened(payload);
    }
  });

  ctx.state.fetch = {
    url: ctx.state.teamsUrl,
    data: createPayloadBasedEvent(body),
  };

  await next();
}

async function gChatRoute(ctx: any, next: Function) {
  ctx.assert(ctx.state.gChatUrl !== "", 500);

  const result = ctx.request.body({ type: "json" });
  const body = await result.value;

  const createPayloadBasedEvent = ((payload: IBitbucketWebhook) => {
    switch (payload.eventKey) {
      case BitbucketEventKeys.OPENED:
        return GChatPROPened(payload);
    }
  });

  ctx.state.fetch = {
    url: ctx.state.gChatUrl,
    data: createPayloadBasedEvent(body),
  };

  await next();
}

const router = new Router({ prefix: "/bitbucket" });
router
  .post("/teams", teamsRoute)
  .post("/chat", gChatRoute);

export default router;
