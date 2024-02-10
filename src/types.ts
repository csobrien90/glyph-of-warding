export interface EventSummary {
	type: 'click' | 'scroll'
	time: number
}

export interface ClickEventSummary extends EventSummary {
	type: 'click'
	target: {
		tagName: string
		innerText: string
		id: string
		classList: string[]
	}
}

export interface ScrollEventSummary extends EventSummary {
	type: 'scroll'
	scrollX: number
	scrollY: number
}

export interface UserDataObject {
	userAgent: string
	timeOnPage: number
	ipData: IpData | null
	events: EventSummary[]
}

export interface IpData {
	ip: string
	is_eu: boolean
	city: string
	region: string
	region_code: string
	region_type: string
	country_name: string
	country_code: string
	continent_name: string
	continent_code: string
	latitude: number
	longitude: number
	postal: string
	calling_code: string
	flag: string
	emoji_flag: string
	emoji_unicode: string
	asn: {
		asn: string
		name: string
		domain: string | null
		route: string
		type: string
	}
	carrier: {
		name: string
		mcc: string
		mnc: string
	}
	languages: {
		name: string
		native: string
		code: string
	}[]
	currency: {
		name: string
		code: string
		symbol: string
		native: string
		plural: string
	}
	time_zone: {
		name: string
		abbr: string
		offset: string
		is_dst: boolean
		current_time: string
	}
	threat: {
		is_tor: boolean
		is_icloud_relay: boolean
		is_proxy: boolean
		is_datacenter: boolean
		is_anonymous: boolean
		is_known_attacker: boolean
		is_known_abuser: boolean
		is_threat: boolean
		is_bogon: boolean
		blocklists: string[]
	}
	count: string
}

export interface IpDataError {
	message: string
}