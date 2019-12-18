import TwitterRepository from './twitter.repository';
import * as express from 'express';
import * as exporessWS from 'express-ws';

const app = express();
exporessWS(app);

const twitterRepository = new TwitterRepository();
const port = process.env.PORT || 3030;

// @ts-ignore: ws injected via express-ws
(app as exporessWS.Application).ws('/stream/:keyword', (client, req) => {
  let tweets: any[] = [];
  let timer: any;

  const keyword = decodeURI(req.params.keyword) || 'twitter';
  const stream = twitterRepository.getStream(keyword);

  stream.on('tweet', (tweet: any) => {
    console.log('Stream started.');
    tweets = [...tweets, tweet];

    if (!timer) {
      timer = setInterval(() => {
        client.send(JSON.stringify(tweets));
        tweets = [];
      }, 5000);
    }
  });

  stream.on('error', (error: any) => {
    throw error;
  });

  client.on('close', () => {
    stream.stop();
    clearInterval(timer);
    tweets = [];
    console.log('Stream stopped.');
  });
});

app.listen(port, () => console.log(`Hello app listening on port ${port}!`));
