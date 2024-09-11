import Script from "next/script";

export default function LumaCheckoutScript() {
  return (
    <Script
      id="luma-checkout"
      src="https://embed.lu.ma/checkout-button.js"
      strategy="afterInteractive"
    />
  );
}
