import * as Twit from 'twit';

export class Tweets {
  private tweets: Twit.Twitter.Status[];

  constructor() {
    this.tweets = [];
  }

  convertToString(): string {
    return JSON.stringify(this.tweets);
  }

  add(tweet: Twit.Twitter.Status): void {
    this.tweets = [...this.tweets, tweet];
  }

  reset(): void {
    this.tweets = [];
  }
}
