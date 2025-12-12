# RYDIO – Ride Aggregator Prototype (Hi-fi + Wireframe)

Static multi-section prototype for USER and CAPTAIN roles across 13 required screens, with wireframe toggle and responsive layout.

## How to View

1. Open `index.html` in your browser.
2. Use the **Wireframe** toggle in the header for low-fi vs hi-fi.
3. Resize the window to validate responsive stacking (nav hides <820px).

## Screens Included

1. Landing page (hero CTA, three-network pitch)
2. User login / register
3. Captain login / register
4. User ride booking (map + 3-colored routes, tappable segments, bottom sheet)
5. Price comparison (Uber | Ola | Rapido sortable chips)
6. Ride confirmation
7. Live ride tracking
8. Captain ride request dashboard
9. Captain ride acceptance (route to user + OTP)
10. Captain live navigation
11. Ride end summary
12. User profile + settings
13. Captain profile + settings

## Design Tokens

- Electric Blue: `#217CFF`
- Black: `#0F0F0F`
- Green: `#38A169`
- Yellow: `#F4B400`
- Grey: `#E8E8E8`
- White: `#FFFFFF`

## Export Notes

- Use browser full-page screenshot or Print to PDF; toggle wireframe for low-fi exports.
- Map lines are synthetic; in production connect to real map SDK and polyline data.

## Next Ideas

- Hook to Map SDK (Google/Mapbox) and real ETAs.
- Persist state (chosen provider, auth) to local storage.
- Animate driver pin and ETA countdown; add dark theme tokens.

