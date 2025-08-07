import { XMLParser } from "fast-xml-parser"
import { Feed, User } from "./lib/db/schema";


export async function fetchFeed(feedURL:string) {
  const response = await fetch(feedURL, {headers: {'User-agent':'Gator'}})

  const data = await response.text()

  const parser = new XMLParser()

  const parsedData = parser.parse(data).rss

  if (!parsedData.channel) {
    throw new Error(`function fetchFeed() - parsedData does not have required "channel" field`)
  }
  
  const channel = parsedData.channel


  const metaDataFields = ['title', 'link','description']
  for (const field of metaDataFields) {
    if (!channel[field]) {
      throw new Error(`function fetchFeed() - channel is missing required "${field}" Meta data field`)
    }
  }

  const channelTitle = channel.title
  const channelLink = channel.link
  const channelDescription = channel.description

  let items = []
  if (channel.item) {
    // Make sure items is *always* an array
    items = Array.isArray(channel.item) ? channel.item : [channel.item]
  }

  const channelItems = []

  for (const i of items) {
    const itemFieldValues = [i?.title, i?.link, i?.description, i?.pubDate]
    if (!itemFieldValues.includes(undefined)) {
      channelItems.push({
        title: i.title,
        link: i.link,
        description: i.description,
        pubDate: i.pubDate
      })
    }
  }

  const rssFeed = {
    channel: {
    title: channelTitle,
    link: channelLink,
    description: channelDescription,
    item: channelItems
    }
  }

  return rssFeed
}

export function printFeed(feed: Feed, user: User) {
  console.log(`${JSON.stringify(feed)}\n`)
  console.log(`${JSON.stringify(user)}\n`)
}

