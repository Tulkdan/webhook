import { IBitbucketWebhook } from "./interfaces.ts";
import { GChatPROPened } from "./payloads.ts";

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request))
});

const paths: {[key: string]: (body?: any) => Promise<Response>} = {
  "bitbucket/chat": handleSomething,
};

async function handleRequest(request: Request) {
  const rgx = /^http(s)?:\/\/.+((\.\w+)|(:\d+))\//;

  if (request.method !== "POST") {
    return new Response(null, {
      status: 405,
      statusText: "Method Not Allowed",
    });
  }

  if (!request.headers.has("content-type")) {
    return new Response(
      JSON.stringify({ error: "please provide 'content-type' header" }),
      {
        status: 400,
        statusText: "Bad Request",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        }
      }
    )
  }

  const contentType = request.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return new Response(null, {
      status: 415,
      statusText: "Unsupported Media Type",
    });
  }

  const path = request.url.split(rgx).pop() || '404';

  const method = (paths[path] && paths[path]) || notFoundHandler;

  const payload = await method(await request.json());
  return payload
}

function notFoundHandler() {
  return Promise.resolve(
    new Response(null, { status: 404, statusText: 'Route Not Found' })
  );
}

async function handleSomething(body: IBitbucketWebhook) {
  const responseInit = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    }
  };

  const gChatPayload = GChatPROPened(body);

  const response = await sendNotification(Deno.env.get("G_CHAT_URL") || '', gChatPayload);

  if (!response.ok) {
    return new Response(
      JSON.stringify({ message: "couldn't process your request" }),
      { ...responseInit, status: 500 }
    )
  }

  return new Response(
    JSON.stringify({ message: "Message sent successfully" }, null, 2),
    responseInit
  );
}

function sendNotification(url: string, body: any) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" }
  });
}

