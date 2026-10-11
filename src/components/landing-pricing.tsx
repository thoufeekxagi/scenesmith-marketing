"use client";

import Link from "next/link";
import {useState} from "react";

const APP_ORIGIN = "https://app.scenesmith.design";

type BillingPeriod = "monthly" | "quarterly" | "yearly";

const periods: Array<{key: BillingPeriod; label: string; detail: string}> = [
  {key: "monthly", label: "Monthly", detail: "Billed monthly"},
  {key: "quarterly", label: "3 months", detail: "Save CAD $4.98–$9.98"},
  {key: "yearly", label: "Yearly", detail: "Save CAD $34.89–$54.89"},
];

const features = ["Publish from ChatGPT", "X, Instagram, and LinkedIn", "Calendar and scheduling", "Preview before publishing", "Drafts, approvals, and history"];

const plans = [
  {
    key: "starter",
    eyebrow: "STARTER",
    name: "A clear place to begin.",
    description: "For one brand, or a small collection of ideas.",
    monthly: "9.99",
    quarterly: "24.99",
    yearly: "84.99",
    monthlyEquivalent: {monthly: "9.99", quarterly: "8.33", yearly: "7.08"},
    savings: {quarterly: {amount: "4.98", percent: "17%"}, yearly: {amount: "34.89", percent: "29%"}},
    featured: false,
    capacity: {workspaces: "3", slots: "5", accounts: "10", deliveries: "150"},
  },
  {
    key: "pro",
    eyebrow: "PRO",
    name: "Room for the whole story.",
    description: "For several brands, channels, and a fuller publishing rhythm.",
    monthly: "14.99",
    quarterly: "34.99",
    yearly: "124.99",
    monthlyEquivalent: {monthly: "14.99", quarterly: "11.66", yearly: "10.42"},
    savings: {quarterly: {amount: "9.98", percent: "22%"}, yearly: {amount: "54.89", percent: "31%"}},
    featured: true,
    capacity: {workspaces: "10", slots: "10", accounts: "30", deliveries: "500"},
  },
] as const;

const comparisonRows = [
  ["Active workspaces", "3", "10"],
  ["Account slots per workspace", "5", "10"],
  ["Connected accounts", "10", "30"],
  ["Publishing volume", "Unlimited", "Unlimited"],
  ["Instagram publishing", "Included", "Included"],
  ["X publishing", "Included", "Included"],
  ["LinkedIn publishing", "Included", "Included"],
  ["ChatGPT publishing workflow", "Included", "Included"],
  ["Calendar and scheduling", "Included", "Included"],
  ["Pre-publish previews", "Included", "Included"],
  ["Drafts, approvals, history", "Included", "Included"],
] as const;

export function LandingPricing({page = false}: {page?: boolean}) {
  const [period, setPeriod] = useState<BillingPeriod>("monthly");

  return <section className={`ed-pricing-section${page ? " ed-pricing-section-page" : ""}`} id="pricing">
    <div className="ed-pricing-heading">
      <p className="ed-kicker">A little room to grow</p>
      <h2>Start free.<br/>Grow when you&apos;re ready.</h2>
      <p>Explore your workspace, connect your channels, and preview a few posts before deciding to start a trial.</p>
    </div>
    <article className="ed-free-start"><div><p className="ed-kicker">Free to get started · no card</p><h3>Try the workflow before you pay.</h3><p>One workspace, up to three accounts on each channel, and three drafts with previews. Start a 7-day trial only when you want to schedule or publish.</p></div><a className="ed-button" href={`${APP_ORIGIN}/register`}>Create a free account <span aria-hidden="true">→</span></a></article>
    <div className="ed-pricing-switcher" role="group" aria-label="Billing period">
      {periods.map((option) => <button key={option.key} className={period === option.key ? "active" : ""} type="button" onClick={() => setPeriod(option.key)} aria-pressed={period === option.key}>
        <span>{option.label}</span><small>{option.detail}</small>
      </button>)}
    </div>
    <p className="ed-pricing-savings-note">{period === "monthly" ? "Paid plans include a 7-day trial with a card. You can explore the free workspace first." : period === "quarterly" ? "Paid plans include a 7-day trial. Pay every 3 months and save CAD $5–$10 compared with monthly billing." : "Paid plans include a 7-day trial. Pay yearly and save CAD $35–$55 compared with monthly billing."}</p>
    <div className="ed-pricing-grid">
      {plans.map((plan) => <article className={`ed-price-card${plan.featured ? " featured" : ""}`} key={plan.key}>
        <div className="ed-price-card-top"><h3>{plan.eyebrow[0] + plan.eyebrow.slice(1).toLowerCase()}</h3>{plan.featured && <span className="ed-price-badge">Most room</span>}</div>
        <p className="ed-price-description">{plan.description}</p>
        <div className="ed-price-amount"><span className="ed-price-currency">CAD&nbsp;$</span><strong>{plan[period]}</strong><span className="ed-price-suffix">{period === "monthly" ? "/ month" : period === "quarterly" ? "/ 3 months" : "/ year"}</span></div>
        <p className="ed-price-equivalent">{period === "monthly" ? "7-day free trial · card required" : <>CAD&nbsp;${plan.monthlyEquivalent[period]}/mo · save CAD&nbsp;${plan.savings[period].amount} ({plan.savings[period].percent})</>}</p>
        <a className={plan.featured ? "ed-button" : "ed-price-button"} href={`${APP_ORIGIN}/register`}>Try the free workspace first</a>
        <ul className="ed-price-feature-list">
          {["Unlimited publishing", `${plan.capacity.workspaces} active workspaces`, `${plan.capacity.accounts} connected accounts`, `${plan.capacity.slots} account slots per workspace`, ...features].map((item) => <li key={item}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 10.5 3.2 3.2L15 6.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>{item}</li>)}
        </ul>
      </article>)}
    </div>
    <section className="ed-pricing-comparison" aria-labelledby="pricing-comparison-title">
      <div className="ed-pricing-subheading"><p className="ed-kicker">At a glance</p><h3 id="pricing-comparison-title">Compare what’s included.</h3><p>Both plans include the complete SceneSmith workflow. Pro adds the room to run more brands and channels at once.</p></div>
      <div className="ed-comparison-wrap"><table><thead><tr><th scope="col">Capability</th><th scope="col">Starter</th><th scope="col">Pro</th></tr></thead><tbody>{comparisonRows.map(([label, starter, pro]) => <tr key={label}><th scope="row">{label}</th><td>{starter}</td><td>{pro}</td></tr>)}</tbody></table></div>
    </section>
    <p className="ed-pricing-footnote">Prices in CAD. Cancel anytime. No automatic overage charges. Taxes, if applicable, are shown before payment.</p>
    {!page && <Link className="ed-link ed-pricing-more" href="#pricing">Back to the plan options ↑</Link>}
  </section>;
}
