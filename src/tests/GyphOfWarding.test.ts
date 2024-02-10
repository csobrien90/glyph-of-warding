/**
 * @jest-environment jsdom
 */

import GlyphOfWarding from '../classes/GlyphOfWarding';

describe('GlyphOfWarding', () => {
	const clickEvent = {
		type: 'click',
		timeStamp: 1000,
		target: {
			tagName: 'DIV',
			innerText: 'Test',
			id: 'test',
			classList: ['test']
		}
	}

	const scrollEvent = {
		type: 'scroll',
		timeStamp: 1000,
		scrollX: 10,
		scrollY: 20
	}

	let mockSendDataCallback: jest.Mock = jest.fn(() => {})
	let mockAddEventListener: jest.Mock = jest.fn((event, callback) => {
		switch (event) {
			case 'click':
				callback(clickEvent);
				break;
			case 'scroll':
				callback(scrollEvent);
				break;
			case 'beforeunload':
				callback();
				break;
			default:
				break;
		}
	});
	let windowAddSpy: jest.SpyInstance;
	let windowRemoveSpy: jest.SpyInstance;
	let glyph: GlyphOfWarding;

	beforeEach(() => {
		// Spy on window.addEventListener and window.removeEventListener
		windowAddSpy = jest.spyOn(window, 'addEventListener').mockImplementation(mockAddEventListener);
		windowRemoveSpy = jest.spyOn(window, 'removeEventListener').mockImplementation(() => {});

		// Mock the sendDataCallback function
		mockSendDataCallback = jest.fn(() => {});

		// Initialize GlyphOfWarding instance
		glyph = new GlyphOfWarding(null, mockSendDataCallback);
	});

	afterEach(() => {
		// Reset mock functions
		mockSendDataCallback.mockClear();
		mockAddEventListener.mockClear();
		windowAddSpy.mockRestore();
		windowRemoveSpy.mockRestore();

		// Reset window.addEventListener and window.removeEventListener
		jest.restoreAllMocks();
	});

	test('init() initializes properties and adds event listeners', () => {
		glyph.init();

		// Check if pageLoadTime is initialized
		expect(glyph.pageLoadTime).toBeDefined();

		// Check if userAgent is initialized
		expect(glyph.userAgent).toBeDefined();

		// Check if event listeners are added
		expect(windowAddSpy).toHaveBeenCalledTimes(3);
	});

	test('teardown() removes event listeners', () => {
		glyph.teardown();
		
		// Check if event listeners are removed
		expect(windowRemoveSpy).toHaveBeenCalledTimes(3);
	});

	test('recordEvent() records click and scroll events correctly', () => {
		glyph.init();

		// Simulate click event
		const click = new Event('click');
		setTimeout(() => window.dispatchEvent(click), 500);

		// Simulate scroll event
		const scroll = new Event('scroll');
		setTimeout(() => window.dispatchEvent(scroll), 1000);

		// Check if recordEvent has been called for both the events
		expect(glyph.events.length).toBe(2);
	});

	test('sendData() fires on page unload', () => {
		glyph.init();

		// Simulate page unload
		window.dispatchEvent(new Event('beforeunload'));

		// Check if sendDataCallback is called
		expect(mockSendDataCallback).toHaveBeenCalledTimes(1);
	});

});
