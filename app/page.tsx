import { ContactCTA } from "@/components/sections/ContactCTA";
import { Hero } from "@/components/sections/Hero";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StudioIntro } from "@/components/sections/StudioIntro";
import { WorkSection } from "@/components/sections/WorkSection";

export default function HomePage() {
  return <><Hero /><WorkSection /><ServicesSection /><ProcessSection /><StudioIntro /><ContactCTA /></>;
}
