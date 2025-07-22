import { XMLParser } from "fast-xml-parser"

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

  let channelItems;

  if (channel.item && !Array.isArray(channel.item)) {
     channelItems = []
  }

  if (channel.item && Array.isArray(channel.item)) {
  channelItems = []  // Start with an empty array
  for (const i of channel.item) {
    const itemFieldValues = [i?.title, i?.link, i?.description, i?.pubDate]
    if (!itemFieldValues.includes(undefined)) {  // Only add if all fields are present
      channelItems.push({
        title: i.title,
        link: i.link,
        description: i.description,
        pubDate: i.pubDate
      })
    }
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
