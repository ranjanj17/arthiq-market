# Arthiq - Real-time markets, intelligently simple.

Arthiq is a high-performance React Native (Expo) stock-market watchlist application. It is designed around the principles of scalable and performant UI handling, ensuring smooth 60fps scrolling even with hundreds of active instruments and rapid real-time data updates.

## Features
- **Virtualized Market List:** Implemented via `@shopify/flash-list`.
- **Active Page Window:** Tracking approximately 3 pages around the viewport.
- **Real-time Market-Data Architecture:** Separating UI from data transport.
- **Granular Price Rendering:** Zustand-based symbol-level selectors to prevent full-list re-renders.
- **Subscription Management:** Coalesced visible range tracking with buffering.
- **Expo Development:** Pure Expo-first workflow, no Android Studio required.
- **New Architecture Ready:** Configured for React Native's New Architecture.

## Architecture

The system is decoupled into the following layers:

```text
scrips.json
    ↓
Stock Repository (App level)
    ↓
Page Cache (FlashList internal / Viewable range)
    ↓
FlashList (Virtualized views)
    ↓
Visible Range
    ↓
Subscription Manager (Debounces scroll, diffs visible + buffer)
    ↓
Market Data Provider (Polling / API layer)
    ↓
Tick Processor (Batches ticks)
    ↓
Zustand Market Store (Normalizes prices by symbol)
    ↓
Symbol Selector
    ↓
StockRow (React.memo + specific symbol lookup)
```

## Why Prices Do Not Re-render The Entire List
Instead of keeping a giant array of `{ symbol, ltp }` objects in standard React state, Arthiq stores the stock list (structural metadata) as static data for `FlashList`. 
Market ticks flow into a normalized dictionary in a **Zustand store**. Each `StockRow` then binds itself specifically to its own symbol using a selector `useMarketStore(state => state.prices[symbol])`. This ensures that when Reliance's price updates, only the Reliance row component re-renders.

## Why Visible + Buffer is Used
If we strictly subscribed to only the 6–7 visible rows, any fast scroll event would trigger a massive storm of subscribe/unsubscribe requests, and users would stare at empty prices while waiting for data. By using a buffer (e.g., +20 items above and below the viewport), we eliminate subscription churn and provide instant data availability when the user scrolls slightly up or down.

## Why Subscriptions Are Not Controlled by StockRow
`FlashList` recycles row views to save memory. This means the React lifecycle (`useEffect` mount/unmount) of a row component is disconnected from the logical identity of the stock it represents. Subscribing on mount would lead to memory leaks and incorrect subscriptions. Instead, `SubscriptionManager` tracks the visible range globally based on list scroll events.

## Pagination vs Virtualization
Virtualization (`FlashList`) ensures we only render 10–15 physical views into the DOM/Native Hierarchy, recycling them as the user scrolls. Pagination (Active Window) manages our logical bounds—deciding which slice of the 800 items we should care to keep updated in our active state, mitigating network and memory pressure.

## Assignment API
The application uses the `POST https://api.v2.liquide.life/api/markets/ohlc` endpoint, fetching bulk market quotes based on the computed visible subscription window. Data is polled dynamically.

## Expo Go Setup

To run this project on a physical device:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npx expo start
   ```
3. Scan the QR code using the **Expo Go** app on your Android or iOS device.

## Performance Testing
1. **Normal scrolling:** Smooth scrolling across the full 800 list.
2. **Fast scrolling:** No crashes, no uncontrolled memory growth, thanks to view recycling.
3. **High-frequency updates:** Ticks are batched (100ms) and mapped cleanly via Zustand selectors. FlashList does not lock up.
4. **Subscription churn:** Fast scrolling coalesces subscription events using a 100ms debounce, ensuring we don't bombard the server.
5. **Background/Foreground:** `useAppLifecycle` ensures we pause polling when the app goes to the background and resumes correctly when active.

## Known Limitations
- The current backend API polling speed is governed by a standard interval (e.g., 2000ms).
- Due to the nature of HTTP polling, real-time "flashes" are pseudo-realtime.
- For a true production application, replacing the `PollingMarketDataProvider` with a `WebSocketMarketDataProvider` would lower latency (the architecture already supports this swap).
