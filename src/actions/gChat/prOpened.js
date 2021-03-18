module.exports = function (receivedPayload) {
  const { pullRequest  } = receivedPayload;
  return {
    cards: [
      {
        header: {
          title: `Pull Request Criado: ${pullRequest.title}`
        },
        sections: [
          {
            widgets: [
              {
                keyValue: {
                  topLabel: "Criador",
                  content: pullRequest.author.user.displayName,
                  icon: "PERSON"
                }
              },
              {
                keyValue: {
                  topLabel: "Servico",
                  content: pullRequest.fromRef.repository.name,
                  icon: "STORE"
                }
              },
              {
                keyValue: {
                  topLabel: "Estado",
                  content: pullRequest.state,
                  icon: "EVENT_SEAT"
                }
              },
              {
                keyValue: {
                  topLabel: "Branch de origem",
                  content: pullRequest.fromRef.displayId,
                  icon: "FLIGHT_DEPARTURE"
                }
              },
              {
                keyValue: {
                  topLabel: "Branch de destingo",
                  content: pullRequest.toRef.displayId,
                  icon: "FLIGHT_ARRIVAL"
                }
              },
            ]
          },
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
                      onClick: {
                        openLink: {
                          url: createPullRequestUri(pullRequest.fromRef.repository.name, pullRequest.id)
                        }
                      }
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
