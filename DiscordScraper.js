// Google Script
// A bot to scrape images from a discord channel and repost them on Slack using Slack Bots and webhooks 

const slackURL = '' // Add Slack webhook

const discordBaseURL = 'https://discordapp.com/api'
const apiVersion = 'v6';
  
const personalToken = '' // Add Discord access token
const authorization = { 'authorization' : personalToken }
  
const ftcServerID       = '' // Add server id
const designCadID       = '' // Add channel id
  
// Slack Bot Webhook
const discordBaseURL = 'https://discordapp.com/api'

// Discord API
const discordBaseURL = 'https://discordapp.com/api'
const apiVersion = 'v6';
  
// Personal Access Token
const personalToken = '' // Add Discord access token
const authorization = { 'authorization' : personalToken }
 
// Discord Server Credentials 
const ftcServerID       = '' // Add server id
const designCadID       = '' // Add channel id

const filters = 'has=image&has=embed'
  
const discordURL = `${discordBaseURL}/${apiVersion}/guilds/${ftcServerID}/messages/search?channel_id=${designCadID}&${filters}`
const discordOptions = { 'method' : 'get', 'headers' : authorization }

const scriptProperties = PropertiesService.getScriptProperties()
const history = JSON.parse(scriptProperties.getProperty("history"))

//history.splice(history.length - 10)
//const index = history.indexOf("763197412738859069");
//history.splice(index, 1);

//mov, mpg, mp4
const video = UrlFetchApp.fetch("https://www.youtube.com/watch?v=Cyeqd0A3U0U")
var fileBlob = video.getBlob()
var folder = DriveApp.getFoldersByName('Robotics').next();
Logger.log(folder)
//DriveApp.getRootFolder().createFile(fileBlob);
//var result = folder.createFile(fileBlob);

uploadFileToSlack()

function requestMessages() {
  
  const response = UrlFetchApp.fetch(discordURL, discordOptions).getContentText()
  const json = JSON.parse(response)
  
  for (let sequenceIndex = json.messages.length - 1; sequenceIndex >= 0; sequenceIndex -= 1) {
    for (let messageIndex = 0; messageIndex < json.messages[sequenceIndex].length; messageIndex += 1) {

        const message = json.messages[sequenceIndex][messageIndex]
        
        // Ignore normal messages
        if (message.attachments.length == 0 && message.embeds.length == 0) { continue }
        
        if (!history.includes(message.id)) {
          sendSlackMessage(message)
          history.push(message.id)
          scriptProperties.setProperty("history", JSON.stringify(history))
        }
    }
  }
}

function sendSlackMessage(message, attachment) {

  const authorID = message.author.id
  const avatar = message.author.avatar
  const profilePictureURL = `https://cdn.discordapp.com/avatars/${authorID}/${avatar}.png`
  const username = message.author.username
  
  const messageID = message.id
  const messageDiscordURL = `discord://discordapp.com/channels/${ftcServerID}/${designCadID}/${messageID}`
  const messageWebURL = `https://discordapp.com/channels/${ftcServerID}/${designCadID}/${messageID}`
  
  // Content Block
  const rawContent = message.content
  const content = rawContent
  .replace(/[\\]/g, '\\\\\\') // Escape backslash characters
  .replace(/"/g, '\\"') // Escape quote characters
  .replace(/~~/g, '~') // Add strikethrough style
  .replace(/\*\*/g, '_') // Convert bold to underline
  .replace(/\*/g, '_') // Add Italic style
  .replace(/_/g, '*') // Add bold style
  .replace(/>/g, '') // Remove quote style
  .replace(/\n/g, '>') // Add block quote for each line
  
  const contentBlock = `{"type": "section",
    "text": {
      "type": "mrkdwn",
      "text": ">${content}"
    }
  }`
  Logger.log(content)
  
  // Basic Blocks: Divider, Author, Source
  const dividerBlock = `{"type": "divider"}`
  const authorBlock = `{"type": "context",
    "elements": [{
        "type": "image",
        "image_url": "${profilePictureURL}",
        "alt_text": "cute cat"
      }, {
        "type": "mrkdwn",
        "text": "*${username}*"
      }]}`
  const sourceBlock = `{
    "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Open Desktop App",
            "emoji": true
          },
          "value": "desktop",
          "url": "${messageDiscordURL}",
          "action_id": "desktop"
        },
        {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Open Web App",
            "emoji": true
          },
          "value": "web",
          "url": "${messageWebURL}",
          "action_id": "web"
        }
      ]
  }`
  
  // Create image blocks
  let imageBlocks = ""
  for (let attachmentIndex = 0; attachmentIndex < message.attachments.length; attachmentIndex += 1) {
    const attachment = message.attachments[attachmentIndex]
    const imageURL = attachment.proxy_url
    const imageName = attachment.filename
    
    if (attachmentIndex != 0) { imageBlocks += "," }
    imageBlocks += `{"type": "image",
      "title": {
        "type": "plain_text",
        "text": "${imageName}"
      },
      "image_url": "${imageURL}",
      "alt_text": "no alt for you"
   }`
  }
  
  // Create embed blocks
  for (let embedIndex = 0; embedIndex < message.embeds.length; embedIndex += 1) {
    const embed = message.embeds[embedIndex]
    const embedURL = embed.url
    
    if (!embedURL.includes("media.discordapp.net")) { continue }
    
    if (imageBlocks != "") { imageBlocks += "," }
    imageBlocks += `{"type": "image",
      "title": {
        "type": "plain_text",
        "text": "embed"
      },
      "image_url": "${embedURL}",
      "alt_text": "no alt for you"
   }`
  }
  
  let payload = `{ "blocks": [${dividerBlock}, ${authorBlock}`
  if (content != "") { payload += "," + contentBlock }
  if (imageBlocks != "") { payload += "," + imageBlocks }                            
  payload += "," + sourceBlock + "]}"                          
        
  const options = {
    'method' : 'post',
    'contentType' : 'application/json',
    'payload' :  payload
  }
  
  UrlFetchApp.fetch(slackURL, options)
}
                              
function uploadFileToSlack() {
  //curl -F file=@video0.mov -F "initial_comment=Hello" -F channels=G01CEU931R7 -H "Authorization: Bearer " https://slack.com/api/files.upload
  
  const slackUploadURL = "https://slack.com/api/files.upload"
  const header = `'headers' : {
    "authorization" : " ",
    "channels" : "G01CEU931R7"
  }`
  
  const video = UrlFetchApp.fetch("https://cdn.discordapp.com/attachments/225451665602510850/763611054113816616/woooo_pog.png")
  var fileBlob = video.getBlob()
    
  UrlFetchApp.fetch(slackUploadURL, {
    method: "post",
    payload: video
  });
}