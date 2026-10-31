/** The navigation is part of each world's art direction, not a shared theme switch. */
export type WorldNavIdentity = {
 name:string; opener:string; glyph:string; closing:string; headline:string; subtitle:string; scene:string;
};
export const WORLD_NAV_IDENTITIES:Record<string,WorldNavIdentity>={
 "creative-studio":{name:"gallery",opener:"KHÁM PHÁ",glyph:"✳",closing:"THU GỌN",headline:"THE INDEX.",subtitle:"Studio / Selected paths",scene:"Editorial gallery"},
 "modern-corporate":{name:"terminal",opener:"DANH MỤC",glyph:"▦",closing:"ĐÓNG BẢNG",headline:"Điều hướng",subtitle:"NORTH / Business systems",scene:"Corporate utility rail"},
 "commerce-standard":{name:"catalog",opener:"DANH MỤC",glyph:"⊞",closing:"THU GỌN",headline:"Danh mục cửa hàng",subtitle:"MỘC / Objects",scene:"Storefront bottom catalog"},
 "fashion-archive":{name:"atelier",opener:"INDEX",glyph:"№",closing:"CLOSE",headline:"ATELIER INDEX",subtitle:"Collection N° 01",scene:"Fashion collection spread"},
 "saas-product":{name:"command",opener:"TRUY CẬP",glyph:"⌘",closing:"ĐÓNG",headline:"Quick navigation",subtitle:"LUMA / WORKSPACE",scene:"App command palette"},
 "campaign-landing":{name:"poster",opener:"KHÁM PHÁ!",glyph:"★",closing:"ĐÓNG!",headline:"MAKE SOME NOISE.",subtitle:"MỞ / FESTIVAL 2026",scene:"Festival poster takeover"},
 "hospitality-booking":{name:"table",opener:"CHỌN BÀN",glyph:"❧",closing:"GẤP LẠI",headline:"Mời bạn ghé.",subtitle:"Từ căn bếp đến câu chuyện",scene:"Restaurant folded menu"},
 "editorial-journal":{name:"contents",opener:"MỤC LỤC",glyph:"¶",closing:"KHÉP SỔ",headline:"Contents",subtitle:"FIELDNOTES / ISSUE 08",scene:"Magazine table of contents"},
 "architecture-studio":{name:"blueprint",opener:"SƠ ĐỒ",glyph:"□",closing:"THU BẢN VẼ",headline:"ARCHITECTURE / INDEX",subtitle:"Spaces. Materials. People.",scene:"Architectural blueprint drawer"},
 "wellness-clinic":{name:"breath",opener:"THƯ GIÃN",glyph:"✺",closing:"KHÉP LẠI",headline:"Chọn nhịp của bạn",subtitle:"AN NHIÊN / A quieter route",scene:"Wellness garden sheet"},
 "property-showcase":{name:"residence",opener:"KHÔNG GIAN",glyph:"⌂",closing:"ĐÓNG",headline:"DISCOVER NEST",subtitle:"Curated residences / 2026",scene:"Real estate viewing rail"},
 "education-platform":{name:"syllabus",opener:"LỘ TRÌNH",glyph:"▤",closing:"XONG",headline:"Bạn muốn đi đâu?",subtitle:"MỞ / LEARNING",scene:"Learning card tabs"},
 "pet-store":{name:"poppy",opener:"KHÁM PHÁ",glyph:"✿",closing:"ĐÓNG NHA",headline:"Poppy's world!",subtitle:"Little things for big love",scene:"Playful pet cloud"},
 "auto-showroom":{name:"cockpit",opener:"HỆ THỐNG",glyph:"◎",closing:"THU GỌN",headline:"CONTROL / VELAR",subtitle:"BLACK VELOCITY — Navigation",scene:"Automotive cockpit"},
 "engineering-industry":{name:"forge",opener:"HỆ THỐNG",glyph:"▥",closing:"ĐÓNG",headline:"ENGINEERING INDEX",subtitle:"FORGE / 01—05",scene:"Industrial safety shutter"},
 "finance-trust":{name:"ledger",opener:"THÔNG TIN",glyph:"⌗",closing:"ĐÓNG",headline:"ATLAS / CAPITAL",subtitle:"Directory / Verified pathways",scene:"Financial ledger"},
 "construction-firm":{name:"structure",opener:"HẠNG MỤC",glyph:"▧",closing:"ĐÓNG",headline:"BUILD / NAVIGATION",subtitle:"TERRACON — Works and services",scene:"Construction site-plan"},
 "music-label":{name:"vinyl",opener:"TRACKLIST",glyph:"♫",closing:"STOP",headline:"SIDE A / SIDE B",subtitle:"ECHO / RECORDS",scene:"Record sleeve"},
 "live-concert":{name:"stage",opener:"LINE-UP",glyph:"▂▅▇",closing:"HẠ MÀN",headline:"THE NIGHT STARTS HERE",subtitle:"NEON / LIVE",scene:"Neon concert stage"},
 "team-intranet":{name:"workspace",opener:"ỨNG DỤNG",glyph:"▦",closing:"ĐÓNG",headline:"Điều hướng nội bộ",subtitle:"ORBIT / TEAM WORKSPACE",scene:"Workspace app launcher"},
 // Digital Creators is a self-contained, vendored website with its own navigation.
 "digital-creators":{name:"digital-creators-native",opener:"KHÁM PHÁ",glyph:"◈",closing:"ĐÓNG",headline:"DIGITAL CREATORS",subtitle:"Independent club experience",scene:"Standalone website"},
};
