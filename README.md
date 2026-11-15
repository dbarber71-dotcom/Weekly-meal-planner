# Family Tea Planner

An iPhone-friendly installable web app that uses the OpenAI API to generate a fresh 7-day family tea plan for four, a consolidated shopping list, recipe instructions, meal swaps and saved preferences.

## Important: AI key and costs

The app needs an OpenAI API key and a small server to keep that key private. **Do not put the key in `public/` or in browser JavaScript.** The server reads `OPENAI_API_KEY` from its environment. API usage is billed separately by OpenAI and is not included with a ChatGPT subscription.

## Run it locally

1. Install Node.js 20 or newer.
2. In this folder, run `npm install`.
3. Copy `.env.example` to `.env`.
4. Add your API key to `.env` as `OPENAI_API_KEY=...`.
5. Run `npm start`.
6. Open `http://localhost:3000`.

## Put it online for your iPhone

Deploy this folder to a Node.js host that supports environment variables (for example Render, Railway or another Node host). Set:
- `OPENAI_API_KEY` to your secret API key
- `OPENAI_MODEL` to a model available to your API project (default: `gpt-6-luna`)
- `NODE_VERSION` to `20` or newer if your host asks

The host must provide HTTPS for iPhone home-screen installation and service-worker support. Do not publish your `.env` file or commit it to source control.

## Install on iPhone

1. Open your deployed HTTPS app URL in Safari.
2. Tap Share.
3. Choose **Add to Home Screen**.
4. Tap Add.

The app stores the current plan, checked shopping items and preferences on that device using local storage. They are not synchronised between devices.

## Notes

- Prices are AI estimates, not live supermarket prices or guaranteed checkout totals.
- The £45–£55 target is a planning target; actual prices vary by shop, location, offers and cupboard staples.
- The app generates a complete replacement plan when swapping a meal so that the consolidated shopping list stays consistent.
