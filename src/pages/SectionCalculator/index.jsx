import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Calculator,
  DollarSign,
  Percent,
  Calendar,
  PieChart,
  Coins,
} from "lucide-react";

export default function SectionCalculator() {
  const [propertyValue, setPropertyValue] = useState(3000); // 3 tỷ VNĐ (in millions)
  const [loanPercentage, setLoanPercentage] = useState(70); // 70%
  const [interestRate, setInterestRate] = useState(7.5); // 7.5% per year
  const [loanTerm, setLoanTerm] = useState(20); // 20 years

  const calculation = useMemo(() => {
    const loanAmount = propertyValue * (loanPercentage / 100);
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanTerm * 12;

    let firstMonthPayment = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (monthlyRate === 0) {
      firstMonthPayment = loanAmount / totalMonths;
      totalPayment = loanAmount;
    } else {
      // Dư nợ giảm dần (Declining balance) - Phổ biến tại ngân hàng VN
      const principalPerMonth = loanAmount / totalMonths;
      
      // Tháng đầu tiên (Tháng cao nhất) = Gốc + Lãi tháng đầu
      firstMonthPayment = principalPerMonth + (loanAmount * monthlyRate);
      
      // Tổng tiền lãi = Tiền vay * lãi tháng * (số tháng + 1) / 2
      totalInterest = loanAmount * monthlyRate * (totalMonths + 1) / 2;
      totalPayment = loanAmount + totalInterest;
    }

    return {
      loanAmount, // Tiền gốc (Triệu VNĐ)
      monthlyPayment: firstMonthPayment, // Trả tháng đầu (Triệu VNĐ)
      totalInterest, // Tổng lãi (Triệu VNĐ)
      totalPayment, // Tổng trả (Triệu VNĐ)
    };
  }, [propertyValue, loanPercentage, interestRate, loanTerm]);

  const formatCurrency = (value) => {
    if (value >= 1000) {
      return (value / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + " Tỷ";
    }
    return value.toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + " Triệu";
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full mb-4 mt-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 font-bold text-sm mb-4 w-fit">
          <Calculator size={16} /> Công cụ tài chính
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full pb-20">
        <div className="bg-white shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
          {/* LEFT: Inputs */}
          <div className="flex-1 p-6 md:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              Thông số khoản vay
            </h3>

            <div className="flex flex-col gap-8">
              {/* Property Value */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <DollarSign size={16} className="text-emerald-500" /> Giá
                    trị căn hộ
                  </label>
                  <span className="font-black text-xl text-slate-900">
                    {formatCurrency(propertyValue)}
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="20000"
                  step="100"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Loan Percentage */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <PieChart size={16} className="text-emerald-500" /> Tỷ lệ
                    vay (%)
                  </label>
                  <span className="font-black text-xl text-slate-900">
                    {loanPercentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={loanPercentage}
                  onChange={(e) => setLoanPercentage(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Percent size={16} className="text-emerald-500" /> Lãi suất
                    (%/năm)
                  </label>
                  <span className="font-black text-xl text-slate-900">
                    {interestRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Loan Term */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={16} className="text-emerald-500" /> Thời
                    gian vay (Năm)
                  </label>
                  <span className="font-black text-xl text-slate-900">
                    {loanTerm} Năm
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="35"
                  step="1"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="lg:w-[450px] shrink-0 bg-slate-900 text-white p-6 md:p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <h3 className="text-xl font-bold text-slate-300 mb-8 relative z-10">
              Tóm tắt chi phí
            </h3>

            <div className="flex flex-col gap-6 relative z-10">
              <div className="bg-white/10 backdrop-blur border border-white/10 p-6">
                <p className="text-emerald-400 font-bold uppercase tracking-wider text-sm mb-2">
                  Trả tháng đầu (Dư nợ giảm dần)
                </p>
                <p className="text-xl font-black">
                  {formatCurrency(calculation.monthlyPayment)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/5 p-4">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                    Cần trả trước
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(propertyValue - calculation.loanAmount)}
                  </p>
                </div>
                <div className="bg-white/5 border border-white/5 p-4">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                    Tiền gốc (Vay)
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(calculation.loanAmount)}
                  </p>
                </div>
              </div>

              <div className="bg-rose-500/10 border border-rose-500/20 p-4">
                <p className="text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
                  Tổng tiền lãi phải trả
                </p>
                <p className="text-xl font-bold text-rose-100">
                  {formatCurrency(calculation.totalInterest)}
                </p>
              </div>

              <div className="mt-4 pt-6 border-t border-white/10 flex justify-between items-center">
                <span className="text-slate-300 font-bold">
                  Tổng chi phí căn hộ
                </span>
                <span className="text-xl font-black text-white">
                  {formatCurrency(propertyValue + calculation.totalInterest)}
                </span>
              </div>
            </div>

            {/* Visual Breakdown Bar */}
            <div className="mt-8 relative z-10">
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                <span>Vốn tự có</span>
                <span>Vay gốc</span>
                <span>Lãi</span>
              </div>
              <div className="h-3 w-full bg-slate-800 overflow-hidden flex">
                <div
                  className="h-full bg-slate-400"
                  style={{
                    width: `${((propertyValue - calculation.loanAmount) / (propertyValue + calculation.totalInterest)) * 100}%`,
                  }}
                ></div>
                <div
                  className="h-full bg-emerald-500"
                  style={{
                    width: `${(calculation.loanAmount / (propertyValue + calculation.totalInterest)) * 100}%`,
                  }}
                ></div>
                <div
                  className="h-full bg-rose-500"
                  style={{
                    width: `${(calculation.totalInterest / (propertyValue + calculation.totalInterest)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
