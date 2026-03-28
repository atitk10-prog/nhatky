/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Smile, 
  Frown, 
  Meh, 
  Heart, 
  Star, 
  Send, 
  User, 
  Calendar, 
  MessageSquare, 
  Target, 
  CheckCircle, 
  Sparkles,
  Loader2,
  Check,
  BarChart3,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  X
} from "lucide-react";
import Dashboard from "./Dashboard";

// --- Types ---
type Emotion = "vui" | "binh-thuong" | "buon" | "hao-hung" | "lo-lang";

interface DiaryEntry {
  fullName: string;
  className: string;
  schoolYear: string;
  week: string;
  emotion: Emotion;
  happyThing: string;
  thinkingThing: string;
  neverSaidBefore: string;
  goalImprove: string;
  goalAction: string;
  didWell: string;
  needTry: string;
  memorableMoment: string;
  messageToSelf: string;
}

const EMOTIONS: { value: Emotion; label: string; icon: any; color: string }[] = [
  { value: "hao-hung", label: "Hào hứng", icon: Sparkles, color: "text-yellow-500 bg-yellow-50" },
  { value: "vui", label: "Vui vẻ", icon: Smile, color: "text-green-500 bg-green-50" },
  { value: "binh-thuong", label: "Bình thường", icon: Meh, color: "text-blue-500 bg-blue-50" },
  { value: "lo-lang", label: "Lo lắng", icon: Meh, color: "text-orange-500 bg-orange-50" },
  { value: "buon", label: "Buồn", icon: Frown, color: "text-red-500 bg-red-50" },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<"form" | "dashboard">("form");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleDashboardAccess = () => {
    const correctPassword = (import.meta as any).env.VITE_DASHBOARD_PASSWORD;
    if (!correctPassword) {
      setCurrentPage("dashboard");
      return;
    }
    setShowPasswordModal(true);
    setPassword("");
    setPasswordError("");
  };

  const handlePasswordSubmit = () => {
    const correctPassword = (import.meta as any).env.VITE_DASHBOARD_PASSWORD;
    if (password === correctPassword) {
      setCurrentPage("dashboard");
      setShowPasswordModal(false);
      setPassword("");
    } else {
      setPasswordError("Sai mật khẩu! Vui lòng thử lại.");
    }
  };

  const [formData, setFormData] = useState<DiaryEntry>({
    fullName: "",
    className: "3A",
    schoolYear: "2025 - 2026",
    week: "",
    emotion: "vui",
    happyThing: "",
    thinkingThing: "",
    neverSaidBefore: "",
    goalImprove: "",
    goalAction: "",
    didWell: "",
    needTry: "",
    memorableMoment: "",
    messageToSelf: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmotionSelect = (emotion: Emotion) => {
    setFormData((prev) => ({ ...prev, emotion }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const scriptUrl = (import.meta as any).env.VITE_GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      setError("Chưa cấu hình Google Script URL. Vui lòng liên hệ giáo viên.");
      setIsSubmitting(false);
      return;
    }

    try {
      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData((prev) => ({
          ...prev,
          week: "",
          happyThing: "",
          thinkingThing: "",
          neverSaidBefore: "",
          goalImprove: "",
          goalAction: "",
          didWell: "",
          needTry: "",
          memorableMoment: "",
          messageToSelf: "",
        }));
      }, 3000);
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Có lỗi xảy ra khi gửi nhật ký. Em hãy thử lại nhé!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    {/* Password Modal */}
    <AnimatePresence>
      {showPasswordModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowPasswordModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#6B8E23]/10 rounded-2xl">
                  <ShieldCheck className="w-7 h-7 text-[#6B8E23]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2D5A27]">Dashboard Giáo viên</h3>
                  <p className="text-sm text-gray-500">Nhập mật khẩu để truy cập</p>
                </div>
              </div>
              <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="relative mb-4">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                placeholder="Nhập mật khẩu..."
                className="w-full pl-12 pr-12 py-4 text-lg border-2 border-[#E1EBC8] rounded-2xl focus:border-[#6B8E23] outline-none"
                autoFocus
              />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
            {passwordError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mb-4 font-medium">
                {passwordError}
              </motion.p>
            )}
            <button
              onClick={handlePasswordSubmit}
              className="w-full py-4 bg-[#6B8E23] text-white font-bold text-lg rounded-2xl hover:bg-[#55721C] transition-colors"
            >
              Truy cập Dashboard
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {currentPage === "dashboard" ? (
      <Dashboard onBack={() => setCurrentPage("form")} />
    ) : (
    <div className="min-h-screen bg-[#FDFCF0] text-[#4A4A4A] font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block p-4 bg-white rounded-full shadow-sm mb-4">
              <Sparkles className="w-12 h-12 text-yellow-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2D5A27] mb-2 uppercase tracking-tight">
              Sổ tay "Nhật ký Trưởng thành"
            </h1>
            <p className="text-xl text-[#6B8E23] font-medium italic">
              (Portfolio cá nhân học sinh)
            </p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleDashboardAccess}
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-[#6B8E23] text-white rounded-2xl font-semibold hover:bg-[#55721C] transition-colors shadow-lg shadow-[#6B8E23]/30"
          >
            <BarChart3 className="w-5 h-5" />
            Dashboard Giáo viên
          </motion.button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* THÔNG TIN HỌC SINH */}
          <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-2 border-[#E1EBC8]">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-[#6B8E23]" />
              <h2 className="text-2xl font-bold text-[#2D5A27] uppercase">Thông tin học sinh</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-lg font-semibold italic">• Họ và tên:</label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-4 text-lg border-b-2 border-[#F0F4E3] focus:border-[#6B8E23] outline-none transition-colors bg-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-lg font-semibold italic">• Lớp:</label>
                  <input
                    type="text"
                    name="className"
                    value={formData.className}
                    onChange={handleChange}
                    className="w-full p-4 text-lg border-b-2 border-[#F0F4E3] focus:border-[#6B8E23] outline-none transition-colors bg-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-lg font-semibold italic">• Năm học:</label>
                  <input
                    type="text"
                    name="schoolYear"
                    value={formData.schoolYear}
                    onChange={handleChange}
                    className="w-full p-4 text-lg border-b-2 border-[#F0F4E3] focus:border-[#6B8E23] outline-none transition-colors bg-transparent"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 1. NHẬT KÝ CẢM XÚC */}
          <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-2 border-[#E1EBC8]">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-[#2D5A27] uppercase">1. Nhật ký cảm xúc</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <label className="text-lg font-semibold whitespace-nowrap">📅 Tuần:</label>
                <input
                  type="text"
                  name="week"
                  value={formData.week}
                  onChange={handleChange}
                  placeholder="..."
                  className="w-32 p-2 text-lg border-b-2 border-[#F0F4E3] focus:border-[#6B8E23] outline-none bg-transparent"
                />
              </div>

              <div className="space-y-4">
                <p className="text-lg font-semibold">😊 Hôm nay em cảm thấy: →</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {EMOTIONS.map((emo) => (
                    <button
                      key={emo.value}
                      type="button"
                      onClick={() => handleEmotionSelect(emo.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                        formData.emotion === emo.value 
                          ? `${emo.color} ring-4 ring-offset-2 ring-[#6B8E23] scale-105` 
                          : "bg-gray-50 hover:bg-gray-100 grayscale opacity-60 hover:opacity-100 hover:grayscale-0"
                      }`}
                    >
                      <emo.icon className="w-10 h-10" />
                      <span className="font-bold">{emo.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-semibold">🌈 Điều khiến em vui: →</label>
                <textarea
                  name="happyThing"
                  value={formData.happyThing}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-4 text-lg border-2 border-[#F0F4E3] rounded-2xl focus:border-[#6B8E23] outline-none transition-colors resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-lg font-semibold">💭 Điều khiến em suy nghĩ: →</label>
                <textarea
                  name="thinkingThing"
                  value={formData.thinkingThing}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-4 text-lg border-2 border-[#F0F4E3] rounded-2xl focus:border-[#6B8E23] outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </section>

          {/* 2. ĐIỀU EM MUỐN NÓI */}
          <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-2 border-[#E1EBC8]">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-[#2D5A27] uppercase">2. Điều em muốn nói</h2>
            </div>
            <div className="space-y-4">
              <p className="text-lg font-semibold">💌 Có một điều em muốn nói nhưng chưa từng nói:</p>
              <textarea
                name="neverSaidBefore"
                value={formData.neverSaidBefore}
                onChange={handleChange}
                rows={4}
                placeholder="..."
                className="w-full p-4 text-lg border-2 border-[#F0F4E3] rounded-2xl focus:border-[#6B8E23] outline-none transition-colors"
              />
            </div>
          </section>

          {/* 3. MỤC TIÊU CỦA EM */}
          <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-2 border-[#E1EBC8]">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-orange-400" />
              <h2 className="text-2xl font-bold text-[#2D5A27] uppercase">3. Mục tiêu của em</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-lg font-semibold">🚀 Tuần này em muốn cải thiện: →</label>
                <input
                  type="text"
                  name="goalImprove"
                  value={formData.goalImprove}
                  onChange={handleChange}
                  className="w-full p-4 text-lg border-2 border-[#F0F4E3] rounded-2xl focus:border-[#6B8E23] outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-lg font-semibold">🛠️ Em sẽ làm gì để đạt được: →</label>
                <input
                  type="text"
                  name="goalAction"
                  value={formData.goalAction}
                  onChange={handleChange}
                  className="w-full p-4 text-lg border-2 border-[#F0F4E3] rounded-2xl focus:border-[#6B8E23] outline-none transition-colors"
                />
              </div>
            </div>
          </section>

          {/* 4. NHÌN LẠI BẢN THÂN */}
          <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-2 border-[#E1EBC8]">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-[#2D5A27] uppercase">4. Nhìn lại bản thân</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-lg font-semibold">⭐ Em đã làm tốt: →</label>
                <textarea
                  name="didWell"
                  value={formData.didWell}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-4 text-lg border-2 border-[#F0F4E3] rounded-2xl focus:border-[#6B8E23] outline-none transition-colors resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-lg font-semibold">📌 Em cần cố gắng thêm: →</label>
                <textarea
                  name="needTry"
                  value={formData.needTry}
                  onChange={handleChange}
                  rows={2}
                  className="w-full p-4 text-lg border-2 border-[#F0F4E3] rounded-2xl focus:border-[#6B8E23] outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </section>

          {/* 5. KHOẢNH KHẮC ĐÁNG NHỚ */}
          <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-2 border-[#E1EBC8]">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-[#2D5A27] uppercase">5. Khoảnh khắc đáng nhớ</h2>
            </div>
            <div className="space-y-2">
              <label className="block text-lg font-semibold">💖 Một điều em nhớ nhất tuần này:</label>
              <textarea
                name="memorableMoment"
                value={formData.memorableMoment}
                onChange={handleChange}
                rows={3}
                className="w-full p-4 text-lg border-2 border-[#F0F4E3] rounded-2xl focus:border-[#6B8E23] outline-none transition-colors"
              />
            </div>
          </section>

          {/* 6. LỜI NHẮN GỬI CHO BẢN THÂN */}
          <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-2 border-[#E1EBC8]">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-[#2D5A27] uppercase">6. Lời nhắn gửi cho bản thân</h2>
            </div>
            <textarea
              name="messageToSelf"
              value={formData.messageToSelf}
              onChange={handleChange}
              rows={3}
              placeholder="..."
              className="w-full p-4 text-lg border-2 border-[#F0F4E3] rounded-2xl focus:border-[#6B8E23] outline-none transition-colors"
            />
          </section>

          {/* 7. NHẬN XÉT CỦA GIÁO VIÊN */}
          <section className="bg-[#F9FBF2] p-6 md:p-8 rounded-3xl shadow-sm border-2 border-dashed border-[#6B8E23]">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#6B8E23] text-white p-1 rounded">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold text-[#2D5A27] uppercase">7. Nhận xét của giáo viên</h2>
            </div>
            <div className="min-h-[100px] flex items-center justify-center border-2 border-white rounded-2xl bg-white/50 italic text-gray-400">
              (Phần này dành cho thầy cô nhận xét sau khi em gửi nhật ký nhé)
            </div>
          </section>

          {/* Submit Button */}
          <div className="pt-8 pb-12">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="bg-green-100 text-green-700 p-6 rounded-3xl flex flex-col items-center gap-4 text-center"
                >
                  <div className="bg-green-500 text-white p-3 rounded-full">
                    <Check className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Gửi thành công!</h3>
                    <p className="text-lg">Cảm ơn em đã chia sẻ. Chúc em một ngày thật vui!</p>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  type="submit"
                  className={`w-full p-6 rounded-3xl text-2xl font-bold text-white shadow-lg flex items-center justify-center gap-3 transition-all ${
                    isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#6B8E23] hover:bg-[#55721C]"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-8 h-8" />
                      <span>Gửi Nhật Ký</span>
                    </>
                  )}
                </motion.button>
              )}
            </AnimatePresence>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-center mt-4 font-semibold"
              >
                {error}
              </motion.p>
            )}
          </div>
        </form>

        {/* Footer Info */}
        <footer className="text-center text-[#6B8E23] pb-12 opacity-70">
          <p className="italic mb-2">"Mỗi tuần, em hãy dành vài phút để viết – đó là cách em trưởng thành từng ngày."</p>
          <p>© 2026 Nhật ký Trưởng thành - Đồng hành cùng em mỗi ngày</p>
        </footer>
      </div>
    </div>
    )}
    </>
  );
}
