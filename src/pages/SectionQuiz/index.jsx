import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpenCheck,
  ArrowRight,
  RotateCcw,
  Trophy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
} from "lucide-react";
import quizData from "../../data/quiz.json";

export default function SectionQuiz() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleSelectOption = (optionIndex) => {
    if (isFinished || isReviewing) return;
    setAnswers({ ...answers, [currentIndex]: optionIndex });
  };

  const handleNext = () => {
    if (currentIndex < quizData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setHasStarted(false);
    setCurrentIndex(0);
    setAnswers({});
    setIsFinished(false);
    setIsReviewing(false);
  };

  const calculateScore = () => {
    let score = 0;
    quizData.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  const currentQ = quizData[currentIndex];
  const isAnswered = answers[currentIndex] !== undefined;

  // --- WELCOME SCREEN ---
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 max-w-lg w-full text-center shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="w-20 h-20 bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
            <BookOpenCheck size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Kiểm Tra Kiến Thức
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Bài kiểm tra gồm {quizData.length} câu hỏi trắc nghiệm được tổng hợp
            từ cẩm nang dự án Fenica. Hãy thử sức để xem bạn đã nắm vững thông
            tin đến đâu nhé!
          </p>
          <button
            onClick={() => setHasStarted(true)}
            className="w-full py-4 bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
          >
            <Play size={20} /> Bắt Đầu Ngay
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
    if (percentage < 50) message = "Cần cố gắng ôn tập thêm!";
    else if (percentage < 80)
      message = "Khá tốt, nhưng vẫn có thể làm tốt hơn!";

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 max-w-md w-full text-center shadow-xl shadow-slate-200/50 border border-slate-100 my-8"
        >
          <div className="w-24 h-24 bg-amber-100 text-amber-500 flex items-center justify-center mx-auto mb-6">
            <Trophy size={48} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            Hoàn Thành!
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
              className="w-full py-4 bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <AlertCircle size={20} /> Xem lại đáp án
            </button>
            <button
              onClick={handleRestart}
              className="w-full py-4 bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} /> Làm lại từ đầu
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- REVIEW SCREEN ---
  if (isReviewing) {
    return (
      <div className="min-h-screen bg-slate-50 overflow-y-auto p-6 pb-24">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8 mt-4">
            <h2 className="text-2xl font-black text-slate-900">
              Xem Lại Đáp Án
            </h2>
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-white text-slate-700 font-bold hover:bg-slate-100 shadow-sm border border-slate-200 flex items-center gap-2"
            >
              <RotateCcw size={18} /> Làm lại
            </button>
          </div>

          <div className="flex flex-col gap-8">
            {quizData.map((q, qIndex) => {
              const selected = answers[qIndex];
              const isCorrect = selected === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className="bg-white p-6 sm:p-8 shadow-md border border-slate-100"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className={`w-10 h-10 shrink-0 flex items-center justify-center font-black text-white mt-1 ${isCorrect ? "bg-emerald-500" : "bg-rose-500"}`}
                    >
                      {qIndex + 1}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 leading-relaxed">
                      {q.question}
                    </h3>
                  </div>

                  <div className="flex flex-col gap-3 mb-6 pl-14">
                    {q.options.map((opt, optIndex) => {
                      let btnClass =
                        "border-slate-200 bg-slate-50 text-slate-500";
                      if (optIndex === q.correctAnswer) {
                        btnClass =
                          "border-emerald-500 bg-emerald-50 text-emerald-700 font-bold shadow-sm ring-1 ring-emerald-500";
                      } else if (optIndex === selected && !isCorrect) {
                        btnClass =
                          "border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-sm ring-1 ring-rose-500";
                      }

                      return (
                        <div
                          key={optIndex}
                          className={`w-full text-left p-4 border flex justify-between items-center ${btnClass}`}
                        >
                          <span>{opt}</span>
                          {optIndex === q.correctAnswer && (
                            <CheckCircle
                              size={20}
                              className="text-emerald-500 shrink-0"
                            />
                          )}
                          {optIndex === selected && !isCorrect && (
                            <XCircle
                              size={20}
                              className="text-rose-500 shrink-0"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pl-14">
                    <div className="bg-amber-50 p-4 border border-amber-100">
                      <h4 className="text-xs font-black uppercase text-amber-600 tracking-wider mb-1 flex items-center gap-1">
                        <AlertCircle size={14} /> Giải thích
                      </h4>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ SCREEN (STEP BY STEP) ---
  const progress = (currentIndex / quizData.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6">
      {/* Header & Progress */}
      <div className="max-w-3xl mx-auto w-full mb-8 mt-4">
        <div className="flex justify-between items-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary font-bold text-sm">
            <BookOpenCheck size={16} /> Thi Trắc Nghiệm
          </div>
          <div className="text-slate-500 font-black">
            Câu {currentIndex + 1}{" "}
            <span className="text-slate-300 font-normal">
              / {quizData.length}
            </span>
          </div>
        </div>
        <div className="w-full h-2 bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-3xl mx-auto w-full flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 leading-tight">
              {currentQ.question}
            </h2>

            <div className="flex flex-col gap-4 mb-8">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-5 border-2 transition-all duration-200 flex items-center justify-between group ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md scale-[1.01]"
                        : "border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <span
                      className={`text-lg font-medium transition-colors ${isSelected ? "text-primary font-bold" : "text-slate-600 group-hover:text-slate-900"}`}
                    >
                      {opt}
                    </span>
                    <div
                      className={`w-6 h-6 border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? "border-primary bg-primary" : "border-slate-300 bg-white"}`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 bg-white"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-50">
              <button
                onClick={handleNext}
                disabled={!isAnswered}
                className={`px-8 py-4 font-bold flex items-center gap-2 transition-all ${
                  isAnswered
                    ? "bg-slate-900 text-white hover:bg-amber-500 shadow-xl shadow-slate-900/20 hover:shadow-amber-500/30"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                {currentIndex === quizData.length - 1
                  ? "Nộp Bài"
                  : "Câu Tiếp Theo"}
                <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
