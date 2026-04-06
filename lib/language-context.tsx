"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Language = "en" | "vi";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  "nav.services": { en: "Services", vi: "Dịch vụ" },
  "nav.useCases": { en: "Use Cases", vi: "Ứng dụng" },
  "nav.whyUs": { en: "Why Us", vi: "Tại sao chọn chúng tôi" },
  "nav.aboutUs": { en: "About Us", vi: "Về chúng tôi" },
  "nav.contact": { en: "Contact", vi: "Liên hệ" },
  "nav.contactNow": { en: "Contact Now", vi: "Liên hệ ngay" },

  // Hero
  "hero.eyebrow": { en: "AI Solutions for Enterprises", vi: "Giải pháp AI cho doanh nghiệp" },
  "hero.headline1": { en: "Optimize Your", vi: "Tối Ưu Hóa" },
  "hero.headline2": { en: "Business Workflows ", vi: "Quy Trình Doanh Nghiệp " },
  "hero.headline3": { en: "With AI", vi: "Bằng AI" },
  "hero.description": {
    en: "Gaussora provides groundbreaking AI solutions and products, uniquely designed to solve core business challenges for enterprises.",
    vi: "Gaussora chuyên cung cấp các giải pháp và sản phẩm Trí tuệ Nhân tạo đột phá, thiết kế riêng biệt để giải quyết bài toán cốt lõi của doanh nghiệp.",
  },
  "hero.name": { en: "Name", vi: "Tên" },
  "hero.email": { en: "Email", vi: "Email" },
  "hero.company": { en: "Company Name", vi: "Tên Doanh Nghiệp" },
  "hero.submit": { en: "Submit", vi: "Gửi thông tin" },
  "hero.submitted": { en: "Thank you! We'll contact you soon.", vi: "Đã ghi nhận thông tin. Chúng tôi sẽ liên hệ bạn sớm nhất!" },

  // Features
  "features.eyebrow": { en: "Core Services", vi: "Dịch vụ chính" },
  "features.title1": { en: "Complete AI Solutions.", vi: "Giải pháp AI hoàn chỉnh." },
  "features.title2": { en: "For every business need.", vi: "Cho mọi nhu cầu doanh nghiệp." },
  "features.f1.title": { en: "Business Process Automation", vi: "Tự động hóa quy trình nghiệp vụ" },
  "features.f1.desc": {
    en: "AI Automation — Automate complex business processes, reduce processing time and increase operational efficiency for enterprises.",
    vi: "AI Automation — Tự động hóa các quy trình kinh doanh phức tạp, giảm thời gian xử lý và tăng hiệu suất hoạt động cho doanh nghiệp.",
  },
  "features.f2.title": { en: "Data Discovery & Visualization", vi: "Khai phá và trực quan hóa dữ liệu" },
  "features.f2.desc": {
    en: "Data Intelligence — Deep data analysis, uncovering trends and new business opportunities from your data.",
    vi: "Data Intelligence — Phân tích dữ liệu sâu sắc, tìm ra các xu hướng và cơ hội kinh doanh mới từ dữ liệu của bạn.",
  },
  "features.f3.title": { en: "Build Your Own AI Assistant", vi: "Xây dựng trợ lý AI riêng" },
  "features.f3.desc": {
    en: "Custom AI Agent/LLM — Create personalized language models and AI assistants tailored to your specific business needs.",
    vi: "Custom AI Agent/LLM — Tạo các mô hình ngôn ngữ và trợ lý AI được cá nhân hóa phù hợp với nhu cầu cụ thể của doanh nghiệp.",
  },

  // Use Cases
  "useCases.eyebrow": { en: "Real-World Applications", vi: "Ứng dụng thực tế" },
  "useCases.title1": { en: "Solutions for every", vi: "Giải pháp cho mọi" },
  "useCases.title2": { en: "business challenge.", vi: "bài toán doanh nghiệp." },
  "useCases.uc1.title": { en: "AI-Powered Contract Analysis", vi: "AI tự động phân tích hợp đồng" },
  "useCases.uc1.desc": {
    en: "Automatically extract, classify and assess risks from thousands of contracts in minutes. Minimize errors and save hundreds of hours of manual work.",
    vi: "Tự động trích xuất, phân loại và đánh giá rủi ro từ hàng nghìn hợp đồng trong vài phút. Giảm thiểu sai sót và tiết kiệm hàng trăm giờ làm việc thủ công.",
  },
  "useCases.uc2.title": { en: "Market Forecasting", vi: "Dự báo thị trường" },
  "useCases.uc2.desc": {
    en: "Analyze historical data and market trends to deliver accurate forecasts. Support strategic decision-making based on data.",
    vi: "Phân tích dữ liệu lịch sử và xu hướng thị trường để đưa ra các dự báo chính xác. Hỗ trợ ra quyết định chiến lược dựa trên dữ liệu.",
  },
  "useCases.uc3.title": { en: "Market Analysis & Marketing Support", vi: "Phân tích thị trường & hỗ trợ marketing" },
  "useCases.uc3.desc": {
    en: "Deeply understand customer behavior, segment markets and optimize marketing campaigns with AI. Increase ROI and reach effectively.",
    vi: "Hiểu sâu hành vi khách hàng, phân khúc thị trường và tối ưu hóa chiến dịch marketing với AI. Tăng ROI và reach hiệu quả.",
  },

  // Why Choose Us
  "whyUs.eyebrow": { en: "Why Choose Us", vi: "Tại sao chọn chúng tôi" },
  "whyUs.title1": { en: "A Trusted", vi: "Đối tác AI" },
  "whyUs.title2": { en: "AI Partner.", vi: "đáng tin cậy." },
  "whyUs.description": {
    en: "Gaussora doesn't just deliver technology — we accompany your business on the digital transformation journey with AI.",
    vi: "Gaussora không chỉ cung cấp công nghệ — chúng tôi đồng hành cùng doanh nghiệp trên hành trình chuyển đổi số với AI.",
  },
  "whyUs.r1.title": { en: "Customer-Focused Approach", vi: "Bám sát nhu cầu khách hàng" },
  "whyUs.r1.desc": {
    en: "We listen and thoroughly analyze your challenges before proposing solutions. Every product is uniquely designed to fit your specific business context and goals.",
    vi: "Chúng tôi lắng nghe và phân tích kỹ lưỡng bài toán của bạn trước khi đề xuất giải pháp. Mỗi sản phẩm đều được thiết kế riêng biệt, phù hợp với ngữ cảnh và mục tiêu kinh doanh cụ thể.",
  },
  "whyUs.r2.title": { en: "Rigorous Deployment Process", vi: "Quy trình triển khai chặt chẽ" },
  "whyUs.r2.desc": {
    en: "From survey, analysis to deployment and handover — every step is executed systematically, ensuring committed quality and timeline.",
    vi: "Từ khảo sát, phân tích đến triển khai và bàn giao — mọi bước đều được thực hiện có hệ thống, đảm bảo chất lượng và tiến độ cam kết.",
  },
  "whyUs.r3.title": { en: "Cost Optimization", vi: "Tối ưu chi phí" },
  "whyUs.r3.desc": {
    en: "Our AI solutions help businesses reduce operational costs, increase productivity and create sustainable long-term value.",
    vi: "Giải pháp AI của chúng tôi giúp doanh nghiệp giảm chi phí vận hành, tăng năng suất và tạo ra giá trị bền vững trong dài hạn.",
  },

  // About Us
  "aboutUs.eyebrow": { en: "About Us", vi: "Về chúng tôi" },
  "aboutUs.title1": { en: "Building practical AI", vi: "Xây dựng AI ứng dụng" },
  "aboutUs.title2": { en: "for real business impact.", vi: "cho tác động kinh doanh thực tế." },
  "aboutUs.description": {
    en: "We combine deep AI expertise, strong product thinking and a disciplined delivery process to help enterprises deploy AI with measurable outcomes.",
    vi: "Chúng tôi kết hợp năng lực AI chuyên sâu, tư duy sản phẩm và quy trình triển khai kỷ luật để giúp doanh nghiệp ứng dụng AI với kết quả đo lường được.",
  },
  "aboutUs.p1.title": { en: "Who We Are", vi: "Chúng tôi là ai" },
  "aboutUs.p1.desc": {
    en: "A multidisciplinary team of AI engineers, data scientists and consultants focused on solving mission-critical enterprise workflows.",
    vi: "Đội ngũ liên ngành gồm kỹ sư AI, chuyên gia dữ liệu và tư vấn giải pháp, tập trung vào các quy trình trọng yếu của doanh nghiệp.",
  },
  "aboutUs.p2.title": { en: "Our Mission", vi: "Sứ mệnh của chúng tôi" },
  "aboutUs.p2.desc": {
    en: "Turn complex data and operations into clear decisions, faster execution and sustainable competitive advantage.",
    vi: "Chuyển dữ liệu và vận hành phức tạp thành quyết định rõ ràng, thực thi nhanh hơn và lợi thế cạnh tranh bền vững.",
  },
  "aboutUs.p3.title": { en: "How We Work", vi: "Cách chúng tôi triển khai" },
  "aboutUs.p3.desc": {
    en: "From discovery to rollout, we co-design with your teams, validate with pilots and scale safely across your organization.",
    vi: "Từ khảo sát đến vận hành, chúng tôi đồng thiết kế cùng đội ngũ của bạn, kiểm chứng bằng pilot và mở rộng an toàn trong toàn tổ chức.",
  },

  // Contact
  "contact.title1": { en: "Get in touch", vi: "Liên hệ" },
  "contact.title2": { en: "with us.", vi: "với chúng tôi." },
  "contact.description": {
    en: "Leave your information and our Gaussora team will consult the most suitable AI solution for your business.",
    vi: "Hãy để lại thông tin để đội ngũ Gaussora tư vấn giải pháp AI phù hợp nhất cho doanh nghiệp của bạn.",
  },
  "contact.name": { en: "Your name", vi: "Tên của bạn" },
  "contact.email": { en: "Email", vi: "Email" },
  "contact.company": { en: "Company Name", vi: "Tên Doanh Nghiệp" },
  "contact.message": { en: "Brief description of your needs (optional)", vi: "Mô tả ngắn về nhu cầu của bạn (tùy chọn)" },
  "contact.submit": { en: "Submit", vi: "Gửi thông tin" },
  "contact.submitted": { en: "Sent successfully! ✓", vi: "Đã gửi thành công! ✓" },
  "contact.directEmail": { en: "Or email directly:", vi: "Hoặc email trực tiếp:" },

  // Footer
  "footer.description": {
    en: "Gaussora provides groundbreaking AI solutions for enterprises.",
    vi: "Gaussora chuyên cung cấp các giải pháp AI đột phá cho doanh nghiệp.",
  },
  "footer.services": { en: "Services", vi: "Dịch vụ" },
  "footer.useCases": { en: "Use Cases", vi: "Ứng dụng" },
  "footer.company": { en: "Company", vi: "Công ty" },
  "footer.aboutUs": { en: "About Us", vi: "Về chúng tôi" },
  "footer.contact": { en: "Contact", vi: "Liên hệ" },
  "footer.contractAnalysis": { en: "Contract Analysis", vi: "Phân tích hợp đồng" },
  "footer.marketForecast": { en: "Market Forecasting", vi: "Dự báo thị trường" },
  "footer.marketingSupport": { en: "Marketing Support", vi: "Hỗ trợ Marketing" },
  "footer.rights": { en: "2025 Gaussora. All rights reserved.", vi: "2025 Gaussora. All rights reserved." },
  "footer.systemStatus": { en: "All systems operational", vi: "Tất cả hệ thống hoạt động bình thường" },

  // Metadata
  "meta.title": { en: "Gaussora - AI Solutions for Enterprises", vi: "Gaussora - Giải pháp AI cho doanh nghiệp" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLang = localStorage.getItem("language") as Language | null;
    if (storedLang && (storedLang === "en" || storedLang === "vi")) {
      setLang(storedLang);
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("language", newLang);
  };

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
