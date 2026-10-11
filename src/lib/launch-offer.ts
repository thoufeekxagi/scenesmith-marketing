export const DEFAULT_STAGING_LAUNCH_OFFER_CODE = "STAGING50";

const safeOfferCode = /^[A-Za-z0-9_-]{3,64}$/;

export type LaunchOfferConfig = {
  code: string;
};

type LaunchOfferEnvironment = Record<string, string | undefined>;

/**
 * The offer is enabled only when the deployment explicitly opts in. The code
 * is customer-facing configuration, not a Stripe secret; keep the allowlist
 * narrow so an accidental env value cannot become arbitrary markup.
 */
export function getLaunchOfferConfig(source: LaunchOfferEnvironment = process.env): LaunchOfferConfig | null {
  const deployment = source.SCENESMITH_DEPLOYMENT_ENV;
  if (deployment !== "staging" && deployment !== "production") return null;

  const configuredCode = source.SCENESMITH_LAUNCH_OFFER_CODE?.trim();
  if (configuredCode && safeOfferCode.test(configuredCode)) return {code: configuredCode};
  return deployment === "staging" ? {code: DEFAULT_STAGING_LAUNCH_OFFER_CODE} : null;
}
