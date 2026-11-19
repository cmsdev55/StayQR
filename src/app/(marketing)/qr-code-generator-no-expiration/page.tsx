import { FeatureLanding, featureMetadata } from "@/components/content/feature-landing";

export const metadata = featureMetadata("qr-code-generator-no-expiration");

export default function Page() {
  return <FeatureLanding slug="qr-code-generator-no-expiration" />;
}
