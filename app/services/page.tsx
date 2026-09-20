import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata("Services");

export default function ServicesPage() {
  return <><ServicesSection /><ProcessSection /></>;
}
