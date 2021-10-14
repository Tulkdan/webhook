import { IBitbucketWebhook } from "./interfaces.ts";

const createPullRequestUri = (repoName: string, prId: number) => {
  const url = Deno.env.get("PR_URL") || "";

  return url
    .replace(/REPO_NAME/, repoName)
    .replace(/ID/, prId.toString());
};

const generateWidgets = (
  { topLabel, content, icon }: {
    topLabel: string;
    content: string;
    icon: string;
  },
) => ({
  keyValue: {
    topLabel,
    content,
    icon,
  },
});

const generateButton = (title: string, url: string) => ({
  textButton: {
    text: title,
    onClick: {
      openLink: { url },
    },
  },
});

export function GChatPROPened(receivedPayload: IBitbucketWebhook) {
  const { pullRequest } = receivedPayload;

  const sectionsWidgets = [
    {
      topLabel: "Criador",
      content: pullRequest.author.user.displayName,
      icon: "PERSON",
    },
    {
      topLabel: "Servico",
      content: pullRequest.fromRef.repository.name,
      icon: "STORE",
    },
    {
      topLabel: "Estado",
      content: pullRequest.state,
      icon: "EVENT_SEAT",
    },
    {
      topLabel: "Branch de origem",
      content: pullRequest.fromRef.displayId,
      icon: "FLIGHT_DEPARTURE",
    },
    {
      topLabel: "Branch de destingo",
      content: `<font color="#ff0000">${pullRequest.toRef.displayId}</font>`,
      icon: "FLIGHT_ARRIVAL",
    },
  ].map(generateWidgets);

  return {
    cards: [
      {
        header: { title: `Pull Request Criado: ${pullRequest.title}` },
        sections: [
          { widgets: sectionsWidgets },
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
                  generateButton(
                    "Abrir para revisao",
                    createPullRequestUri(
                      pullRequest.fromRef.repository.name,
                      pullRequest.id,
                    ),
                  ),
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

export function GChatCommented(receivedPayload: IBitbucketWebhook) {
  const { pullRequest, comment } = receivedPayload;

  const sectionsWidgets = [
    {
      topLabel: "Criador",
      content: comment.author.displayName,
      icon: "PERSON",
    },
    {
      topLabel: "Servico",
      content: pullRequest.fromRef.repository.name,
      icon: "STORE",
    },
  ].map(generateWidgets);

  return {
    cards: [
      {
        header: { title: `Pull Request Comentado: ${pullRequest.title}` },
        sections: [
          { widgets: sectionsWidgets },
          {
            header: "Comentario",
            widgets: [
              {
                textParagraph: { text: comment.text },
              },
            ],
          },
          {
            widgets: [
              {
                buttons: [
                  generateButton(
                    "Abrir para revisao",
                    createPullRequestUri(
                      pullRequest.fromRef.repository.name,
                      pullRequest.id,
                    ),
                  ),
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

const gChatFlags = (
  title: string,
  sectionsWidgets: {
    keyValue: {
      topLabel: string;
      content: string;
      icon: string;
    };
  }[],
  btn: {
    textButton: {
      text: string;
      onClick: {
        openLink: {
          url: string;
        };
      };
    };
  },
) => ({
  cards: [
    {
      header: { title },
      sections: [
        { widgets: sectionsWidgets },
        {
          widgets: [
            {
              buttons: [
                btn,
              ],
            },
          ],
        },
      ],
    },
  ],
});

export function GChatApproved(receivedPayload: IBitbucketWebhook) {
  const { pullRequest, actor } = receivedPayload;

  const sectionsWidgets = [
    {
      topLabel: "Aprovador",
      content: actor.displayName,
      icon: "PERSON",
    },
    {
      topLabel: "Servico",
      content: pullRequest.fromRef.repository.name,
      icon: "STORE",
    },
  ].map(generateWidgets);

  return gChatFlags(
    `Pull Request Aprovado: ${pullRequest.title}`,
    sectionsWidgets,
    generateButton(
      "Verificar pull request",
      createPullRequestUri(
        pullRequest.fromRef.repository.name,
        pullRequest.id,
      ),
    ),
  );
}

export function GChatNeedsWork(receivedPayload: IBitbucketWebhook) {
  const { pullRequest, actor } = receivedPayload;

  const sectionsWidgets = [
    {
      topLabel: "Usuario",
      content: actor.displayName,
      icon: "PERSON",
    },
    {
      topLabel: "Servico",
      content: pullRequest.fromRef.repository.name,
      icon: "STORE",
    },
  ].map(generateWidgets);

  return gChatFlags(
    `Pull Request Sinalizado: ${pullRequest.title}`,
    sectionsWidgets,
    generateButton(
      "Verificar pull request",
      createPullRequestUri(
        pullRequest.fromRef.repository.name,
        pullRequest.id,
      ),
    ),
  );
}
