import { IpData, IpDataError } from "../types"

export const getIpData = async (apiKey: string): Promise<IpData | IpDataError> => {
	try {
		const response = await fetch(`https://api.ipdata.co?api-key=${apiKey}`, {
			cache: 'no-store'
		})
		const json = await response.json() as IpData | IpDataError
		return json
	} catch (e) {
		return {message: e.message}
	}
}