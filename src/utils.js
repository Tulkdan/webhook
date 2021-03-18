exports.createPullRequestUri = (repoName, prId) => {
  const url = process.env.PR_URL;

  return url
    .replace(/REPO_NAME/, repoName)
    .replace(/ID/, prId.toString());
};

exports.createDetailsWidget = ({ label, content, icon }) => ({
  keyValue: {
    topLabel: label,
    content,
    icon,
  }
})

