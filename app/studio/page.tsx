import { StudioIntro } from "@/components/sections/StudioIntro";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata("Studio");

export default function StudioPage() {
  return <><StudioIntro /><ContactCTA /></>;
}
