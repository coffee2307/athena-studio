import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ImmersiveJourney} from "@/components/immersive/ImmersiveJourney";

const slugs = ["creative-studio", "architecture-studio", "auto-showroom"] as const;
type Slug = (typeof slugs)[number];
type Props = {params: Promise<{slug: string}>};

export function generateStaticParams() {return slugs.map(slug => ({slug}));}
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params;
  return {title: "Trải nghiệm 3D — " + slug + " — Athena Studio", description: "Hành trình 3D tương tác theo cuộn trang, giới thiệu mẫu thiết kế website Athena.", robots: {index: false, follow: false}};
}

export default async function ExperiencePage({params}: Props) {
  const {slug} = await params;
  if (!slugs.includes(slug as Slug)) notFound();
  return <ImmersiveJourney slug={slug as Slug}/>;
}
