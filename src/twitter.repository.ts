import * as Twit from 'twit';
import * as dotenv from 'dotenv';

dotenv.config();

const twitter = new Twit({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET_KEY,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
  strictSSL: true,
});

export default class TwitterRepository {
  getStream(keyword: string): Twit.Stream {
    const params = {
      track: keyword,
    };
    return twitter.stream('statuses/filter', params);
  }
}
