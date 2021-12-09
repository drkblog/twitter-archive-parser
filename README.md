# twitter-archive-parser

A simple Twitter Archive parser you can extend to process your archive in batch.
Currently supports showing or deleting tweets within certain dates.

# Requirements

You have to install [github.com/twitter/twurl](https://github.com/twitter/twurl)

# Usage

1. Clone this repository
2. Run the script from the root

```
$ node src/index.js /home/user/archive/data/tweet.js 4/1/2020 12/1/2020 SHOW_ID
```

## Show tweets IDs

```
$ node src/index.js /home/user/archive/data/tweet.js 4/1/2020 12/1/2020 SHOW_ID
```
## Show tweets content from the Archive

```
$ node src/index.js /home/user/archive/data/tweet.js 4/1/2020 12/1/2020 SHOW_FROM_ARCHIVE
```

## Delete or unretweet tweets

> Warning: this action cannot be undone. Use at your own risk.

```
$ node src/index.js /home/user/archive/data/tweet.js 4/1/2020 12/1/2020 REMOVE
```