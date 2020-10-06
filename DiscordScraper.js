const slackURL = '' // Add Slack webhook

const discordBaseURL = 'https://discordapp.com/api'
const apiVersion = 'v6';
  
const personalToken = '' // Add Discord access token
const authorization = { 'authorization' : personalToken }
  
const ftcServerID       = '225450307654647808'
const designCadID       = '225451665602510850'
const generalRoboticsID = '225450307654647808'
  
const filters = 'has=image'
  
const discordURL = `${discordBaseURL}/${apiVersion}/guilds/${ftcServerID}/messages/search?channel_id=${designCadID}&${filters}`
const discordOptions = {
  'method' : 'get',
  'headers' : authorization
}

const scriptProperties = PropertiesService.getScriptProperties()
const history = JSON.parse(scriptProperties.getProperty("history"))

function requestMessages() {
  
  const response = UrlFetchApp.fetch(discordURL, discordOptions).getContentText()
  const json = JSON.parse(response)
  
  for (let sequenceIndex = 0; sequenceIndex < json.messages.length; sequenceIndex += 1) {
    for (let messageIndex = 0; messageIndex < json.messages[sequenceIndex].length; messageIndex += 1) {
      for (let attachmentIndex = 0; attachmentIndex < json.messages[sequenceIndex][messageIndex].attachments.length; attachmentIndex += 1) {
        const message = json.messages[sequenceIndex][messageIndex]
        const attachment = message.attachments[attachmentIndex]
        
        if (!history.includes(message.id)) {
          sendSlackMessage(message, attachment)
          history.push(message.id)
        }
      }
    }
  }
  
  scriptProperties.setProperty("history", JSON.stringify(history))
}

function sendSlackMessage(message, attachment) {

  const authorID = message.author.id
  const avatar = message.author.avatar
  const profilePictureURL = `https://cdn.discordapp.com/avatars/${authorID}/${avatar}.png`
  const username = message.author.username
  
  const messageID = message.id
  const messageURL = `discord://discordapp.com/channels/${ftcServerID}/${designCadID}/${messageID}` // https <--> discord
  const content = (message.content == "" ? " " : `>${message.content}`)
  const imageURL = attachment.proxy_url
  const imageName = attachment.filename
  
  const payload = `{
    "blocks": [{
      "type": "divider"
    }, {
      "type": "context",
      "elements": [
        {
          "type": "image",
          "image_url": "${profilePictureURL}",
          "alt_text": "cute cat"
        },
        {
          "type": "mrkdwn",
          "text": "*${username}*"
        }
      ]
    }, {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "${content}"
      }
    }, {
      "type": "image",
      "title": {
        "type": "plain_text",
        "text": "${imageName}"
      },
      "image_url": "${imageURL}",
      "alt_text": "test"
    }, {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "<${messageURL}|Jump to thread>"
      }
    }]
  }`
        
  const options = {
    'method' : 'post',
    'contentType' : 'application/json',
    'payload' :  payload
  }
        
  UrlFetchApp.fetch(slackURL, options)
}