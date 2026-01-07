---
title: Twitter historic data scrapping with tweepy.
date: "2022-11-03T15:00:00.169Z"
description: Getting tweets and tweets data (dates, like_count, retweets) etc from Twitter is easy as logging into the micro-blogging platform and taking any tweet you want from any publicly available account. This makes sense if one is only interested in a tweet or at most less than 10 tweets from a single account. it becomes a hassle when you need to fetch tweets from multiple users or a significant number of tweets.
featuredImage: ./img/history.webp
category: ["machine-Learning"]
---

## Twitter historic data scrapping with tweepy.

Getting tweets and tweets data (dates, like_count, retweets) etc from Twitter is easy as logging into the micro-blogging platform and taking any tweet you want from any publicly available account. This makes sense if one is only interested in a tweet or at most less than 10 tweets from a single account. it becomes a hassle when you need to fetch tweets from multiple users or a significant number of tweets.

Twitter provides a way to do this and more with their set of [APIs](https://developer.twitter.com/en/docs/twitter-api).

To get historic data dated way back, you would need an academic access to the twitter API with proof that you're actually an academician at the time and a brief overview of the work you're doing with the data gathered.

Getting access to the API service is the straightforward part. After the access has been granted, how to fetch and maybe store such data in a way that twitter doesn't see your requests as spam due to the limits they have on the number of results you get per requests can be quite challenging.

This article will focus on fetching large data continuously while avoiding API rate limit.

TLDR;
here's the code below.

https://github.com/waleCloud/me/blob/91baedc52e5f65002bba01cf2bc062e9e9f1ff88/content/blog/tweepy-fetch-historical-tweet-stream/fetch_tweets.ipynb

- Setup Twitter Developer Account
- Create an APP and choose Academic Research
  ![Twitter developer page](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/d0uuswesufogtx4sse3p.png)
  Continue to follow the twitter verification steps and approval.

Finally once approval has been granted, it times to begin fetching tweets as far back as you need and the volume, lets get started.

Before we begin, let setup [Python](https://www.python.org/downloads/) and [Tweepy](https://docs.tweepy.org/en/stable/install.html) installed with Pip.

- `pip install tweepy`

- Next is to get a bearer token from Twitter on the app you've been granted approval on.

![Twitter developer secrets page](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fl0m2b7umqhta0okb0sf.png)

- Let's connect to Twitter service with the token provided;

```python

import tweepy

def authenticate():
  BEARER_TOKEN = 'Put your bearer token here'
  # attempt authentication
  try:
    print("Authenticating...")
    # create Client object
    client = tweepy.Client(bearer_token=BEARER_TOKEN)
    print("API value:....   ", client)
    # return client object
    return client
  except Exception as e:
    print("Error: Authentication Failed", e)
```

The above function when called will return the API client if the token provided is correct or prints out an error message.

`API = authenticate()`

Assuming everything goes well, the `API` can now be used to access Twitter's data.
![Authentication successful](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7h8o7dn23dzlupdpx3ir.png)

- Lets create a function to search for tweets using the `search_all_tweets` method.

```python

def get_tweets(query, start_time, end_time, next_token):

  # empty list to store parsed tweets
  tweets = []

  expansions = ['author_id,in_reply_to_user_id,geo.place_id']
  tweet_fields = ['id,text,author_id,in_reply_to_user_id,geo,conversation_id,created_at,lang,public_metrics,referenced_tweets,reply_settings,source']
  user_fields =  ['id,name,username,created_at,description,public_metrics,verified']
  place_fields = ['full_name,id,country,country_code,geo,name,place_type']
  try:
    # call twitter api to fetch tweets
    fetched_tweets = API.search_all_tweets(query,
      end_time=end_time,
      start_time=start_time,
      expansions=expansions,
      tweet_fields=tweet_fields,
      place_fields=place_fields,
      user_fields=user_fields,
      next_token=next_token
    )

    return fetched_tweets

  except Exception as e:
    print("Error getting tweets", e)
```

The `get_tweets` function takes 4 parameters which includes the search `query`, `start_time` date to begin searching from, `end_time` end date of search, `next_token` a token that will be sent from twitter when the result is large and can only return a distinct number per request, we will be using this token to make subsequent call to this function. Imagine the next_token as some form of pagination to the next page, in this case the next set of results until it gets to the end of the list.

test out the search to confirm it works

```python

result = get_tweets('elon musk', '2022-10-01T00:00:01Z', '2022-11-01T00:00:01Z',next_token=None)

print(result)
```

Since we want to have records of the tweets stored for processing further down the line, let's create a method to store the tweets in a csv file.

For this, we will need the pandas library,csv and time, import them as required.

```python

import pandas as pd
import csv
import time

def append_to_csv(result_set, file_name):

    # A counter variable
    counter = 0
    # Open OR create the target CSV file
    csv_file = open(file_name, "a", newline="", encoding='utf-8')
    csv_writer = csv.writer(csv_file)

    # Loop through each tweet
    for tweet in result_set.data:
        # We will create a variable for each item since some of the keys might not exist for some tweets
        # So we will account for that

        author_id = tweet['author_id']
        created_at = tweet['created_at']
        if ('geo' in tweet):
            geo = tweet['geo']['place_id']
        else:
            geo = " "
        tweet_id = tweet['id']
        lang = tweet['lang']
        retweet_count = tweet['public_metrics']['retweet_count']
        reply_count = tweet['public_metrics']['reply_count']
        like_count = tweet['public_metrics']['like_count']
        quote_count = tweet['public_metrics']['quote_count']
        source = tweet['source']
        text = tweet['text']

        # Assemble all data in a list
        res = [author_id, created_at, geo, tweet_id, lang, like_count, quote_count, reply_count, retweet_count, source, text]

        # Append the result to the CSV file
        csv_writer.writerow(res)
        counter += 1

    # When done, close the CSV file
    csv_file.close()

    # Print the number of tweets for this iteration
    print("# of Tweets added from this response: ", counter)
```

Things are beginning to take shape, now the final piece to joining all these functions to create a stream of tweets.

```python

count = 0 # Counting tweets per time period
max_count = 100 # Max tweets per time period
flag = True
next_token = None
query = 'Parag Musk'
start_time = '2022-10-01T00:00:01Z'
end_time = '2022-11-01T00:00:01Z'
 # Total number of tweets we collected from the loop
# Check if flag is true
def run_fetch(flag=True, next_token=None, count=0, total_tweets=0 ):
  if (flag is not True):
    return
  while flag:
    print("-------------------")
    print("Token: ", next_token)
    result = get_tweets(query=query, start_time=start_time, end_time=end_time, next_token=next_token) # get_tweet function called
    result_count = result.meta['result_count']
    if result_count is not None and result_count > 0:
      # print("Start Date: ", start_list[i])
      append_to_csv(result, "data.csv")
      count += result_count
      total_tweets += result_count
      print("Total # of Tweets added: ", total_tweets)
      print("-------------------")
      if result.meta['next_token']:
        # Save the token to use for next call
        next_token = result.meta['next_token']
        print("Next Token: ", next_token)
        time.sleep(5)
        run_fetch(True, next_token=next_token, count=count, total_tweets=total_tweets)
      else:
        # Since this is the final request, turn flag to false to move to the next time period.
        flag = False
        next_token = None
    time.sleep(5)
  print("Total number of results: ", total_tweets)
```

The above code runs recursively until there's no Next_token which stops the search, a sleep for 5 milliseconds to allow guard against rate limit before the next `run_check`.

With that we can now begin the stream by running `run_fetch()`.

With this approach, you can get as many tweets as you want continuously, one caveat is your machine needs to be running and not go into hibernate/sleep mode else the process breaks.

One way I can quickly think of to mitigate this is to run this over the cloud on something like google colab, that way you don't have to worry about your machine sleeping as truly its google's machine that carry's all the burden 😅.

I hope this helps someone.
