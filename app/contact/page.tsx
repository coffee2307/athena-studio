import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { Text } from "@/components/ui/Text";
import { siteConfig } from "@/lib/constants";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata("Contact");

export default function ContactPage() {
  return <Section className="contact-page"><p className="eyebrow">Start a conversation</p><Heading level={1}>Tell us what<br />you&apos;re building.</Heading><Text size="large" className="contact-copy">Have a project in mind, or a problem worth thinking through? We&apos;d like to hear about it.</Text><Button href={`mailto:${siteConfig.email}`}>Email {siteConfig.email}</Button></Section>;
}
