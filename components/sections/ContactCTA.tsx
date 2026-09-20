import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export function ContactCTA() {
  return <Section tone="inverse" className="contact-cta"><div><p className="eyebrow">Have a good one?</p><Heading>Let&apos;s make it<br />matter.</Heading></div><Button href="/contact" variant="outline">Start a project</Button></Section>;
}
