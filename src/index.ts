import * as express from 'express';
import * as exporessWS from 'express-ws';

import { Tweets } from './tweets';
import TwitterRepository from './twitter.repository';

const app = express();
exporessWS(app);

const twitterRepository = new TwitterRepository();
const port = process.env.PORT || 3000;

// @ts-ignore: ws injected via express-ws
(app as exporessWS.Application).ws('/stream/:keyword', (client, req) => {
  console.log('Stream started.');

  const tweets = new Tweets();
  const keyword = decodeURI(req.params.keyword) || 'twitter';
  const stream = twitterRepository.getStream(keyword);
  let timer: NodeJS.Timeout;

  stream.on('tweet', tweet => {
    tweets.add(tweet);

    if (!timer) {
      timer = setInterval(() => {
        client.send(tweets.convertToString());
        tweets.reset();
      }, 5000);
    }
  });

  stream.on('error', (error: Error) => {
    throw error;
  });

  client.on('close', () => {
    stream.stop();
    clearInterval(timer);
    tweets.reset();

    console.log('Stream stopped.');
  });
});

app.listen(port, () => console.log(`Hello app listening on port ${port}!`));
