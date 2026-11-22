import { FeatureLanding, featureMetadata } from "@/components/content/feature-landing";

export const metadata = featureMetadata("qr-code-generator-no-sign-up");

export default function Page() {
  return <FeatureLanding slug="qr-code-generator-no-sign-up" />;
}
