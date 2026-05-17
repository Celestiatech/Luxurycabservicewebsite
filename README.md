
  # Affordable Cab Service Website

  This is a code bundle for Affordable Cab Service Website. The original project is available at https://www.figma.com/design/qcY2R5LsgpMd3DOYZ7Kfjk/Affordable-Cab-Service-Website.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Shopify checkout (car booking)

  This site can redirect a booking to a Shopify checkout page using the Shopify Storefront API (Cart). The Shopify token is kept server-side (safer).

  1. Copy `.env.example` to `.env`
  2. Fill in:
     - `SHOPIFY_STORE_DOMAIN`
     - `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
     - `SHOPIFY_DEFAULT_MERCHANDISE_ID` (a Shopify product variant `gid://shopify/ProductVariant/...`)
     - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (optional: enables Google suggestions + "pick from map")
  3. Start the site and click **BOOK NOW** → **CHECKOUT**

  Booking details (pickup, dropoff, date/time, etc.) are sent to Shopify as cart attributes and will show in the order details in Shopify admin.

  ### After payment (thank-you page)

  Shopify checkout already shows its own confirmation/thank-you page after successful payment.
  This site also includes a local page at `/thank-you` that can display the last booking details saved before redirecting to Shopify.

  ### Free location suggestions (no Google API key)

  If you don’t set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, the pickup/dropoff inputs use a free suggestion service via `/api/geocode` (Open-Meteo Geocoding).
  
