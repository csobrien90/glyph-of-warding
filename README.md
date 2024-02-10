# Glyph of Warding


## DevOps

### Build

This package uses `tsup` to compile for both Common JS and ESM. Run `npm run build` to build the package. It will generate a `dist` folder with the compiled code complete with type definitions.

### Test

This package uses jest and ts-jest for testing. Run `npm run test` to run the test suite or `npm run coverage` to run the test suite and generate a coverage report.

### Publish

Currently, the package is published manually. Run `npm publish` to publish the package to NPM.


## Implementation Examples

### Next.js

```typescript
// MyComponent.tsx
import { GlyphOfWarding } from './GlyphOfWarding'

export default function MyComponent() {
	return (
		<GlyphOfWarding />
	)
}

// GlyphOfWarding.tsx (server side)
import { getIpData, UserDataObject } from '@csobrien90/glyph-of-warding'
import GlyphClient from './GlyphClient'

export default async function GlyphOfWarding(): Promise<JSX.Element> {
	// Callback for "beforeunload" event
	const sendData = async (data: UserDataObject) => {
		"use server"
		// ...your code here - direct the data as appropriate
	}

	// Get IP data from the IPData API
	if (!process.env.IPDATA_API_KEY) {
		throw new Error('IPDATA_API_KEY is required')
	}

	const ipData = await getIpData(process.env.IPDATA_API_KEY)

	if (!ipData) {
		throw new Error('Failed to get IP data')
	}

	return <GlyphClient ipData={ipData} sendData={sendData} />
}


// GlyphClient.tsx (client side)
"use client"

import { useEffect } from "react"
import { GoW, IpData, IpDataError } from '@csobrien90/glyph-of-warding'

export default function GlyphClient({ ipData, sendData }: { ipData: IpData | IpDataError, sendData: any }) {

	useEffect(() => {
		const glyph = new GoW(ipData, sendData)
		glyph.init()

		return () => {
			glyph.teardown()
		}
	}, [])

	return null
}
```