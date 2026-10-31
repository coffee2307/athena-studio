/** The navigation is part of each world's art direction, not a shared theme switch. */
export type WorldNavIdentity = {
 name:string; bars:2|3; headline:string; subtitle:string; scene:string;
};
export const WORLD_NAV_IDENTITIES:Record<string,WorldNavIdentity>={
 "creative-studio":{name:"gallery",bars:2,headline:"THE INDEX.",subtitle:"Studio / Selected paths",scene:"Editorial gallery"},
 "modern-corporate":{name:"terminal",bars:3,headline:"Điều hướng",subtitle:"NORTH / Business systems",scene:"Corporate utility rail"},
 "commerce-standard":{name:"catalog",bars:3,headline:"Danh mục cửa hàng",subtitle:"MỘC / Objects",scene:"Storefront bottom catalog"},
 "fashion-archive":{name:"atelier",bars:2,headline:"ATELIER INDEX",subtitle:"Collection N° 01",scene:"Fashion collection spread"},
 "saas-product":{name:"command",bars:3,headline:"Quick navigation",subtitle:"LUMA / WORKSPACE",scene:"App command palette"},
 "campaign-landing":{name:"poster",bars:3,headline:"MAKE SOME NOISE.",subtitle:"MỞ / FESTIVAL 2026",scene:"Festival poster takeover"},
 "hospitality-booking":{name:"table",bars:2,headline:"Mời bạn ghé.",subtitle:"Từ căn bếp đến câu chuyện",scene:"Restaurant folded menu"},
 "editorial-journal":{name:"contents",bars:2,headline:"Contents",subtitle:"FIELDNOTES / ISSUE 08",scene:"Magazine table of contents"},
 "architecture-studio":{name:"blueprint",bars:2,headline:"ARCHITECTURE / INDEX",subtitle:"Spaces. Materials. People.",scene:"Architectural blueprint drawer"},
 "wellness-clinic":{name:"breath",bars:2,headline:"Chọn nhịp của bạn",subtitle:"AN NHIÊN / A quieter route",scene:"Wellness garden sheet"},
 "property-showcase":{name:"residence",bars:2,headline:"DISCOVER NEST",subtitle:"Curated residences / 2026",scene:"Real estate viewing rail"},
 "education-platform":{name:"syllabus",bars:3,headline:"Bạn muốn đi đâu?",subtitle:"MỞ / LEARNING",scene:"Learning card tabs"},
 "pet-store":{name:"poppy",bars:3,headline:"Poppy's world!",subtitle:"Little things for big love",scene:"Playful pet cloud"},
 "auto-showroom":{name:"cockpit",bars:2,headline:"CONTROL / VELAR",subtitle:"BLACK VELOCITY — Navigation",scene:"Automotive cockpit"},
 "engineering-industry":{name:"forge",bars:3,headline:"ENGINEERING INDEX",subtitle:"FORGE / 01—05",scene:"Industrial safety shutter"},
 "finance-trust":{name:"ledger",bars:3,headline:"ATLAS / CAPITAL",subtitle:"Directory / Verified pathways",scene:"Financial ledger"},
 "construction-firm":{name:"structure",bars:3,headline:"BUILD / NAVIGATION",subtitle:"TERRACON — Works and services",scene:"Construction site-plan"},
 "music-label":{name:"vinyl",bars:2,headline:"SIDE A / SIDE B",subtitle:"ECHO / RECORDS",scene:"Record sleeve"},
 "live-concert":{name:"stage",bars:3,headline:"THE NIGHT STARTS HERE",subtitle:"NEON / LIVE",scene:"Neon concert stage"},
 "team-intranet":{name:"workspace",bars:3,headline:"Điều hướng nội bộ",subtitle:"ORBIT / TEAM WORKSPACE",scene:"Workspace app launcher"},
 // Digital Creators is a self-contained, vendored website with its own navigation.
 "digital-creators":{name:"digital-creators-native",bars:3,headline:"DIGITAL CREATORS",subtitle:"Independent club experience",scene:"Standalone website"},
};
