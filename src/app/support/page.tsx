import type {Metadata} from "next";
import {pageMetadata} from "../../lib/seo";
import {LegalCallout, LegalPage, LegalSection} from "../../components/legal-page";
import {LEGAL} from "../../lib/legal";

export const metadata: Metadata = pageMetadata("/support", "Support | SceneSmith", "Get help with SceneSmith: sign-in, social connections, drafts, publishing, billing, and privacy requests.");

export default function SupportPage() {
  return <LegalPage eyebrow="Support" title="A direct path when something needs attention." intro="SceneSmith records the exact destination, delivery state, effect, and repair action so support can investigate without guesswork." updated={`Support contact · ${LEGAL.supportEmail}`}>
    <LegalCallout><strong>Contact support:</strong> <a className="text-link" href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>. Include the account email, workspace name, provider handle, approximate time, and any correlation ID shown by SceneSmith. Never send passwords, access tokens, MFA codes, or client secrets.</LegalCallout>

    <LegalSection title="Account and sign-in">
      <p>Use the Google account that owns the SceneSmith workspace. If a new browser or a changed account shows an empty workspace, sign out, return to the production dashboard, and sign in with the workspace owner’s Google account. ChatGPT/MCP authorization and the normal SceneSmith website session are separate sign-in surfaces.</p>
    </LegalSection>

    <LegalSection title="Social connections">
      <p>Open <a className="text-link" href="/app/connections">Connections</a> to see the signed-in identity, workspace destinations, connection state, and disconnect controls. Reconnect only the provider that reports an expired or revoked authorization. Do not paste provider credentials into ChatGPT or support messages.</p>
    </LegalSection>

    <LegalSection title="Drafts, publishing, and delivery">
      <p>SceneSmith requires an exact preview and explicit approval before a public publish or schedule. If a delivery fails, use the delivery ID and correlation ID shown in the result. Do not retry a failed delivery when the provider may already have accepted it; ask support to verify the recorded state first.</p>
    </LegalSection>

    <LegalSection title="Billing and privacy requests">
      <p>Billing questions, data-access requests, correction requests, and deletion requests can all be sent to <a className="text-link" href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>. We target a response within two business days. We may request enough information to verify account ownership before disclosing or deleting data.</p>
    </LegalSection>

    <LegalSection title="Provider support">
      <p>Meta/Instagram, X, LinkedIn, Google, Stripe, and ChatGPT each control parts of their own service. SceneSmith can explain the SceneSmith request and recorded response, but provider policy decisions, account restrictions, and platform outages may require support from that provider.</p>
    </LegalSection>
  </LegalPage>;
}
