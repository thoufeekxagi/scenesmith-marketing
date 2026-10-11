import type {Metadata} from "next";
import {pageMetadata} from "../../lib/seo";
import {LegalCallout, LegalPage, LegalSection} from "../../components/legal-page";
import {LEGAL} from "../../lib/legal";

export const metadata: Metadata = pageMetadata("/terms", "Terms of service | SceneSmith", "The terms for using SceneSmith to create, review, schedule, and publish social media content with explicit human approval.");

export default function TermsPage() {
  return <LegalPage eyebrow="Terms" title="Terms for a publishing service with a human in the loop." intro="These terms govern your use of SceneSmith to create, review, schedule, and publish social content through accounts you authorize." updated={`Effective ${LEGAL.effectiveDate} · Last updated ${LEGAL.effectiveDate}`}>
    <LegalCallout><strong>Publishing rule.</strong> SceneSmith does not publish merely because content was drafted. Public delivery requires an exact preview and your explicit approval, and you remain responsible for the content and destination you approve.</LegalCallout>

    <LegalSection title="1. Agreement and eligibility">
      <p>By creating an account, connecting a provider, or using SceneSmith, you agree to these terms and the <a className="text-link" href="/privacy">Privacy Policy</a>. You must be old enough to enter a binding agreement where you live, and you must have authority to control every workspace, social account, and piece of content you connect or submit.</p>
    </LegalSection>

    <LegalSection title="2. The service">
      <p>SceneSmith provides a conversational social publishing layer: account and workspace management, provider connections, draft and preview workflows, media handling, scheduling, delivery attempts, receipts, and status history. Features and supported providers may change. ChatGPT is the creative interface; SceneSmith is not a substitute for reviewing the provider’s final result.</p>
    </LegalSection>

    <LegalSection title="3. Your content and accounts">
      <ul>
        <li>You retain your rights in text, media, trademarks, and other material you submit.</li>
        <li>You grant SceneSmith the limited permission needed to store, transform, transmit, schedule, and publish that material to the destinations you select.</li>
        <li>You are responsible for having permission to use the content, complying with provider rules and applicable law, and checking claims, links, mentions, accessibility, and audience before approval.</li>
        <li>You must keep your Google identity and connected provider accounts secure and promptly disconnect or revoke access if authority changes.</li>
      </ul>
    </LegalSection>

    <LegalSection title="4. Approval, scheduling, and delivery">
      <p>SceneSmith shows the workspace, destination handle, content, media, and timing before a public action. You must approve the exact preview used for a schedule or immediate publish. A schedule can be canceled or moved only while the delivery remains unpublished and within the supported state. Provider outages, policy checks, rate limits, revoked tokens, media failures, network failures, and platform changes can delay or prevent delivery. SceneSmith will show the recorded state and a repair path where available, but cannot guarantee provider availability or reach.</p>
    </LegalSection>

    <LegalSection title="5. Acceptable use">
      <p>You may not use SceneSmith to violate a provider’s terms, impersonate another person or organization, publish unlawful or infringing material, distribute malware or spam, evade safety or rate limits, access another workspace, upload credentials or sensitive restricted data, or interfere with the service. We may suspend or limit access to protect users, providers, or the service.</p>
    </LegalSection>

    <LegalSection title="6. Plans, billing, and cancellation">
      <p>Any paid plan, price, renewal interval, tax, and refund rule shown at checkout forms part of your order. Stripe processes payment details. Unless the checkout page or applicable law says otherwise, canceling stops the next renewal and does not automatically refund a period already paid. You can request a billing review through <a className="text-link" href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>. We may change plans or prices with reasonable notice and will not retroactively change a completed billing period.</p>
    </LegalSection>

    <LegalSection title="7. Intellectual property and feedback">
      <p>SceneSmith, its software, interface, documentation, trademarks, and original materials belong to {LEGAL.operator} or its licensors. We grant you a limited, non-exclusive, revocable right to use the service for your authorized business or personal publishing workflow. If you send feedback, you allow us to use it to improve the service without identifying you publicly.</p>
    </LegalSection>

    <LegalSection title="8. Suspension and termination">
      <p>You may stop using SceneSmith, disconnect providers, and request deletion at any time. We may suspend or terminate access for breach, fraud, non-payment, provider revocation, security risk, or legal requirement. Termination does not erase content already published to a provider and does not delete ChatGPT conversations or memories. Sections that should reasonably survive termination, including ownership, payment obligations, disclaimers, liability limits, and dispute terms, remain in effect.</p>
    </LegalSection>

    <LegalSection title="9. Disclaimers and liability">
      <p>To the maximum extent permitted by law, SceneSmith is provided “as is” and “as available.” We disclaim implied warranties of merchantability, fitness, non-infringement, uninterrupted availability, and any guarantee that a provider will accept or display content. To the maximum extent permitted by law, {LEGAL.operator} will not be liable for indirect, incidental, special, consequential, exemplary, or lost-profit damages. Our total liability for claims relating to the service is limited to the fees you paid to SceneSmith for the three months before the event giving rise to the claim, except where applicable law does not permit that limitation.</p>
    </LegalSection>

    <LegalSection title="10. Governing law and contact">
      <p>These terms are governed by the laws of {LEGAL.jurisdiction}, without regard to conflict-of-law rules. Courts located there will have exclusive jurisdiction unless applicable consumer law requires another forum. Contact us at <a className="text-link" href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a> for questions, notices, or an account request.</p>
    </LegalSection>
  </LegalPage>;
}
