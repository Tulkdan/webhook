const { createPullRequestUri, createDetailsWidget } = require('../../utils');

module.exports = function (receivedPayload) {
  const { pullRequest  } = receivedPayload;

  const url = createPullRequestUri(pullRequest.fromRef.repository.name, pullRequest.id)

  const detailsWidget = [
    { label: "Criador", content: pullRequest.author.user.displayName, icon: "PERSON" },
    { label: "Servico", content: pullRequest.fromRef.repository.name, icon: "STORE" },
    { label: "Estado", content: pullRequest.state, icon: "EVENT_SEAT" },
    { label: "Branch de origem", content: pullRequest.fromRef.displayId, icon: "FLIGHT_DEPARTURE" },
    { label: "Branch de destingo", content: pullRequest.toRef.displayId, icon: "FLIGHT_ARRIVAL" }
  ];

  return {
    cards: [
      {
        header: {
          title: `Pull Request Criado: ${pullRequest.title}`
        },
        sections: [
          { widgets: detailsWidget.map(createDetailsWidget) },
          {
            header: "Descricao",
            widgets: [
              {
                textParagraph: {
                  text: pullRequest.description
                }
              }
            ]
          },
          {
            widgets: [
              {
                buttons: [
                  {
                    textButton: {
                      text: "Abrir para revisao",
                      onClick: { openLink: { url } }
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}
