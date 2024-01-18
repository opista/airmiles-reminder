import getRetailerList from './utils/retailers'
import { getDomain } from 'tldts'

const findAviosRetailer = async (url: string): Promise<Retailer | undefined> => {
  const pageDomain = getDomain(url)

  if (!pageDomain) return

  const retailers = await getRetailerList()

  return retailers.find(({ merchant_url }) => {
    const merchantDomain = getDomain(merchant_url)

    if (!merchantDomain) return

    return merchantDomain === pageDomain
  })
}

const getUser = async () => {
  let { user } = await chrome.storage.sync.get(['user'])

  if (user) {
    console.log('Found user in local storage', user)
    return user
  }

  const userId = await Promise.any([getUserId('www.shopping.ba.com'), getUserId('shopping.ba.com')])

  user = { id: userId }

  await chrome.storage.sync.set({ user })

  return user
}

const getUserId = async (domain: string) => {
  const url = `https://${domain}/retailers/bookingcom-uk`
  const html = await (await fetch(url)).text()
  const userId = html.match(/"collinsonId":"(\d+)"/)?.[1]

  if (!userId) {
    throw new Error('Failed to find the user ID')
  }

  return userId
}

const getTrackingUrl = async (userId: string, merchantId: string) => {
  const url = `https://shopping.ba.com/api/partner-click?membershipId=${userId}&merchantId=${merchantId}`

  let response = await fetch(url)

  if (response.status === 403) {
    response = await fetch(url)
  }

  const responseBody = await response.json()

  if (responseBody.hasError) {
    console.log(response)
    throw new Error(`Something went wrong: ${response.status}`)
  }

  const trackingUrl = responseBody?.data?.tracking_url
  if (!trackingUrl) {
    throw new Error(`Malformed response: ${JSON.stringify(response)}`)
  }

  return trackingUrl
}

const handleReadUrl = async (url: string, isAlreadyEarning: boolean) => {
  const retailer = await findAviosRetailer(url)

  console.log('Checking if URL is active Avios partner')

  if (!retailer) {
    console.log('Retailer not found', { retailer, url })
    return {
      isEarning: false,
      result: 'success',
      retailer: null,
    }
  }

  if (isAlreadyEarning) {
    console.log('Retailer found and already tracked visit', { retailer, url })
    return {
      isEarning: true,
      result: 'success',
      retailer,
    }
  }

  try {
    console.log('Not yet earning Avios for retailer, tracking visit...', {
      retailer,
      url,
    })
    const user = await getUser()
    const trackingUrl = await getTrackingUrl(user.id, retailer.external_id)
    const response = await fetch(trackingUrl)
    await response?.body?.cancel()

    console.log('Tracked visit successfully')

    return {
      isEarning: true,
      result: 'success',
      retailer,
    }
  } catch (err) {
    console.log('Failed to track visit', err)
    return {
      isEarning: false,
      result: 'error',
      retailer,
    }
  }
}

const handleMessage = async (message: { isAlreadyEarning: boolean; type: string; url: string }) => {
  console.log('Handling message', message)
  const { isAlreadyEarning, type, url } = message

  switch (type) {
    case 'read_url':
      return handleReadUrl(url, isAlreadyEarning)
    case 'visit_url':
      console.log('Visiting merchant for user', { url })
      await chrome.tabs.create({ url })
      return { result: 'success' }
    default:
      console.log('Unknown message type', { type })
      return { message: 'Unknown message type', result: 'error', type }
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  handleMessage(message).then((result) => sendResponse(result))
  return true
})

chrome.runtime.onInstalled.addListener(async (install) => {
  if (['install', 'update'].includes(install.reason)) {
    await getRetailerList()
  }
})
