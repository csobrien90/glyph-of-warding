import { UserDataObject, EventSummary, IpData, ClickEventSummary, ScrollEventSummary } from '../types'

export default class GlyphOfWarding {
	// Properties
	pageLoadTime: number
	userAgent: string
	ipData: IpData | null = null
	events: EventSummary[] = []
	sendDataCallback: (userData: UserDataObject) => void = () => {}

	constructor(newIpData: any, sendDataCallback: (userData: UserDataObject) => void) {
		// If newIpData is provided, use it
		if (newIpData) this.ipData = newIpData

		// If sendDataCallback is provided, use it
		if (sendDataCallback) this.sendDataCallback = sendDataCallback
	}

	public init() {
		// Get the time of page load as a timestamp
		this.pageLoadTime = Date.now()

		// Get the user agent
		this.userAgent = navigator.userAgent || 'Unknown'

		// Add event listeners
		this.addEventListeners()
	}

	public teardown() {
		// Remove event listeners for click and scroll events
		['click', 'scroll'].forEach(eventType => {
			window.removeEventListener(eventType, this.recordEvent.bind(this))
		})

		// Remove event listener to send data when user leaves the page
		window.removeEventListener('beforeunload', () => {
			this.sendData()
		})
	}

	private addEventListeners() {
		// Add event listeners for click and scroll events
		['click', 'scroll'].forEach(eventType => {
			window.addEventListener(eventType, this.recordEvent.bind(this))
		})

		// Add event listener to send data when user leaves the page
		window.addEventListener('beforeunload', () => {
			this.sendData()
		})		
	}

	private sendData() {
		// Prepare the userData object with the most recent data
		const userData = this.prepareUserDataObject()

		// Call the sendDataCallback function with the userData object
		this.sendDataCallback(userData)
	}

	private recordEvent(e: Event) {
		// If the event is not a click or scroll, ignore it
		if (e.type !== 'click' && e.type !== 'scroll') return

		// Prepare the event object
		let event: EventSummary = {
			type: e.type,
			time: Date.now() - this.pageLoadTime,
		}

		if (e.type === 'click') {
			// Make event a ClickEventSummary and add the target data
			event = {
				...event,
				target: {
					tagName: (e.target as HTMLElement).tagName,
					innerText: (e.target as HTMLElement).innerText,
					id: (e.target as HTMLElement).id,
					classList: [...(e.target as HTMLElement).classList]
				}
			} as ClickEventSummary
		} else if (e.type === 'scroll') {
			// Make event a ScrollEventSummary and add the scroll data
			event = {
				...event,
				scrollX: window.scrollX,
				scrollY: window.scrollY
			} as ScrollEventSummary
		}

		this.events.push(event)
	}

	private prepareUserDataObject(): UserDataObject {
		const timeOnPage = Date.now() - this.pageLoadTime
		return {
			userAgent: this.userAgent,
			timeOnPage,
			ipData: this.ipData,
			events: this.events
		}
	}

}