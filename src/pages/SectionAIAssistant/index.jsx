import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Send, Sparkles, User, MessageCircle, ClipboardList, Copy, CheckCircle2, PenTool } from "lucide-react";
import faqs from "../../data/faqs.json";
import Fuse from "fuse.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import CustomSelect from "../../components/ui/CustomSelect";

const INITIAL_MESSAGE = {
  id: 1,
  sender: "ai",
  text: "Xin chào! Tôi là Trợ lý AI của dự án Fenica. Tôi nắm rõ toàn bộ thông tin về rổ hàng, giá bán, chính sách và tiến độ dự án. Tôi có thể giúp gì cho bạn hôm nay?",
};

const SUGGESTIONS = [
  "Giá căn hộ 2PN bao nhiêu?",
  "Chính sách thanh toán mới nhất",
  "Pháp lý dự án ra sao?",
  "So sánh Block A và C",
];

const removeVietnameseTones = (str) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  return str.toLowerCase();
};

const STOP_WORDS = [
  "la", "va", "cua", "co", "khong", "nhung", "cac", "thi", "ma", "o", "tai", "ve", "cho", "voi", "duoc", "nay", "do", "nao", "the", "neu", "khi", "ai", "du", "an", "ra", "sao", "nhu"
];

/* Prepare Data for Fuse Fallback */
const indexedFaqs = faqs.map((faq) => ({
  ...faq,
  cleanQuestion: removeVietnameseTones(faq.question),
  cleanAnswer: removeVietnameseTones(faq.answer.replace(/<[^>]+>/g, "")),
}));

const fuse = new Fuse(indexedFaqs, {
  includeScore: true,
  threshold: 0.4,
  ignoreLocation: true,
  useExtendedSearch: true,
  keys: [
    { name: "cleanQuestion", weight: 0.9 },
    { name: "cleanAnswer", weight: 0.1 },
  ],
});

