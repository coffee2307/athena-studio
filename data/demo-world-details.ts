import type {DemoCopy} from "@/data/demo-worlds";

export type WorldService={number:string;title:string;detail:string;outcome:string};
export type WorldDetail={
 slogan:string;storyTitle:string;story:string;approach:string;
 navWork:string;navServices:string;navAbout:string;
 worksLabel:string;servicesLabel:string;aboutLabel:string;
 contactTitle:string;contactIntro:string;footerLine:string;
 principles:[string,string,string];
 services:[WorldService,WorldService,WorldService];
};

export const worldDetails:Record<string,WorldDetail>={
 "creative-studio":{
  slogan:"Độc lập trong tư duy. Rõ ràng trong biểu đạt.",storyTitle:"Chúng tôi tạo ra điều đáng nhớ, không phải điều ồn ào.",
  story:"SORA là một studio sáng tạo giả định dành cho những thương hiệu muốn nói bằng giọng riêng. Mỗi dự án bắt đầu từ câu hỏi đúng, rồi mới đến hình ảnh, ngôn ngữ và trải nghiệm.",
  approach:"Tìm bản chất câu chuyện, xây hệ thống nhận diện, sau đó đưa nó vào từng điểm chạm thực tế.",
  navWork:"Dự án",navServices:"Chuyên môn",navAbout:"Studio",worksLabel:"Selected work / 01—03",servicesLabel:"What we do",aboutLabel:"The studio",
  contactTitle:"Một ý tưởng thú vị bắt đầu bằng một cuộc trò chuyện.",contactIntro:"Chia sẻ câu chuyện, tham vọng và thách thức của thương hiệu. Chúng tôi sẽ phác thảo hướng đi phù hợp.",footerLine:"Independent creative practice / 2026",
  principles:["Chiến lược trước hình thức","Tôn trọng sự khác biệt","Thiết kế để trường tồn"],
  services:[{number:"01",title:"Chiến lược thương hiệu",detail:"Định vị, ngôn ngữ và câu chuyện định hướng mọi quyết định thị giác.",outcome:"Định vị · Tuyên ngôn · Định hướng"},{number:"02",title:"Nhận diện & art direction",detail:"Xây dựng hệ thống đồ họa, hình ảnh và chuyển động có tính nhận diện.",outcome:"Identity · Digital · Motion"},{number:"03",title:"Trải nghiệm số",detail:"Website giàu nhịp đọc, thẩm mỹ và điều hướng rõ ràng trên mọi màn hình.",outcome:"Web · UX · Interaction"}]
 },
 "modern-corporate":{
  slogan:"Độ rõ ràng là lợi thế cạnh tranh.",storyTitle:"Đội ngũ vận hành tốt cần những hệ thống đáng tin.",
  story:"NORTH là thương hiệu tư vấn vận hành mô phỏng. Chúng tôi tin doanh nghiệp phát triển bền vững khi quy trình, con người và công nghệ có chung một ngôn ngữ.",
  approach:"Khảo sát, đo lường, triển khai từng bước, rồi kiểm chứng tác động bằng các chỉ dấu rõ ràng.",
  navWork:"Giải pháp",navServices:"Dịch vụ",navAbout:"Về NORTH",worksLabel:"Solutions / Case studies",servicesLabel:"Capability framework",aboutLabel:"Our philosophy",
  contactTitle:"Bắt đầu bằng bài toán của doanh nghiệp.",contactIntro:"Mô tả điểm nghẽn đang gặp, quy mô vận hành và mục tiêu muốn đạt đến.",footerLine:"Systems / Strategy / Operations",
  principles:["Giải quyết đúng vấn đề","Quy trình minh bạch","Đo lường trước mở rộng"],
  services:[{number:"01",title:"Operational audit",detail:"Rà soát quy trình, luồng dữ liệu và các điểm nghẽn quan trọng.",outcome:"Process mapping · Audit"},{number:"02",title:"Digital enablement",detail:"Thiết kế các công cụ nội bộ và tích hợp theo cách đội ngũ thực sự làm việc.",outcome:"Platforms · Integration"},{number:"03",title:"Managed improvement",detail:"Tiếp tục hỗ trợ, đo hiệu quả và tối ưu sau khi đưa hệ thống vào sử dụng.",outcome:"Monitoring · Optimization"}]
 },
 "commerce-standard":{
  slogan:"Sở hữu ít hơn. Yêu thích nhiều hơn.",storyTitle:"Đồ vật tốt làm cho những ngày bình thường đẹp hơn.",
  story:"MỘC OBJECTS là cửa hàng concept dành cho những món đồ hữu dụng và thú vị, được tuyển chọn để đồng hành lâu dài thay vì chỉ theo mùa.",
  approach:"Chọn vật liệu tốt, quan sát trải nghiệm thực tế, giữ thiết kế đúng với chức năng.",
  navWork:"Cửa hàng",navServices:"Bộ sưu tập",navAbout:"Câu chuyện",worksLabel:"The collection / 2026",servicesLabel:"Curation notes",aboutLabel:"Everyday philosophy",
  contactTitle:"Có điều gì bạn muốn biết về món đồ?",contactIntro:"Hãy để lại câu hỏi về sản phẩm, chất liệu hoặc nhu cầu lựa chọn của bạn.",footerLine:"Thoughtful objects for everyday living",
  principles:["Thiết kế bền vững","Chất liệu trung thực","Chọn lọc vừa đủ"],
  services:[{number:"01",title:"Everyday essentials",detail:"Những món đồ cơ bản, đẹp và dễ sử dụng trong nhịp sống hằng ngày.",outcome:"Home · Work · Lifestyle"},{number:"02",title:"Objects & accessories",detail:"Phụ kiện nhỏ với hình thức tinh gọn và công năng rõ ràng.",outcome:"Accessories · Utility"},{number:"03",title:"Special editions",detail:"Tuyển chọn sản phẩm giới hạn với câu chuyện thiết kế riêng.",outcome:"Limited · Crafted"}]
 },
 "fashion-archive":{
  slogan:"A study in form, texture and movement.",storyTitle:"Mỗi thiết kế giữ lại một dấu vết của thời gian.",
  story:"ATELIER / 01 là nhãn thời trang concept mang tinh thần lưu trữ: không chạy theo mùa mà nghiên cứu phom dáng, chất liệu và chuyển động của cơ thể.",
  approach:"Phom dáng trước xu hướng. Thử nghiệm tỷ lệ, tinh chỉnh từng chi tiết và chỉ giữ những gì cần thiết.",
  navWork:"Collection",navServices:"Atelier",navAbout:"Manifesto",worksLabel:"Collection N°01",servicesLabel:"Inside the atelier",aboutLabel:"Our manifesto",
  contactTitle:"Mỗi chi tiết đều bắt đầu từ một câu hỏi.",contactIntro:"Trao đổi về bộ sưu tập, chất liệu và trải nghiệm mặc trong bản demo của thương hiệu.",footerLine:"ARCHIVE / EDITION / FORM",
  principles:["Form follows feeling","Considered materials","Limited by intention"],
  services:[{number:"01",title:"Outerwear studies",detail:"Những mẫu áo khoác đặt trọng tâm vào cấu trúc và tỷ lệ khi chuyển động.",outcome:"Jackets · Silhouettes"},{number:"02",title:"Uniform essentials",detail:"Các lớp trang phục thường ngày có thể kết hợp linh hoạt.",outcome:"Shirts · Layers"},{number:"03",title:"Objects & details",detail:"Phụ kiện và chi tiết thiết kế nhỏ thuộc ngôn ngữ chung của atelier.",outcome:"Objects · Accessories"}]
 },
 "saas-product":{
  slogan:"Less switching. More momentum.",storyTitle:"Một nơi để đội ngũ thấy công việc đang diễn ra.",
  story:"LUMA là nền tảng workspace giả lập tập trung các dự án, tín hiệu và quyết định quan trọng. Giao diện được thiết kế để giảm tiếng ồn và làm rõ bước tiếp theo.",
  approach:"Hiển thị điều quan trọng, giảm thao tác lặp lại và giúp mỗi cá nhân nhìn thấy đóng góp của mình.",
  navWork:"Nền tảng",navServices:"Tính năng",navAbout:"Về LUMA",worksLabel:"Product in action",servicesLabel:"Built for real work",aboutLabel:"Behind LUMA",
  contactTitle:"Làm việc rõ ràng hơn, từ hôm nay.",contactIntro:"Để lại email để trải nghiệm luồng đăng ký mẫu của nền tảng LUMA.",footerLine:"Focus your work. Find your flow.",
  principles:["Clarity by default","Built for teams","Privacy considered"],
  services:[{number:"01",title:"Project overview",detail:"Tổng hợp tiến độ, ưu tiên và trách nhiệm trong một bảng điều khiển.",outcome:"Boards · Planning"},{number:"02",title:"Automated workflows",detail:"Giảm việc chuyển đổi công cụ và các nhắc nhở lặp lại.",outcome:"Rules · Automation"},{number:"03",title:"Useful insights",detail:"Báo cáo có ngữ cảnh thay vì những con số thiếu ý nghĩa.",outcome:"Reports · Analytics"}]
 },
 "campaign-landing":{
  slogan:"Ba ngày. Nhiều góc nhìn. Một thành phố.",storyTitle:"MỞ là nơi sự sáng tạo bước ra phố.",
  story:"MỞ FESTIVAL là sự kiện văn hóa mô phỏng tại Đà Nẵng, quy tụ các buổi trò chuyện, âm nhạc và hoạt động dành cho cộng đồng sáng tạo.",
  approach:"Tạo cơ hội gặp gỡ trực tiếp giữa ý tưởng, con người và không gian đô thị.",
  navWork:"Chương trình",navServices:"Trải nghiệm",navAbout:"Về MỞ",worksLabel:"Festival program",servicesLabel:"What is happening",aboutLabel:"About the festival",
  contactTitle:"Gặp nhau ở MỞ.",contactIntro:"Đăng ký quan tâm chương trình hoặc gửi đề xuất trở thành đối tác đồng hành.",footerLine:"21—23 NOV / DA NANG / 2026",
  principles:["Tò mò không giới hạn","Kết nối không khoảng cách","Văn hóa của mọi người"],
  services:[{number:"01",title:"Conversations",detail:"Talk và đối thoại mở cùng những người đang thực hành sáng tạo.",outcome:"Panels · Workshops"},{number:"02",title:"Music after dark",detail:"Live set và trải nghiệm âm thanh tại những không gian bất ngờ.",outcome:"Live · Sound"},{number:"03",title:"Creative market",detail:"Sản phẩm độc bản, nghệ thuật và cộng đồng maker địa phương.",outcome:"Art · Market"}]
 },
 "hospitality-booking":{
  slogan:"Mùa nào thức ấy. Bữa nào cũng chậm.",storyTitle:"Một căn bếp mở, dành cho những cuộc gặp gỡ thân tình.",
  story:"MỘC BẾP là không gian ẩm thực Việt theo mùa trong thế giới demo này. Căn bếp ưu tiên nguyên liệu gần, cách nấu giản dị và sự dễ chịu khi cùng ngồi một bàn.",
  approach:"Chọn nguyên liệu theo mùa, giữ trọn hương vị và dành thời gian cho từng vị khách.",
  navWork:"Thực đơn",navServices:"Trải nghiệm",navAbout:"Căn bếp",worksLabel:"From our menu",servicesLabel:"At the table",aboutLabel:"Our kitchen",
  contactTitle:"Dành một chiếc bàn cho cuộc hẹn của bạn.",contactIntro:"Chọn ngày và để lại thông tin liên hệ để thử luồng đặt bàn của website.",footerLine:"Seasonal Vietnamese kitchen / Concept demo",
  principles:["Nguyên liệu theo mùa","Trọn vẹn vị nhà","Chăm chút từng bàn ăn"],
  services:[{number:"01",title:"À la carte",detail:"Món Việt theo mùa, cân bằng giữa ký ức và cách thể hiện hiện đại.",outcome:"Lunch · Dinner"},{number:"02",title:"Private dining",detail:"Một góc riêng tư cho những buổi gặp gỡ đáng nhớ.",outcome:"Groups · Celebrations"},{number:"03",title:"Seasonal tasting",detail:"Thực đơn trải nghiệm thay đổi theo sản vật và cảm hứng của bếp.",outcome:"Tasting · Discovery"}]
 },
 "architecture-studio":{
  slogan:"Không gian sống bắt đầu từ một cuộc đối thoại.",storyTitle:"Chúng tôi tin kiến trúc đẹp nhất là kiến trúc biết lắng nghe.",
  story:"MỘC ARCHITECTURE là studio concept nghiên cứu mối quan hệ giữa con người, ánh sáng và vật liệu. Các công trình được xây dựng trong demo để thể hiện cách kể chuyện bằng không gian.",
  approach:"Lắng nghe nhu cầu, làm rõ bối cảnh, khám phá vật liệu rồi phát triển giải pháp phù hợp.",
  navWork:"Công trình",navServices:"Dịch vụ",navAbout:"Studio",worksLabel:"Selected architecture",servicesLabel:"Practice & expertise",aboutLabel:"Architecture of belonging",
  contactTitle:"Kể cho chúng tôi nghe về không gian của bạn.",contactIntro:"Một dự án tốt bắt đầu từ bối cảnh, những mong muốn và một cuộc gặp gỡ.",footerLine:"Architecture / Interior / Landscape",
  principles:["Ánh sáng dẫn đường","Vật liệu có đời sống","Con người là trung tâm"],
  services:[{number:"01",title:"Kiến trúc nhà ở",detail:"Thiết kế công trình từ tổ chức không gian đến kết nối với cảnh quan.",outcome:"Residential · Concept"},{number:"02",title:"Thiết kế nội thất",detail:"Tỷ lệ, vật liệu và ánh sáng tạo nên trải nghiệm sống có chủ đích.",outcome:"Interior · Detail"},{number:"03",title:"Không gian lưu trú",detail:"Những không gian đón tiếp có tính địa phương và bản sắc riêng.",outcome:"Hospitality · Spatial identity"}]
 },
 "wellness-clinic":{
  slogan:"A softer rhythm for everyday life.",storyTitle:"Lắng nghe cơ thể, trân trọng từng bước nhỏ.",
  story:"AN NHIÊN là không gian wellness giả lập kết hợp chăm sóc cơ thể và vận động nhẹ. Chúng tôi hướng đến trải nghiệm bình tĩnh, dễ hiểu, không hứa hẹn kết quả điều trị.",
  approach:"Hiểu nhu cầu trước, lựa chọn dịch vụ phù hợp và duy trì thói quen chăm sóc có ý thức.",
  navWork:"Liệu trình",navServices:"Dịch vụ",navAbout:"Về chúng tôi",worksLabel:"Explore our rituals",servicesLabel:"Mindful care",aboutLabel:"An Nhiên philosophy",
  contactTitle:"Dành thời gian để chăm sóc chính mình.",contactIntro:"Chọn nhu cầu và thời gian mong muốn để thử mẫu đặt lịch; không có giao dịch hay tư vấn y tế thật.",footerLine:"Mindful movement and restorative care",
  principles:["Dành thời gian lắng nghe","Chăm sóc nhẹ nhàng","Tôn trọng khác biệt"],
  services:[{number:"01",title:"Body rituals",detail:"Các hoạt động thư giãn với nhịp độ nhẹ nhàng, phù hợp thời gian nghỉ ngơi.",outcome:"Rest · Relaxation"},{number:"02",title:"Mindful movement",detail:"Các buổi vận động và tập thở có hướng dẫn.",outcome:"Movement · Breath"},{number:"03",title:"Skin & self-care",detail:"Trải nghiệm chăm sóc cá nhân trong không gian yên tĩnh.",outcome:"Self-care · Rituals"}]
 },
 "property-showcase":{
  slogan:"A considered place to call home.",storyTitle:"Một ngôi nhà không chỉ được đo bằng diện tích.",
  story:"NEST PROPERTY là thương hiệu bất động sản cao cấp giả lập, giới thiệu những không gian có kiến trúc, tiện ích và vị trí đáng cân nhắc.",
  approach:"Đặt trải nghiệm cư trú lên trước, cung cấp thông tin rõ ràng và dẫn dắt quá trình khám phá có chọn lọc.",
  navWork:"Bất động sản",navServices:"Dịch vụ",navAbout:"Về NEST",worksLabel:"Curated residences",servicesLabel:"Our expertise",aboutLabel:"The NEST perspective",
  contactTitle:"Hãy bắt đầu với nơi bạn muốn sống.",contactIntro:"Mô tả loại hình, ngân sách và thời điểm phù hợp để thử đặt lịch tham quan.",footerLine:"Curated homes, thoughtful living",
  principles:["Tuyển chọn có chủ đích","Thông tin minh bạch","Ưu tiên trải nghiệm sống"],
  services:[{number:"01",title:"Property discovery",detail:"Danh sách sản phẩm chọn lọc theo nhu cầu, diện tích và lối sống.",outcome:"Find · Compare"},{number:"02",title:"Private viewings",detail:"Hành trình tham quan rõ ràng và thuận tiện cho người quan tâm.",outcome:"Visit · Explore"},{number:"03",title:"Buyer guidance",detail:"Tổng hợp thông tin cần xem xét trước khi ra quyết định.",outcome:"Context · Guidance"}]
 },
 "education-platform":{
  slogan:"Learn by making. Grow by doing.",storyTitle:"Học để làm được việc, không chỉ để hoàn thành một khóa.",
  story:"MỞ LEARNING là nền tảng giáo dục concept với các lớp học theo dự án. Mỗi chương trình ưu tiên đầu ra cụ thể, thực hành và những phản hồi có ích.",
  approach:"Bắt đầu từ mục tiêu, chia nhỏ kỹ năng, thực hành liên tục và cùng nhìn lại sản phẩm.",
  navWork:"Khóa học",navServices:"Lộ trình",navAbout:"Về MỞ",worksLabel:"Find your course",servicesLabel:"How learning works",aboutLabel:"Our learning philosophy",
  contactTitle:"Một kỹ năng mới bắt đầu từ lựa chọn đầu tiên.",contactIntro:"Để lại thông tin và lĩnh vực muốn học để trải nghiệm luồng tư vấn chương trình.",footerLine:"Learning through making / Concept platform",
  principles:["Học theo dự án","Phản hồi thiết thực","Tiến bộ có lộ trình"],
  services:[{number:"01",title:"Creative foundations",detail:"Nền tảng thiết kế, tư duy thị giác và khả năng trình bày ý tưởng.",outcome:"Design · Craft"},{number:"02",title:"Technology paths",detail:"Lộ trình phát triển web và xây sản phẩm số từ thực tế.",outcome:"Development · Projects"},{number:"03",title:"Portfolio practice",detail:"Biến kiến thức thành sản phẩm có thể trình bày và cải tiến.",outcome:"Mentorship · Showcase"}]
 },
 "pet-store":{"slogan": "Thú cưng là gia đình", "storyTitle": "Một chút niềm vui cho những người bạn bốn chân.", "story": "Poppy chọn đồ chơi, thức ăn và phụ kiện đáng yêu để mỗi ngày cùng thú cưng đều thú vị. Đây là một thương hiệu giả định xây dựng để minh họa trải nghiệm website chuyên biệt cho ngành thú cưng.", "approach": "Thông tin và trải nghiệm được sắp xếp theo quyết định thực tế của khách hàng, không dùng bố cục đại trà.", "navWork": "Bộ sưu tập", "navServices": "Dịch vụ", "navAbout": "Về Poppy", "worksLabel": "Đồ yêu thích của bé", "servicesLabel": "Giải pháp dành riêng", "aboutLabel": "Our story", "contactTitle": "Bắt đầu hành trình cùng Poppy.", "contactIntro": "Liên hệ để nhận tư vấn. Đây là luồng trình diễn, không tạo yêu cầu thật.", "footerLine": "Thú cưng là gia đình", "principles": ["Thiết kế phù hợp ngành", "Trải nghiệm rõ ràng", "Niềm tin và hiệu quả"], "services": [{"number": "01", "title": "Bóng Mềm Poppy", "detail": "Êm, nhẹ và an toàn khi sử dụng", "outcome": "Discover · Explore"}, {"number": "02", "title": "Ổ ngủ Cloudy", "detail": "Vải mềm, dễ vệ sinh", "outcome": "Compare · Consider"}, {"number": "03", "title": "Bát ăn Sunny", "detail": "Gốm chịu lực, màu sắc vui tươi", "outcome": "Connect · Grow"}]},
 "auto-showroom":{"slogan":"PRECISION IN MOTION.","storyTitle":"A STUDY IN PERFORMANCE.","story":"VELAR là một concept showroom giả định do Athena Studio xây dựng. Mô hình McLaren được người dùng cung cấp để minh họa cách kể chuyện bằng hình khối, vật liệu và chuyển động; không đại diện cho xe do VELAR sản xuất hoặc phân phối.","approach":"Trải nghiệm tập trung vào chính mô hình 3D, các góc camera có chủ đích, chi tiết nhìn thấy trong asset và điều hướng rõ ràng. Không sử dụng thông số hoặc tuyên bố bán xe không được xác minh.","navWork":"Design Studies","navServices":"Experience","navAbout":"Về Concept","worksLabel":"THREE DESIGN STUDIES","servicesLabel":"Trải nghiệm showroom giả lập","aboutLabel":"DESIGN PHILOSOPHY","contactTitle":"THE NEXT PERSPECTIVE.","contactIntro":"Biểu mẫu minh họa việc hỏi thông tin về concept. Không có đơn đặt xe hoặc lịch hẹn thực tế.","footerLine":"BLACK VELOCITY / DEMO","principles":["Bề mặt và tỷ lệ","Vật liệu trung thực","Chuyển động có chủ đích"],"services":[{"number":"01","title":"Khám phá 3D","detail":"Xoay, phóng to và chọn góc nhìn để quan sát mô hình McLaren do người dùng cung cấp.","outcome":"Interactive model · Camera study"},{"number":"02","title":"Nghiên cứu vật liệu","detail":"Theo dõi ánh sáng trên graphite, carbon và những bề mặt có trong GLB.","outcome":"Material · Surface"},{"number":"03","title":"Yêu cầu trải nghiệm demo","detail":"Xem giao diện liên hệ mẫu. Dữ liệu không được gửi hoặc tạo lịch hẹn thật.","outcome":"Contact · Simulation"}]},
 "construction-firm":{"slogan": "Build with conviction", "storyTitle": "Chất lượng được kiến tạo từ nền móng.", "story": "Đối tác xây dựng với quy trình thi công rõ ràng, quản lý chất lượng và trách nhiệm trong từng giai đoạn. Đây là một thương hiệu giả định xây dựng để minh họa trải nghiệm website chuyên biệt cho ngành xây dựng.", "approach": "Thông tin và trải nghiệm được sắp xếp theo quyết định thực tế của khách hàng, không dùng bố cục đại trà.", "navWork": "Khám phá", "navServices": "Giải pháp", "navAbout": "Về TERRACON", "worksLabel": "Dự án tiêu biểu", "servicesLabel": "Giải pháp dành riêng", "aboutLabel": "Our story", "contactTitle": "Bắt đầu hành trình cùng TERRACON.", "contactIntro": "Liên hệ để nhận tư vấn. Đây là luồng trình diễn, không tạo yêu cầu thật.", "footerLine": "Build with conviction", "principles": ["Thiết kế phù hợp ngành", "Trải nghiệm rõ ràng", "Niềm tin và hiệu quả"], "services": [{"number": "01", "title": "Công trình Horizon", "detail": "Commercial · 2026", "outcome": "Discover · Explore"}, {"number": "02", "title": "Residence 08", "detail": "Residential · 2025", "outcome": "Compare · Consider"}, {"number": "03", "title": "Industrial Yard", "detail": "Industrial · 2026", "outcome": "Connect · Grow"}]},
};

export function getWorldDetail(slug:string):WorldDetail|undefined{return worldDetails[slug];}
export function getWorldCopy(slug:string,registry:Record<string,DemoCopy>){return registry[slug];}
