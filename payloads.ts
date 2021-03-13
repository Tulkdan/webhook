import { IBitbucketWebhook, ITeamsConnector } from "./interfaces.ts";

const createPullRequestUri = (repoName: string, prId: number) => {
  const url = Deno.env.get("PR_URL") || "";

  return url
    .replace(/REPO_NAME/, repoName)
    .replace(/ID/, prId.toString());
};

export function PROpened(receivedPayload: IBitbucketWebhook): ITeamsConnector {
  const { pullRequest } = receivedPayload;

  return {
    summary: "Pull Request Criado",
    "@type": "MessageCard",
    title: `Pull Request Criado: ${pullRequest.title}`,
    sections: [{
      facts: [
        {
          name: "Criador:",
          value: pullRequest.author.user.displayName,
        },
        {
          name: "Servico:",
          value: pullRequest.fromRef.repository.name,
        },
        {
          name: "Estado:",
          value: pullRequest.state,
        },
        {
          name: "Branch de origem:",
          value: pullRequest.fromRef.displayId,
        },
        {
          name: "Branch de destino:",
          value: pullRequest.toRef.displayId,
        },
      ],
      text: pullRequest.description,
    }],
    potentialAction: [{
      "@type": "OpenUri",
      name: "Abrir para revisao",
      targets: [{
        os: "default",
        uri: createPullRequestUri(
          pullRequest.fromRef.repository.name,
          pullRequest.id,
        ),
      }],
    }],
  };
}

export function GChatPROPened(receivedPayload: IBitbucketWebhook) {
  const { pullRequest } = receivedPayload;

  return {
    cards: [
      {
        header: { title: `Pull Request Criado: ${pullRequest.title}` },
        sections: [
          {
            widgets: [
              {
                keyValue: {
                  topLabel: "Criador",
                  content: pullRequest.author.user.displayName,
                  icon: "PERSON",
                },
              },
              {
                keyValue: {
                  topLabel: "Servico",
                  content: pullRequest.fromRef.repository.name,
                  icon: "STORE",
                },
              },
              {
                keyValue: {
                  topLabel: "Estado",
                  content: pullRequest.state,
                  icon: "EVENT_SEAT",
                },
              },
              {
                keyValue: {
                  topLabel: "Branch de origem",
                  content: pullRequest.fromRef.displayId,
                  icon: "FLIGHT_DEPARTURE",
                },
              },
              {
                keyValue: {
                  topLabel: "Branch de destingo",
                  content: pullRequest.toRef.displayId,
                  icon: "FLIGHT_ARRIVAL",
                },
              },
            ],
          },
          {
            header: "Descricao",
            widgets: [
              {
                textParagraph: { text: pullRequest.description },
              },
            ],
          },
          {
            widgets: [
              {
                buttons: [
                  {
                    textButton: {
                      text: "Abrir para revisao",
                      onClick: {
                        openLink: {
                          url: createPullRequestUri(
                            pullRequest.fromRef.repository.name,
                            pullRequest.id,
                          ),
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}
