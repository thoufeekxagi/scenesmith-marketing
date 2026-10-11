import type {Metadata} from "next";
import {pageMetadata} from "../../lib/seo";
import {LegalCallout, LegalPage, LegalSection} from "../../components/legal-page";
import {LEGAL} from "../../lib/legal";

export const metadata: Metadata = pageMetadata("/data-deletion", "Data deletion | SceneSmith", "How to disconnect accounts and request deletion of your SceneSmith data.");

export default function DataDeletionPage() {
  return <LegalPage eyebrow="Data deletion" title="Remove your SceneSmith data with a clear paper trail." intro="Disconnecting a provider stops future publishing to that account. A full deletion request removes the SceneSmith workspace data after we verify the request." updated={`Deletion requests · ${LEGAL.supportEmail}`}>
    <LegalCallout><strong>Start a request:</strong> <a className="text-link" href={`mailto:${LEGAL.supportEmail}?subject=SceneSmith%20data%20deletion%20request`}>{LEGAL.supportEmail}</a>. Use the email address of the SceneSmith account and name the workspace you want removed.</LegalCallout>

    <LegalSection title="1. Disconnect a social account now">
      <ol>
        <li>Sign in at the production dashboard.</li>
        <li>Open <a className="text-link" href="/app/connections">Connections</a> and confirm the Google identity and exact workspace.</li>
        <li>Choose <strong>Disconnect</strong> beside the Instagram, X, or LinkedIn account and confirm the action.</li>
        <li>For an additional safeguard, revoke SceneSmith in the provider’s own account settings.</li>
      </ol>
      <p>Disconnecting prevents new SceneSmith deliveries to that destination. It does not delete posts already published on the provider.</p>
    </LegalSection>

    <LegalSection title="2. Request full account or workspace deletion">
      <p>Email <a className="text-link" href={`mailto:${LEGAL.supportEmail}?subject=SceneSmith%20data%20deletion%20request`}>{LEGAL.supportEmail}</a> from the signed-in account email. Include the workspace name and whether you want the entire SceneSmith account or one workspace removed. We verify ownership, disconnect provider credentials, cancel unpublished future deliveries where possible, and delete the account, workspace, drafts, uploaded media, schedules, and delivery history from active systems.</p>
    </LegalSection>

    <LegalSection title="3. Timing and exceptions">
      <p>We target removal from active systems within 30 days after a verified request. Encrypted backups may take up to 90 days to age out. We may retain limited records when required for accounting, fraud prevention, security, legal claims, or compliance. Those records remain access-restricted.</p>
    </LegalSection>

    <LegalSection title="4. What SceneSmith cannot delete">
      <p>SceneSmith cannot delete posts already published to Instagram, X, LinkedIn, or another provider; use that provider’s controls for those posts. SceneSmith also cannot delete ChatGPT conversations or memories. Manage those in ChatGPT settings. Disconnecting the app is separate from deleting ChatGPT history or Memory.</p>
    </LegalSection>
  </LegalPage>;
}
