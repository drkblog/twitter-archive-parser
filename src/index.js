const fs = require('fs');
const moment = require('moment');
const { exec } = require('child_process');

const commands = {
  'SHOW_ID': tweetShowId,
  'SHOW_FROM_ARCHIVE': tweetShowFromArchive,
  'REMOVE': tweetRemove
};

// Skipping node arguments
const args = process.argv.slice(2);

const archiveFile = args[0];
const minDate = new Date(args[1]);
const maxDate = new Date(args[2]);
const commandName = args[3];

if (!fs.existsSync(archiveFile)) {
  console.log(`ERROR: file not found: ${archiveFile}`);
  process.exit(1)
}

// Twitter archive is almost JSON except for this part
var originalFileContent = fs.readFileSync(archiveFile, 'utf8');
originalFileContent = originalFileContent.replace(
  'window.YTD.tweet.part0 = ',
  ''
);
const tweets = JSON.parse(originalFileContent);

const count = tweets.length;
console.log(`Parsed ${count} tweets.`);

const runCommand = commands[commandName];

for (let index = 0; index < tweets.length; index++) {
  const tweet = tweets[index];
  processTweet(tweet);
}
process.exit(0);

// =========

function processTweet(item) {
  const tweet = item.tweet;
  const tweetDate = new Date(tweet.created_at);

  if (moment(tweetDate).isAfter(moment(maxDate))) return;
  if (moment(tweetDate).isBefore(moment(minDate))) return;

  console.log(`Processing ${tweet.id} from ${tweetDate.toDateString()}`);

  runCommand(tweet);
}

function tweetShowId(tweet) {
  console.log(`Tweet ID ${tweet.id}`);
}

function tweetShowFromArchive(tweet) {
  console.log(tweet);
}

function tweetRemove(tweet) {
  if (isRetweet(tweet)) {
    console.log('Undoing retweet...');
    tweetUnretweet(tweet);
  } else {
    console.log('Deleting tweet...');
    tweetDelete(tweet);
  }
}

function tweetDelete(tweet) {
  exec(`twurl -X POST /1.1/statuses/destroy/${tweet.id}.json`, (err, stdout, stderr) => {
    if (err) {
      console.log(`ERROR: Executing twurl: ${err}`);
      return;
    }
  });
}
function tweetUnretweet(tweet) {
  exec(`twurl -X POST /1.1/statuses/unretweet/${tweet.id}.json`, (err, stdout, stderr) => {
    if (err) {
      console.log(`ERROR: Executing twurl: ${err}`);
      return;
    }
  });
}

function isRetweet(tweet) {
  return tweet.full_text.startsWith('RT');
}