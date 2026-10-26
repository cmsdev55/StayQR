import { FeatureLanding, featureMetadata } from "@/components/content/feature-landing";

export const metadata = featureMetadata("qr-code-with-logo");

export default function Page() {
  return <FeatureLanding slug="qr-code-with-logo" />;
}
