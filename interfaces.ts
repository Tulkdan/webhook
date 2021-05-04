export enum BitbucketEventKeys {
  OPENED = "pr:opened",
  APPROVED = "pr:reviewer:approved",
  NEEDS_WORK = "pr:reviewer:needs_work",
  COMMENT_ADDED = "pr:comment:added",
}

export interface IBitbucketRef {
  displayId: string;
  repository: {
    name: string;
  };
}

interface IBitbucketUser {
  displayName: string;
}

export interface IBitbucketWebhook {
  eventKey: BitbucketEventKeys;
  pullRequest: {
    id: number;
    title: string;
    description: string;
    state: string;
    fromRef: IBitbucketRef;
    toRef: IBitbucketRef;
    author: {
      user: IBitbucketUser;
    }
  };
  comment: {
    text: string;
    author: IBitbucketUser;
  };
  actor: {
    name: string;
    emailAddress: string;
    displayName: string;
  };
}
