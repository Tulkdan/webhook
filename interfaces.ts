export enum BitbucketEventKeys {
  OPENED = "pr:opened",
  APPROVED = "pr:reviewer:approved",
  NEEDS_WORK = "pr:reviewer:needs_work",
  DECLINED = "pr:declined",
  COMMENT_ADDED = "pr:comment:added",
}

export interface IBitbucketRef {
  displayId: string;
  repository: {
    name: string;
  };
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
      user: {
        displayName: string;
      };
    };
  };
}