export default function SectionAIAssistant() {
  const [activeTab, setActiveTab] = useState("chat"); // 'chat' or 'script'

  // Chat State
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const contextRef = useRef({ bedroom: null, budget: null });
  const [chatHistory, setChatHistory] = useState([]);

  // Script Generator State
  const [customerInfo, setCustomerInfo] = useState("");
  const [scriptType, setScriptType] = useState("zalo");
  const [generatedScript, setGeneratedScript] = useState("");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Initialize Gemini API
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === "chat") {
      scrollToBottom();
    }
  }, [messages, isTyping, activeTab]);

  const extractEntities = (text) => {
    let bedroom = null;
    let budget = null;
    const bedMatch = text.match(/(\d)\s*(pn|phong ngu|phòng ngủ)/i);
    if (bedMatch) bedroom = bedMatch[1] + "PN";
    const budgetMatch = text.match(/(\d+(?:\.\d+)?)\s*(ty|tỷ|toi)/i);
    if (budgetMatch) budget = budgetMatch[1] + "Tỷ";
    return { bedroom, budget };
  };

  const generateFallbackResponse = (text) => {
    const cleanText = removeVietnameseTones(text).trim();
    if (!cleanText) return "Bạn vui lòng nhập câu hỏi nhé!";

    const greetings = ["chao", "hi", "hello", "alo", "xin chao", "chao ban"];
    if (greetings.some((g) => cleanText.startsWith(g) || cleanText === g)) {
      return "Chào bạn! Tôi có thể giúp gì cho bạn về dự án Fenica hôm nay? Bạn có thể hỏi về giá bán, chính sách, hoặc pháp lý...";
    }

    const entities = extractEntities(cleanText);
    if (entities.bedroom) contextRef.current.bedroom = entities.bedroom;
    if (entities.budget) contextRef.current.budget = entities.budget;

    const currentBedroom = contextRef.current.bedroom;
    const currentBudget = contextRef.current.budget;
    const isSeekingProperty =
      cleanText.includes("tim") ||
      cleanText.includes("mua") ||
      cleanText.includes("can ho") ||
      cleanText.includes("gia") ||
      cleanText.includes("can");

    if (isSeekingProperty && (currentBedroom || currentBudget)) {
      let response = `Dạ, tôi ghi nhận bạn đang tìm căn hộ`;
      if (currentBedroom) response += `**${currentBedroom}**`;
      if (currentBudget) response += `với tài chính khoảng **${currentBudget}**`;
      response += `.\n\n`;
      if (currentBedroom === "1PN" || (currentBudget && parseFloat(currentBudget) <= 2.5)) {
        response += `Phù hợp với tiêu chí của bạn, hiện có căn **A-08.12 (1PN - 48m2)** giá rất tốt (khoảng 2.4 Tỷ), phù hợp đầu tư hoặc người độc thân. Bạn có muốn xem layout chi tiết không?`;
      } else if (currentBedroom === "3PN" || (currentBudget && parseFloat(currentBudget) >= 5)) {
        response += `Rổ hàng VIP 3PN hiện chỉ còn 2 căn góc tuyệt đẹp view Panorama. Mức giá dao động từ 5.5 - 6 Tỷ. Nếu bạn quan tâm, tôi có thể đặt lịch đi xem thực tế.`;
      } else {
        response += `Hệ thống vừa quét rổ hàng và tìm thấy **3 căn góc đẹp nhất** phù hợp với yêu cầu của bạn (nằm ở Block B và C). Bạn muốn nhận báo giá dòng tiền chi tiết qua Zalo hay Email ạ?`;
      }
      return response;
    }

    if (cleanText.includes("so sanh") && (cleanText.includes("block") || cleanText.includes("toa"))) {
      return `Dưới đây là so sánh nhanh giữa **Block A** và **Block C**:\n\n**🏢 Block A (Tháp Nghỉ Dưỡng):**\n- Vị trí: Lõi trung tâm, yên tĩnh.\n- View: Hồ bơi & Công viên.\n- Phù hợp: Khách mua để ở, thích sự tĩnh lặng.\n\n**🏢 Block C (Tháp Thương Mại):**\n- Vị trí: Mặt tiền đường chính.\n- View: Thành phố sầm uất.\n- Phù hợp: Khách hàng trẻ, năng động hoặc đầu tư cho thuê.`;
    }
    if (cleanText.includes("phap ly") || cleanText.includes("so hong")) {
      return `Về **Pháp lý dự án Fenica**:\n- **Người Việt Nam**: Sở hữu lâu dài (Sổ hồng).\n- **Người nước ngoài**: Sở hữu 50 năm (có thể gia hạn).\n- **Hợp đồng**: Khách hàng ký HĐMB khi thanh toán đủ 20%.\n- **Tiến độ pháp lý**: CĐT Phượng Hoàng cam kết pháp lý minh bạch nhất khu vực, dự kiến hoàn tất mọi thủ tục để ra mắt chính thức vào Quý 4/2025.`;
    }

    const searchTokens = cleanText.split("").filter((w) => w.length > 1 && !STOP_WORDS.includes(w));
    const fuseQuery = searchTokens.map((t) => `'${t}`).join("");
    const results = fuse.search(fuseQuery.length > 0 ? fuseQuery : cleanText);

    if (results.length > 0) {
      if (results[0].score < 0.5) {
        const bestMatch = results[0].item;
        const answerText = bestMatch.answer.replace(/<[^>]+>/g, "").replace(/\s+/g, "").trim();
        return `Theo thông tin từ CĐT:\n\n**${bestMatch.question}**\n${answerText}`;
      }
    }

    return "Xin lỗi, câu hỏi này hiện chưa có thông tin chính thức trong dữ liệu của CĐT. Tuy nhiên, tôi vẫn đang học hỏi thêm mỗi ngày. Bạn có thể diễn đạt lại câu hỏi rõ hơn, hoặc để lại Số Điện Thoại để chuyên viên gọi tư vấn nhé!";
  };

  const generateGeminiResponse = async (userText) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const knowledgeBase = faqs.map((f) => `Q: ${f.question}\nA: ${f.answer.replace(/<[^>]+>/g, "")}`).join("\n\n");

      const systemInstruction = `Bạn là Trợ lý AI chính thức của dự án bất động sản Fenica.
Nhiệm vụ của bạn là tư vấn cho khách hàng mua căn hộ một cách lịch sự, nhiệt tình và thuyết phục.
Luôn ưu tiên sử dụng thông tin từ CƠ SỞ DỮ LIỆU DỰ ÁN dưới đây để trả lời.
Nếu khách hàng hỏi thông tin không có trong cơ sở dữ liệu, hãy xin phép ghi nhận và nói sẽ báo chuyên viên kinh doanh liên hệ lại.
Tuyệt đối không bịa đặt giá bán hoặc chính sách không có thật. Trả lời ngắn gọn, súc tích, định dạng markdown rõ ràng (dùng in đậm cho số liệu/tên block).

CƠ SỞ DỮ LIỆU DỰ ÁN FENICA:
${knowledgeBase}

Dữ liệu đặc biệt:
- Block A: Tháp nghỉ dưỡng yên tĩnh, view hồ bơi/công viên.
- Block B/C: Tháp thương mại mặt tiền, view thành phố sôi động.
- Giá tham khảo: 1PN (48m2) ~2.4 Tỷ. 3PN Góc VIP ~5.5-6 Tỷ.`;

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: systemInstruction }] },
          { role: "model", parts: [{ text: "Đã rõ, tôi sẽ đóng vai Trợ lý ảo Fenica chuyên nghiệp và dựa vào dữ liệu được cung cấp." }] },
          ...chatHistory,
        ],
      });

      const result = await chat.sendMessage(userText);
      const text = result.response.text();

      setChatHistory((prev) => [
        ...prev,
        { role: "user", parts: [{ text: userText }] },
        { role: "model", parts: [{ text: text }] },
      ]);

      return text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return generateFallbackResponse(userText);
    }
  };

  const handleSend = async (e, overrideText = null) => {
    if (e) e.preventDefault();
    const textToSend = overrideText || inputText;
    if (!textToSend.trim()) return;

    const newUserMsg = { id: Date.now(), sender: "user", text: textToSend };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText("");
    setIsTyping(true);

    if (genAI) {
      const responseText = await generateGeminiResponse(newUserMsg.text);
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: responseText }]);
      setIsTyping(false);
    } else {
      setTimeout(() => {
        const responseText = generateFallbackResponse(newUserMsg.text);
        setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: responseText }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const renderFormattedText = (text) => {
    const parts = text.split(/(\**.*?\**)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const generateSalesScript = async () => {
    if (!customerInfo.trim()) return;
    if (!genAI) {
      alert("Tính năng này yêu cầu Gemini API Key để hoạt động. Vui lòng cấu hình API Key trong file .env");
      return;
    }
    
    setIsGeneratingScript(true);
    setGeneratedScript("");
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const formatStr = scriptType === 'zalo' 
        ? 'tin nhắn Zalo ngắn gọn, chân thành, dùng icon hợp lý' 
        : scriptType === 'phone' 
          ? 'kịch bản gọi điện thoại telesale mạch lạc, có xử lý từ chối' 
          : 'email chào hàng trang trọng, chuyên nghiệp, cấu trúc rõ ràng';

      const prompt = `Bạn là một siêu Cò Bất Động Sản (Chuyên gia chốt sale) xuất sắc nhất khu vực, đang bán căn hộ cao cấp dự án Fenica.
Tôi có một khách hàng với thông tin sau: "${customerInfo}".

Nhiệm vụ của bạn: Hãy viết một kịch bản chốt sale dạng ${formatStr} để tôi gửi/nói với khách hàng này.
Yêu cầu bắt buộc:
- Tuyệt đối khéo léo, thấu hiểu tâm lý, không dùng từ ngữ quá "sale-y" hay chèo kéo thô thiển.
- Nhấn mạnh vào đúng nhu cầu hoặc giải quyết nỗi lo sợ (pain point) của khách hàng từ thông tin tôi cung cấp.
- Tập trung vào sự khan hiếm, đẳng cấp hoặc giá trị đầu tư của dự án Fenica (Block A nghỉ dưỡng, Block B/C thương mại).
- Có một lời kêu gọi hành động (Call to Action) thật tự nhiên (ví dụ: mời đi xem sa bàn, mời nhận báo giá, mời chốt cọc).
- Không tự bịa ra chính sách giảm giá hoặc quà tặng nếu không có thật.
- Định dạng kết quả dễ đọc (markdown). Không tự giới thiệu bản thân là AI.`;

      const result = await model.generateContent(prompt);
      setGeneratedScript(result.response.text());
    } catch (error) {
      console.error("Gemini API Error:", error);
      setGeneratedScript("Xin lỗi, hệ thống AI đang bận hoặc cấu hình API Key chưa chính xác. Vui lòng thử lại sau.");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleCopy = () => {
    if (!generatedScript) return;
    navigator.clipboard.writeText(generatedScript);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full bg-white shadow-2xl shadow-primary/10 border border-slate-100 flex flex-col h-screen overflow-hidden">
        
        {/* HEADER & TABS */}
        <div className="bg-slate-900 shrink-0">
          <div className="h-20 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-tr from-primary to-emerald-400 p-0.5 shadow-lg shadow-primary/20">
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                  <Bot size={24} />
                </div>
              </div>
              <div>
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                  Fenica AI <Sparkles size={16} className="text-amber-400" />
                </h2>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                  <span className="w-2 h-2 bg-emerald-500 animate-pulse"></span>
                  {genAI ? "Trợ lý ảo thông minh (Gemini AI)" : "Trợ lý ảo tiêu chuẩn (NLP)"}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex border-t border-slate-800">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-3 font-bold text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'bg-primary text-slate-900' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <MessageCircle size={16}/> Hỏi Đáp Khách Hàng
            </button>
            <button 
              onClick={() => setActiveTab('script')}
              className={`flex-1 py-3 font-bold text-sm transition-colors flex items-center justify-center gap-2 ${activeTab === 'script' ? 'bg-primary text-slate-900' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <PenTool size={16}/> Sinh Kịch Bản Chốt Sale
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        {activeTab === 'chat' ? (
          <>
            {/* CHAT AREA */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-4 lg:gap-6" style={{ scrollbarWidth: "thin" }}>
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-4 max-w-[85%] ${msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"}`}
                  >
                    <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${msg.sender === "user" ? "bg-slate-100 text-slate-400" : "bg-primary/10 text-primary"}`}>
                      {msg.sender === "user" ? <User size={20} /> : <Bot size={20} />}
                    </div>
                    <div className={`px-5 py-4 text-base leading-relaxed ${msg.sender === "user" ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" : "bg-slate-50 border border-slate-100 text-slate-600 shadow-sm"}`}>
                      {msg.text.split("\n").map((line, i) => (
                        <div key={i} className={i > 0 ? "mt-2" : ""}>
                          {msg.sender === "user" ? line : renderFormattedText(line)}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {/* TYPING INDICATOR */}
                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="flex gap-4 self-start max-w-[85%]">
                    <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                      <Bot size={20} />
                    </div>
                    <div className="px-5 py-4 bg-slate-50 border border-slate-100 flex items-center gap-1.5 h-14">
                      <motion.div className="w-2 h-2 bg-slate-400" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                      <motion.div className="w-2 h-2 bg-slate-400" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                      <motion.div className="w-2 h-2 bg-slate-400" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* QUICK SUGGESTIONS */}
            <div className="px-6 pb-2 overflow-x-auto flex gap-2 no-scrollbar" style={{ scrollbarWidth: "none" }}>
              {SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(null, sug)}
                  disabled={isTyping}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-sm font-bold whitespace-nowrap hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all flex items-center gap-2"
                >
                  <MessageCircle size={14} /> {sug}
                </button>
              ))}
            </div>

            {/* INPUT AREA */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={(e) => handleSend(e)} className="relative flex items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={genAI ? "Hỏi Trợ lý Fenica AI bất cứ điều gì..." : "Hỏi AI về rổ hàng, giá bán, so sánh block..."}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 py-4 pl-6 pr-16 outline-none focus:border-primary focus:bg-white transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="absolute right-2 w-10 h-10 bg-primary text-white flex items-center justify-center hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary/30"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </form>
            </div>
          </>
        ) : (
          /* SCRIPT GENERATOR AREA */
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col md:flex-row gap-6 bg-slate-50/50">
            {/* Input Form */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-white p-5 border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-900 mb-4 text-lg flex items-center gap-2">
                  <ClipboardList className="text-primary"/> Thông tin khách hàng
                </h3>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Tình trạng / Chân dung khách hàng *</label>
                    <textarea 
                      value={customerInfo}
                      onChange={(e) => setCustomerInfo(e.target.value)}
                      placeholder="VD: Khách hàng 45 tuổi, đang phân vân về giá, thích mua để đầu tư lướt sóng..."
                      className="w-full h-32 bg-slate-50 border border-slate-200 p-4 outline-none focus:border-primary focus:bg-white resize-none"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block">Định dạng kịch bản</label>
                    <CustomSelect 
                      value={scriptType} 
                      onChange={setScriptType} 
                      options={[
                        { value: 'zalo', label: 'Tin nhắn Zalo' },
                        { value: 'phone', label: 'Kịch bản Gọi điện' },
                        { value: 'email', label: 'Email chào hàng' }
                      ]} 
                    />
                  </div>
                  
                  <button 
                    onClick={generateSalesScript}
                    disabled={isGeneratingScript || !customerInfo.trim()}
                    className="w-full py-4 mt-2 bg-slate-900 text-white font-bold hover:bg-primary hover:text-slate-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
                  >
                    {isGeneratingScript ? (
                      <span className="flex items-center gap-2"><Sparkles className="animate-pulse"/> Đang phân tích tâm lý & Sinh kịch bản...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Sparkles /> Sinh Kịch Bản Chốt Sale</span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Output Result */}
            <div className="flex-1 flex flex-col">
              <div className="bg-white p-5 border border-slate-200 shadow-sm flex-1 flex flex-col relative">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-slate-900 text-lg">Kết quả Kịch Bản</h3>
                  {generatedScript && (
                    <button 
                      onClick={handleCopy}
                      className="px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 border border-slate-200 hover:bg-slate-100 transition-colors text-slate-600"
                    >
                      {isCopied ? <><CheckCircle2 size={14} className="text-emerald-500"/> Đã sao chép</> : <><Copy size={14}/> Sao chép</>}
                    </button>
                  )}
                </div>
                
                <div className="flex-1 bg-slate-50 border border-slate-100 p-5 overflow-y-auto text-slate-700 leading-relaxed whitespace-pre-wrap min-h-[300px]">
                  {generatedScript ? (
                    generatedScript
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                      <Bot size={48} className="mb-4"/>
                      <p>Nhập thông tin khách hàng để AI giúp bạn chốt sale.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
