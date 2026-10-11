import type {Metadata} from "next";
import {pageMetadata} from "../../lib/seo";
import {LegalCallout, LegalPage, LegalSection} from "../../components/legal-page";
import {LEGAL} from "../../lib/legal";

export const metadata: Metadata = pageMetadata("/privacy", "Privacy policy | SceneSmith", "How SceneSmith collects, uses, and protects the data needed to connect your social accounts and publish from ChatGPT.");

export default function PrivacyPage() {
  return <LegalPage eyebrow="Privacy" title="A clear account of the data SceneSmith uses." intro="SceneSmith processes the information needed to connect your social accounts, prepare content, and deliver the posts you approve. This policy explains what we collect, why we use it, who receives it, and the controls available to you." updated={`Effective ${LEGAL.effectiveDate} · Last updated ${LEGAL.effectiveDate}`}>
    <LegalCallout><strong>Short version.</strong> SceneSmith does not sell personal data, does not collect email passwords, and does not return provider access tokens to ChatGPT. Public publishing always requires the approval flow described in the product.</LegalCallout>

    <LegalSection title="1. Who we are">
      <p>{LEGAL.product} is operated by {LEGAL.operator} ("SceneSmith", "we", "us", or "our"). Questions about this policy or a privacy request can be sent to <a className="text-link" href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>.</p>
    </LegalSection>

    <LegalSection title="2. Information we process">
      <p><strong>Account and identity.</strong> When you sign in with Google, we receive the identity information Google makes available to the service, such as your email address, display name, provider subject identifier, verified-email status, and session/security metadata.</p>
      <p><strong>Workspace and billing.</strong> We process workspace names, organization membership and role, timezone, account preferences, subscription plan and status, and Stripe customer or subscription identifiers. Stripe handles payment-card details; SceneSmith does not store full card numbers.</p>
      <p><strong>Connected social accounts.</strong> When you authorize a provider, we process the provider account ID, handle, display name, avatar where supplied, granted scopes, connection status, token expiry, and encrypted access or refresh credentials. Credentials remain server-side and are not included in MCP responses.</p>
      <p><strong>Content and delivery records.</strong> We process the text, media, captions, alt text, drafts, approvals, schedules, destination handles, delivery receipts, provider post links, and provider error details needed to execute your request and show its result.</p>
      <p><strong>Service and security data.</strong> We may process IP address, device or browser information, request timestamps, security events, limited diagnostic metadata, and correlation IDs to prevent abuse, troubleshoot failures, and protect the service. We do not ask for or store social passwords, API secrets supplied in chat, MFA codes, or payment-card numbers.</p>
      <p><strong>Context supplied by ChatGPT.</strong> ChatGPT may send relevant conversation context, and may send relevant memory-derived context when the user has enabled those ChatGPT features and the platform permits it. SceneSmith uses that context only to fulfill the request sent to the app; SceneSmith cannot browse unrelated chats or independently control ChatGPT Memory.</p>
    </LegalSection>

    <LegalSection title="3. Why we use information">
      <ul>
        <li>Authenticate the user and keep each workspace and destination isolated.</li>
        <li>Connect, refresh, disconnect, and verify authorized Instagram, X, and other supported provider accounts.</li>
        <li>Create previews, retain drafts, schedule approved work, publish through provider APIs, and return durable delivery status.</li>
        <li>Provide billing, support, security monitoring, fraud prevention, debugging, and service improvement.</li>
        <li>Meet legal, accounting, provider, and platform requirements.</li>
      </ul>
      <p>We do not use connected social content to train a SceneSmith model, sell it, or use it for advertising. If that changes, this policy will be updated before the new use begins.</p>
    </LegalSection>

    <LegalSection title="4. Service providers and recipients">
      <p>We share only what is necessary with the services that operate the product: Supabase for authentication, database, and private storage; the SceneSmith hosting and worker infrastructure; Stripe for billing; error-monitoring or email services only when enabled for the account; Google for sign-in; and the social provider APIs you explicitly connect, including Meta/Instagram, X, and any later provider you authorize. Providers process information under their own terms and privacy policies.</p>
      <p>We may disclose information when required by law, to protect users or the service, to enforce our terms, or as part of a merger, financing, or asset transfer subject to appropriate confidentiality protections.</p>
    </LegalSection>

    <LegalSection title="5. Provider-specific handling">
      <p><strong>Google.</strong> Google is used for SceneSmith sign-in. SceneSmith does not request access to Gmail messages, contacts, Drive files, or passwords as part of the social publishing workflow.</p>
      <p><strong>Meta and Instagram.</strong> We use the Instagram account identifier, handle, profile details supplied by the API, granted permissions, captions, media, and delivery results only to connect the account and deliver the content you approve. We do not sell Instagram data, use it for advertising profiles, or use it to train a SceneSmith model. Disconnecting or revoking access stops future use. A verified deletion request removes SceneSmith-held connection data and unpublished content subject to the retention exceptions below.</p>
      <p><strong>X.</strong> We use the X account identifier, handle, granted permissions, post text, media, and delivery results only to prepare and deliver content you approve. We do not sell X data, use it for advertising profiles, or use it to train a SceneSmith model. Disconnecting or revoking access stops future use and starts removal of stored connection credentials.</p>
      <p><strong>LinkedIn.</strong> We request only the permissions needed for the authorized member to publish. LinkedIn member identifiers, profile details, post content, and delivery records are used only for that member's connected publishing workflow. We do not export LinkedIn member data, combine it with unrelated profiles, use it for prospecting or advertising, or use it to train a SceneSmith model. LinkedIn rules may require shorter storage periods than our general retention targets, and those shorter periods control.</p>
      <p><strong>OpenAI and ChatGPT.</strong> SceneSmith may receive the prompt and relevant context that ChatGPT sends with a request. We use it to complete that request and do not use it to train a SceneSmith model. ChatGPT controls its own conversation history, Memory, and app permission settings.</p>
    </LegalSection>

    <LegalSection title="6. Retention">
      <ul>
        <li>Account, workspace, connection, and billing records are kept while the account is active and for the period needed for accounting, security, dispute resolution, or legal obligations afterward.</li>
        <li>Provider credentials are kept until you disconnect the provider or request account deletion. We target removal from active systems within 30 days after a verified deletion request.</li>
        <li>Drafts, uploaded media, schedules, and delivery history are kept until you delete them or delete the workspace, unless a longer period is required for a dispute, abuse investigation, or legal obligation. We target removal from active systems within 30 days after verified deletion.</li>
        <li>Security and diagnostic logs are normally retained for up to 30 days. Billing and legally required business records may be retained for the period required by law. Encrypted backups may take up to 90 days to age out. If a provider requires a shorter period for its data, the shorter provider period applies.</li>
      </ul>
    </LegalSection>

    <LegalSection title="7. Security">
      <p>SceneSmith uses HTTPS, server-side sessions, account and workspace authorization checks, encrypted provider credentials, private media storage, least-privilege database access, explicit confirmation for public publishing, idempotency controls, and delivery audit records. No internet service can guarantee absolute security. Tell us immediately if you suspect unauthorized access.</p>
    </LegalSection>

    <LegalSection title="8. Your controls">
      <ul>
        <li>Disconnect a social account from the signed-in Connections page or revoke SceneSmith access at the provider.</li>
        <li>Request correction, export, or deletion by contacting <a className="text-link" href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>.</li>
        <li>Control ChatGPT conversation context, Memory, model-improvement settings, and app permissions in ChatGPT. Those controls are separate from SceneSmith account deletion.</li>
      </ul>
    </LegalSection>

    <LegalSection title="9. International processing and age limits">
      <p>SceneSmith and its service providers may process information in countries other than where you live. We use contractual, technical, and organizational safeguards appropriate to the processing. SceneSmith is not intended for children under 13, or the higher minimum age required where you live. Do not use the service if you cannot legally authorize the connected account or content.</p>
    </LegalSection>

    <LegalSection title="10. Policy changes">
      <p>We may update this policy when the service, providers, or law changes. The “Last updated” date will change with material revisions. We will provide notice through the service or by email when legally required.</p>
    </LegalSection>
  </LegalPage>;
}
