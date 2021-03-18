const { createPullRequestUri, createDetailsWidget } = require('../../utils');

const btnWidget = (url, commentId) => ({
  buttons: [
    {
      textButton: {
        text: "Abrir para revisao",
        onClick: {
          openLink: {
            url: `${url}?commentId=${commentId}`
          }
        }
      }
    }
  ]
})

module.exports = function (receivedPayload) {
  const { actor, pullRequest, comment } = receivedPayload;

  const url = createPullRequestUri(pullRequest.fromRef.repository.name, pullRequest.id);

  const detailsWidget = [
    { label: "Criador", content: actor.displayName, icon: "PERSON" },
    { label: "Servico", content: pullRequest.fromRef.repository.name, icon: "STORE" }
  ]

  return {
    cards: [
      {
        header: {
          title: `Comentario adicionado: ${pullRequest.title}`
        },
        sections: [
          { widgets: detailsWidget.map(createDetailsWidget) },
          {
            header: "Comentario",
            widgets: [
              { textParagraph: { text: comment.text } }
            ]
          },
          { widgets: [btnWidget(url, comment.id)] }
        ]
      }
    ]
  };
}
