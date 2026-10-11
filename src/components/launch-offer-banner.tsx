import {getLaunchOfferConfig} from "../lib/launch-offer";

export function LaunchOfferBanner() {
  const offer = getLaunchOfferConfig();
  if (!offer) return null;

  return <aside className="ed-offer-banner" aria-label="Launch offer">
    <div className="ed-offer-viewport">
      <div className="ed-offer-track">
        <p className="ed-offer-item">
          <span>Launch offer: 50% off for the first 50 customers</span>
          <span className="ed-offer-code">Use code <code>{offer.code}</code></span>
        </p>
        <p className="ed-offer-item" aria-hidden="true">
          <span>Launch offer: 50% off for the first 50 customers</span>
          <span className="ed-offer-code">Use code <code>{offer.code}</code></span>
        </p>
      </div>
    </div>
  </aside>;
}
