import Link from "next/link";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return <Section className="not-found"><p className="eyebrow">404 / Page not found</p><Heading>That page moved<br />somewhere else.</Heading><Link className="text-link" href="/">Back to Athena <span aria-hidden="true">↗</span></Link></Section>;
}
