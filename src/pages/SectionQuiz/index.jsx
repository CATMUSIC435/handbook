import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpenCheck,
  RotateCcw,
  Trophy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  ChevronLeft,
  Building,
  Scale,
  Briefcase,
  Timer,
  Send,
  ListOrdered,
  EyeOff
} from "lucide-react";
import quizTopics from "../../data/quiz.json";

const iconMap = {
  Building,
  Scale,
  Briefcase
};

export default function SectionQuiz() {
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Anti-cheat states
  const [cheatCount, setCheatCount] = useState(0);
  const [showCheatModal, setShowCheatModal] = useState(false);

  // Lấy chủ đề hiện tại
  const currentTopic = quizTopics.find(t => t.topicId === selectedTopicId);
  const quizData = currentTopic ? currentTopic.questions : [];

  // Countdown timer logic
  useEffect(() => {
    let timer;
    if (hasStarted && !isFinished && timeLeft > 0 && !showCheatModal) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (hasStarted && !isFinished && timeLeft === 0) {
      handleSubmit(); // Tự động nộp bài khi hết giờ
    }
    return () => clearInterval(timer);
  }, [hasStarted, isFinished, timeLeft, showCheatModal]);

  // Anti-Cheat: Chống reload / đóng tab
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasStarted && !isFinished) {
        e.preventDefault();
        e.returnValue = "Bạn đang làm bài, dữ liệu sẽ không được lưu nếu bạn rời đi!";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasStarted, isFinished]);

  // Anti-Cheat: Phát hiện chuyển tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && hasStarted && !isFinished) {
        setCheatCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            // Gian lận 3 lần -> Nộp bài luôn
            handleSubmit();
          } else {
            // Hiện modal cảnh báo
            setShowCheatModal(true);
          }
          return newCount;
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [hasStarted, isFinished]);

  const handleSelectTopic = (topicId) => {
    setSelectedTopicId(topicId);
    setHasStarted(false);
    setAnswers({});
    setIsFinished(false);
    setIsReviewing(false);
    setCheatCount(0);
    setShowCheatModal(false);
  };

  const handleStartQuiz = () => {
    setHasStarted(true);
    setTimeLeft(quizData.length * 60); // 1 phút mỗi câu
  };

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (isFinished || isReviewing || showCheatModal) return;
    setAnswers({ ...answers, [questionIndex]: optionIndex });
  };

  const handleSubmit = () => {
    setIsFinished(true);
    setShowCheatModal(false);
  };

  const handleRestart = () => {
    setHasStarted(false);
    setAnswers({});
    setIsFinished(false);
    setIsReviewing(false);
    setTimeLeft(0);
    setCheatCount(0);
    setShowCheatModal(false);
  };

  const handleBackToTopics = () => {
    if (hasStarted && !isFinished) {
      const confirmLeave = window.confirm("Bạn đang làm bài thi. Nếu rời khỏi, kết quả sẽ không được lưu. Bạn có chắc chắn muốn thoát?");
      if (!confirmLeave) return;
    }
    setSelectedTopicId(null);
    setHasStarted(false);
    setAnswers({});
    setIsFinished(false);
    setIsReviewing(false);
    setTimeLeft(0);
    setCheatCount(0);
    setShowCheatModal(false);
  };

  const calculateScore = () => {
    let score = 0;
    quizData.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m.toString().padStart(2, '0') + ":" + s.toString().padStart(2, '0');
  };

  const scrollToQuestion = (index) => {
    const el = document.getElementById("question-" + index);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // --- MODAL CẢNH BÁO GIAN LẬN ---
  const renderCheatModal = () => {
    if (!showCheatModal) return null;
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          className="bg-white  p-8 max-w-md w-full text-center shadow-2xl"
        >
          <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <EyeOff size={48} />
          </div>
          <h2 className="text-2xl font-black text-rose-600 mb-2 uppercase">Cảnh báo gian lận!</h2>
          <p className="text-slate-600 text-lg mb-6 font-medium">
            Phát hiện bạn vừa chuyển sang ứng dụng hoặc tab khác. Đây là hành vi không hợp lệ trong lúc thi.
          </p>
          <div className="bg-rose-50 text-rose-800 font-bold p-4  mb-8 border border-rose-200">
            Vi phạm lần: {cheatCount} / 3 <br/>
            <span className="text-sm font-normal">(Nếu vi phạm 3 lần sẽ tự động thu bài)</span>
          </div>
          <button
            onClick={() => setShowCheatModal(false)}
            className="w-full py-4  bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/30"
          >
            Tôi đã hiểu, Quay lại làm bài
          </button>
        </motion.div>
      </div>
    );
  };


  // --- TOPIC SELECTION SCREEN ---
  if (!selectedTopicId) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 rounded-full">
              <BookOpenCheck size={32} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4">Trắc Nghiệm Kiến Thức</h1>
            <p className="text-slate-500 text-lg">Chọn một chủ đề bên dưới để bắt đầu bài thi tính thời gian</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizTopics.map((topic) => {
              const Icon = iconMap[topic.icon] || BookOpenCheck;
              return (
                <motion.div
                  key={topic.topicId}
                  whileHover={{ y: -5 }}
                  onClick={() => handleSelectTopic(topic.topicId)}
                  className="bg-white  p-6 shadow-lg shadow-slate-200/50 border border-slate-100 cursor-pointer hover:border-primary/30 transition-all flex flex-col h-full"
                >
                  <div className={"w-14 h-14 " + topic.color + " text-white  flex items-center justify-center mb-6 shadow-md"}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{topic.topicName}</h3>
                  <p className="text-slate-500 text-sm mb-6 flex-grow leading-relaxed">{topic.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{topic.questions.length} CÂU / {topic.questions.length} PHÚT</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- WELCOME SCREEN ---
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative">
        <button 
          onClick={handleBackToTopics}
          className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-semibold bg-white px-4 py-2 rounded-full shadow-sm"
        >
          <ChevronLeft size={20} /> Chủ đề khác
        </button>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 max-w-lg w-full text-center shadow-xl shadow-slate-200/50 border border-slate-100 "
        >
          <div className="w-20 h-20 bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 ">
            <Timer size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            {currentTopic.topicName}
          </h2>
          <div className="bg-slate-100  p-4 inline-block mb-6">
            <div className="text-slate-500 text-sm font-medium">Thời gian làm bài</div>
            <div className="text-3xl font-black text-slate-800">{quizData.length} Phút</div>
          </div>
          <p className="text-slate-500 mb-4 leading-relaxed px-4">
            Bài kiểm tra gồm {quizData.length} câu hỏi. Tất cả câu hỏi sẽ hiển thị cùng lúc. Hệ thống sẽ tự động nộp bài khi hết thời gian.
          </p>
          <div className="bg-rose-50 border border-rose-100  p-4 mb-8 text-rose-600 text-sm font-bold flex items-start gap-2 text-left">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p>Lưu ý: Không tải lại trang hoặc chuyển sang tab khác trong quá trình thi. Hệ thống sẽ bắt lỗi gian lận tự động thu bài nếu vi phạm 3 lần.</p>
          </div>
          <button
            onClick={handleStartQuiz}
            className="w-full py-4  bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
          >
            <Play size={20} /> Bắt Đầu Tính Giờ
          </button>
        </motion.div>
      </div>
    );
  }

  // --- RESULTS SCREEN ---
  if (isFinished && !isReviewing) {
    const score = calculateScore();
    const percentage = Math.round((score / quizData.length) * 100);
    let message = "Xuất sắc!";
    if (cheatCount >= 3) message = "Hủy bài thi do vi phạm quy chế quá 3 lần!";
    else if (percentage < 50) message = "Cần cố gắng ôn tập thêm!";
    else if (percentage < 80) message = "Khá tốt, nhưng vẫn có thể làm tốt hơn!";

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8  max-w-md w-full text-center shadow-xl shadow-slate-200/50 border border-slate-100 my-8"
        >
          {cheatCount >= 3 ? (
            <div className="w-24 h-24 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <EyeOff size={48} />
            </div>
          ) : (
            <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy size={48} />
            </div>
          )}
          
          <h2 className={"text-3xl font-black mb-2 " + (cheatCount >= 3 ? "text-rose-600" : "text-slate-900")}>
            {cheatCount >= 3 ? "Bị Đình Chỉ!" : "Hoàn Thành!"}
          </h2>
          <p className="text-slate-500 font-medium mb-6">{message}</p>

          <div className="text-6xl font-black text-primary mb-2">
            {score}
            <span className="text-3xl text-slate-300">/{quizData.length}</span>
          </div>
          <p className="text-slate-400 text-sm mb-8">
            câu trả lời chính xác ({percentage}%)
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setIsReviewing(true)}
              className="w-full py-4  bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <AlertCircle size={20} /> Xem lại đáp án
            </button>
            <button
              onClick={handleRestart}
              className="w-full py-4  bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} /> Làm lại chủ đề này
            </button>
            <button
              onClick={handleBackToTopics}
              className="w-full py-4 mt-2 text-primary font-bold hover:bg-primary/5  transition-all flex items-center justify-center gap-2"
            >
              Chọn chủ đề khác
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const isTimeWarning = timeLeft < 60; // Dưới 1 phút cảnh báo màu đỏ

  // Render bảng điều hướng câu hỏi (Navigation Palette)
  const renderQuestionGrid = () => (
    <div className="bg-white p-6  shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 text-slate-700 font-bold mb-4">
        <ListOrdered size={20} className="text-primary" />
        <span>Danh sách câu hỏi</span>
      </div>
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {quizData.map((_, idx) => {
          const hasAnswered = answers[idx] !== undefined;
          let btnClass = "w-10 h-10 sm:w-12 sm:h-12  text-sm sm:text-base font-bold transition-all flex items-center justify-center ";
          
          if (isReviewing) {
            const isCorrect = answers[idx] === quizData[idx].correctAnswer;
            btnClass += (isCorrect ? "bg-emerald-100 text-emerald-700 border border-emerald-300" : "bg-rose-100 text-rose-700 border border-rose-300");
          } else {
            btnClass += (hasAnswered ? "bg-primary text-white shadow-md shadow-primary/30" : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200");
          }

          return (
            <button
              key={idx}
              onClick={() => scrollToQuestion(idx)}
              className={btnClass}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
      {!isReviewing && (
        <div className="mt-6 flex flex-col gap-2 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Đã trả lời:</span>
            <span className="font-bold text-primary">{answeredCount}/{quizData.length}</span>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full mt-2 py-4  bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
          >
            Nộp bài ngay <Send size={18} />
          </button>
        </div>
      )}
    </div>
  );

  // --- REVIEW & QUIZ SCREEN ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-32">
      {renderCheatModal()}
      
      {/* Sticky Header with Timer */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBackToTopics}
              className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-primary transition-colors flex items-center justify-center"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-bold text-slate-700 hidden sm:block">
              {currentTopic.topicName} {isReviewing ? "- Xem lại" : ""}
            </span>
          </div>
          
          {!isReviewing ? (
            <div className="flex flex-col items-center">
              <div className={"flex items-center gap-2 font-black text-xl sm:text-2xl " + (isTimeWarning ? "text-rose-500 animate-pulse" : "text-slate-800")}>
                <Timer size={24} className={isTimeWarning ? "text-rose-500" : "text-primary"} />
                {formatTime(timeLeft)}
              </div>
            </div>
          ) : (
            <button
              onClick={handleRestart}
              className="px-4 py-2 bg-white text-slate-700 font-bold hover:bg-slate-100 rounded-full border border-slate-200 shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              <RotateCcw size={16} /> Làm lại
            </button>
          )}

          {!isReviewing ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary text-white font-bold rounded-full hover:bg-primary/90 shadow-md flex lg:hidden items-center gap-2 text-sm"
            >
              Nộp <Send size={14} />
            </button>
          ) : <div className="w-10"></div>}
        </div>
        
        {/* Progress bar below header */}
        {!isReviewing && (
          <div className="w-full max-w-7xl mx-auto mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: (answeredCount / quizData.length * 100) + '%' }}
            />
          </div>
        )}
      </div>

      {/* Main Content Area - 2 Columns on Desktop */}
      <div className={"max-w-7xl mx-auto w-full p-4 sm:p-6 mt-4 flex flex-col lg:flex-row gap-6 items-start " + (showCheatModal ? "blur-md pointer-events-none" : "")}>
        
        {/* Left Column: Questions List */}
        <div className="flex-1 w-full flex flex-col gap-6 sm:gap-8">
          {quizData.map((q, qIndex) => {
            const selected = answers[qIndex];
            let isCorrect = false;
            if (isReviewing) {
               isCorrect = selected === q.correctAnswer;
            }

            return (
              <div key={qIndex} className={"bg-white p-4 md:p-6 lg:p-8  shadow-sm border " + (isReviewing ? (isCorrect ? "border-emerald-200" : "border-rose-200") : "border-slate-200")} id={"question-" + qIndex}>
                <div className="flex items-start gap-3 sm:gap-4 mb-6">
                  <div className={"w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full flex items-center justify-center font-black text-white text-base sm:text-lg shadow-sm " + (isReviewing ? (isCorrect ? "bg-emerald-500" : "bg-rose-500") : "bg-primary")}>
                    {qIndex + 1}
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 leading-snug pt-0.5 sm:pt-1">
                    {q.question}
                  </h2>
                </div>

                <div className="flex flex-col gap-3 sm:pl-14">
                  {q.options.map((option, optIndex) => {
                    const isSelected = selected === optIndex;
                    
                    let btnClass = "border-slate-200 bg-white hover:border-primary/50 text-slate-700";
                    let iconClass = "border-slate-300";
                    
                    if (!isReviewing) {
                      if (isSelected) {
                        btnClass = "border-primary bg-primary/5 shadow-md shadow-primary/10 text-primary font-bold";
                        iconClass = "border-primary bg-primary text-white";
                      }
                    } else {
                      // REVIEW MODE
                      btnClass = "border-slate-200 bg-slate-50 text-slate-500 opacity-60";
                      if (optIndex === q.correctAnswer) {
                        btnClass = "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-sm ring-2 ring-emerald-500 opacity-100 scale-[1.02] transition-transform";
                      } else if (isSelected && !isCorrect) {
                        btnClass = "border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-sm ring-1 ring-rose-500 opacity-100";
                      }
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleSelectOption(qIndex, optIndex)}
                        className={"w-full text-left p-3 sm:p-4  border-2 transition-all flex justify-between items-center group " + btnClass}
                      >
                        <span className={"font-medium text-sm sm:text-base leading-relaxed"}>
                          {option}
                        </span>
                        
                        {!isReviewing ? (
                           <div className={"w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-4 transition-colors " + iconClass}>
                             {isSelected && <CheckCircle size={14} strokeWidth={3} />}
                           </div>
                        ) : (
                           <div className="shrink-0 ml-4">
                              {optIndex === q.correctAnswer && <CheckCircle size={24} className="text-emerald-500 drop-shadow-sm" />}
                              {isSelected && !isCorrect && <XCircle size={24} className="text-rose-500 drop-shadow-sm" />}
                           </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {isReviewing && q.explanation && (
                  <div className="mt-4 sm:mt-6 sm:ml-14 p-3 sm:p-4  bg-sky-50 border border-sky-100 shadow-inner">
                    <div className="flex items-center gap-2 text-sky-700 font-bold mb-2 text-sm sm:text-base">
                      <AlertCircle size={16} className="sm:w-4 sm:h-4" /> Giải thích:
                    </div>
                    <p className="text-sky-800 text-sm sm:text-base leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Question Navigator (Sticky on Desktop) */}
        <div className="hidden lg:block w-72 shrink-0 sticky top-24">
           {renderQuestionGrid()}
        </div>

        {/* Mobile Horizontal Navigator */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] p-4 z-40 overflow-x-auto">
          <div className="flex items-center gap-2 pb-2 min-w-max">
            {quizData.map((_, idx) => {
              const hasAnswered = answers[idx] !== undefined;
              let btnClass = "w-10 h-10 shrink-0  text-sm font-bold flex items-center justify-center transition-colors ";
              if (isReviewing) {
                const isCorrect = answers[idx] === quizData[idx].correctAnswer;
                btnClass += (isCorrect ? "bg-emerald-100 text-emerald-700 border border-emerald-300" : "bg-rose-100 text-rose-700 border border-rose-300");
              } else {
                btnClass += (hasAnswered ? "bg-primary text-white" : "bg-slate-100 text-slate-500 border border-slate-200");
              }
              return (
                <button key={idx} onClick={() => scrollToQuestion(idx)} className={btnClass}>
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
