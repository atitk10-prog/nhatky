/**
 * Dashboard Giáo viên - Nhật ký Trưởng thành
 * Hiển thị biểu đồ phân tích dữ liệu nhật ký học sinh
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Trophy,
  Table2,
  RefreshCw,
  Users,
  BookOpen,
  Sparkles,
  ArrowLeft,
  Download,
  ChevronDown,
  ChevronUp,
  Heart,
  Smile,
  Meh,
  Frown,
  Calendar,
  Star,
  Filter,
  UserCheck,
  FileDown,
} from "lucide-react";

// --- Types ---
interface DiaryRecord {
  timestamp: string;
  fullName: string;
  className: string;
  schoolYear: string;
  week: string;
  emotion: string;
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

// --- Mock Data ---
const MOCK_DATA: DiaryRecord[] = [
  { timestamp: "2026-03-01T08:00:00Z", fullName: "Nguyễn Minh Anh", className: "3A", schoolYear: "2025-2026", week: "1", emotion: "hao-hung", happyThing: "Được điểm 10 môn Toán", thinkingThing: "Tiếng Anh khó quá", neverSaidBefore: "Em rất thích cô giáo", goalImprove: "Viết chữ đẹp hơn", goalAction: "Tập viết mỗi ngày", didWell: "Hoàn thành bài tập", needTry: "Tập trung hơn", memorableMoment: "Được khen trước lớp", messageToSelf: "Cố lên nào!" },
  { timestamp: "2026-03-01T08:30:00Z", fullName: "Trần Đức Huy", className: "3A", schoolYear: "2025-2026", week: "1", emotion: "vui", happyThing: "Chơi đá bóng với bạn", thinkingThing: "Bài kiểm tra sắp tới", neverSaidBefore: "Em muốn làm bác sĩ", goalImprove: "Đọc sách nhiều hơn", goalAction: "Đọc 1 cuốn sách mỗi tuần", didWell: "Giúp bạn học bài", needTry: "Đi học đúng giờ", memorableMoment: "Thắng trận đá bóng", messageToSelf: "Mình giỏi lắm!" },
  { timestamp: "2026-03-01T09:00:00Z", fullName: "Lê Thu Hà", className: "3A", schoolYear: "2025-2026", week: "1", emotion: "binh-thuong", happyThing: "Vẽ được bức tranh đẹp", thinkingThing: "Nhớ ông bà ở quê", neverSaidBefore: "Em muốn học đàn piano", goalImprove: "Học Tiếng Anh tốt hơn", goalAction: "Học từ vựng mỗi ngày", didWell: "Vẽ tranh đẹp", needTry: "Phát biểu nhiều hơn", memorableMoment: "Được tặng quà sinh nhật", messageToSelf: "Em yêu em!" },
  { timestamp: "2026-03-01T09:30:00Z", fullName: "Phạm Gia Bảo", className: "3A", schoolYear: "2025-2026", week: "1", emotion: "lo-lang", happyThing: "Được mẹ nấu phở", thinkingThing: "Sợ kiểm tra giữa kì", neverSaidBefore: "Em hay buồn khi bố mẹ cãi nhau", goalImprove: "Tự tin hơn", goalAction: "Tập phát biểu trước gương", didWell: "Làm bài tập đầy đủ", needTry: "Mạnh dạn hơn", memorableMoment: "Đi công viên cùng gia đình", messageToSelf: "Đừng sợ, em làm được!" },
  { timestamp: "2026-03-01T10:00:00Z", fullName: "Hoàng Thị Mai", className: "3A", schoolYear: "2025-2026", week: "1", emotion: "vui", happyThing: "Được làm lớp trưởng", thinkingThing: "Muốn giúp bạn học tốt", neverSaidBefore: "Em rất tự hào về mình", goalImprove: "Lãnh đạo tốt hơn", goalAction: "Giúp đỡ bạn mỗi ngày", didWell: "Tổ chức hoạt động lớp", needTry: "Kiên nhẫn hơn", memorableMoment: "Được bầu làm lớp trưởng", messageToSelf: "Em là người tuyệt vời!" },

  { timestamp: "2026-03-08T08:00:00Z", fullName: "Nguyễn Minh Anh", className: "3A", schoolYear: "2025-2026", week: "2", emotion: "vui", happyThing: "Học được bài hát mới", thinkingThing: "Muốn tham gia CLB vẽ", neverSaidBefore: "Em thích vẽ tranh phong cảnh", goalImprove: "Học nhạc", goalAction: "Tập hát mỗi tối", didWell: "Phát biểu tốt", needTry: "Viết nhanh hơn", memorableMoment: "Hát trước lớp", messageToSelf: "Tiếp tục phát huy!" },
  { timestamp: "2026-03-08T08:30:00Z", fullName: "Trần Đức Huy", className: "3A", schoolYear: "2025-2026", week: "2", emotion: "hao-hung", happyThing: "Ghi bàn trong trận bóng", thinkingThing: "Muốn tập thể dục nhiều hơn", neverSaidBefore: "Em muốn trở thành cầu thủ", goalImprove: "Chạy nhanh hơn", goalAction: "Tập chạy buổi sáng", didWell: "Thể dục tốt", needTry: "Viết chữ đẹp", memorableMoment: "Ghi 2 bàn thắng", messageToSelf: "Số 1!" },
  { timestamp: "2026-03-08T09:00:00Z", fullName: "Lê Thu Hà", className: "3A", schoolYear: "2025-2026", week: "2", emotion: "vui", happyThing: "Tranh được giải nhì", thinkingThing: "Muốn học thêm về màu nước", neverSaidBefore: "Em mơ thành họa sĩ", goalImprove: "Vẽ chân dung", goalAction: "Vẽ mỗi ngày 30 phút", didWell: "Sáng tạo trong vẽ tranh", needTry: "Toán học", memorableMoment: "Nhận giải thưởng", messageToSelf: "Em sẽ thành họa sĩ!" },
  { timestamp: "2026-03-08T09:30:00Z", fullName: "Phạm Gia Bảo", className: "3A", schoolYear: "2025-2026", week: "2", emotion: "binh-thuong", happyThing: "Chơi cùng bạn mới", thinkingThing: "Bài Toán hơi khó", neverSaidBefore: "Em thấy tự tin hơn rồi", goalImprove: "Giải Toán nhanh", goalAction: "Làm thêm bài tập", didWell: "Kết bạn mới", needTry: "Toán nâng cao", memorableMoment: "Có bạn thân mới", messageToSelf: "Mình đang tiến bộ!" },
  { timestamp: "2026-03-08T10:00:00Z", fullName: "Hoàng Thị Mai", className: "3A", schoolYear: "2025-2026", week: "2", emotion: "hao-hung", happyThing: "Lớp được khen ngoan nhất", thinkingThing: "Tổ chức hoạt động gì cho tuần sau", neverSaidBefore: "Em rất vui khi làm lớp trưởng", goalImprove: "Nói trước đám đông", goalAction: "Tập thuyết trình", didWell: "Dẫn dắt lớp tốt", needTry: "Thể dục", memorableMoment: "Lớp được cờ thi đua", messageToSelf: "Lớp mình số 1!" },
  { timestamp: "2026-03-08T10:30:00Z", fullName: "Võ Thanh Tùng", className: "3A", schoolYear: "2025-2026", week: "2", emotion: "buon", happyThing: "Được ăn kem", thinkingThing: "Nhớ bạn cũ ở trường cũ", neverSaidBefore: "Em hay buồn một mình", goalImprove: "Nói chuyện nhiều hơn", goalAction: "Chơi cùng bạn giờ ra chơi", didWell: "Đi học đều", needTry: "Hòa đồng hơn", memorableMoment: "Bạn mới rủ chơi", messageToSelf: "Ngày mai sẽ tốt hơn" },

  { timestamp: "2026-03-15T08:00:00Z", fullName: "Nguyễn Minh Anh", className: "3A", schoolYear: "2025-2026", week: "3", emotion: "hao-hung", happyThing: "Được chọn thi kể chuyện", thinkingThing: "Chuẩn bị bài thi thật tốt", neverSaidBefore: "Em tự hào khi đại diện lớp", goalImprove: "Kể chuyện hay hơn", goalAction: "Tập kể mỗi ngày", didWell: "Được chọn đi thi", needTry: "Không run khi nói", memorableMoment: "Cô chọn em đi thi", messageToSelf: "Em sẽ làm tốt!" },
  { timestamp: "2026-03-15T08:30:00Z", fullName: "Trần Đức Huy", className: "3A", schoolYear: "2025-2026", week: "3", emotion: "vui", happyThing: "Điểm Toán cao nhất lớp", thinkingThing: "Chia sẻ cách học cho bạn", neverSaidBefore: "Em thích giúp bạn", goalImprove: "Tiếng Việt", goalAction: "Đọc truyện mỗi tối", didWell: "Toán giỏi", needTry: "Viết văn", memorableMoment: "Được 10 điểm Toán", messageToSelf: "Giỏi lắm Huy ơi!" },
  { timestamp: "2026-03-15T09:00:00Z", fullName: "Lê Thu Hà", className: "3A", schoolYear: "2025-2026", week: "3", emotion: "hao-hung", happyThing: "Tranh gửi triển lãm trường", thinkingThing: "Muốn vẽ tranh về gia đình", neverSaidBefore: "Em yêu gia đình nhất", goalImprove: "Vẽ người", goalAction: "Quan sát và vẽ", didWell: "Tranh được triển lãm", needTry: "Thể dục nhiều hơn", memorableMoment: "Mọi người khen tranh em", messageToSelf: "Em là nghệ sĩ nhỏ!" },
  { timestamp: "2026-03-15T09:30:00Z", fullName: "Phạm Gia Bảo", className: "3A", schoolYear: "2025-2026", week: "3", emotion: "vui", happyThing: "Được điểm 9 môn Toán", thinkingThing: "Em đang tiến bộ thật", neverSaidBefore: "Cảm ơn cô đã kiên nhẫn", goalImprove: "Đạt điểm 10", goalAction: "Ôn bài kỹ hơn", didWell: "Điểm Toán tăng", needTry: "Tập trung nghe giảng", memorableMoment: "Cô khen em tiến bộ", messageToSelf: "Em giỏi hơn rồi!" },
  { timestamp: "2026-03-15T10:00:00Z", fullName: "Hoàng Thị Mai", className: "3A", schoolYear: "2025-2026", week: "3", emotion: "vui", happyThing: "Tổ chức sinh nhật cho bạn", thinkingThing: "Làm sao để lớp đoàn kết hơn", neverSaidBefore: "Em yêu các bạn trong lớp", goalImprove: "Tổ chức sự kiện", goalAction: "Lên kế hoạch chi tiết", didWell: "Tổ chức sinh nhật vui", needTry: "Học Toán", memorableMoment: "Bạn khóc vì vui", messageToSelf: "Em giỏi lắm!" },
  { timestamp: "2026-03-15T10:30:00Z", fullName: "Võ Thanh Tùng", className: "3A", schoolYear: "2025-2026", week: "3", emotion: "vui", happyThing: "Có nhóm bạn mới", thinkingThing: "Trường mới cũng vui", neverSaidBefore: "Em bắt đầu thích trường mới", goalImprove: "Tham gia nhiều hoạt động", goalAction: "Đăng ký CLB", didWell: "Kết bạn", needTry: "Tự tin phát biểu", memorableMoment: "Được mời sinh nhật bạn", messageToSelf: "Em có bạn rồi!" },

  { timestamp: "2026-03-22T08:00:00Z", fullName: "Nguyễn Minh Anh", className: "3A", schoolYear: "2025-2026", week: "4", emotion: "hao-hung", happyThing: "Đạt giải nhất kể chuyện", thinkingThing: "Muốn thi cấp huyện", neverSaidBefore: "Em muốn trở thành MC", goalImprove: "Nói trước đám đông", goalAction: "Tham gia nhiều cuộc thi", didWell: "Đạt giải nhất", needTry: "Không kiêu ngạo", memorableMoment: "Nhận giải trên sân khấu", messageToSelf: "Giấc mơ em thành thật!" },
  { timestamp: "2026-03-22T08:30:00Z", fullName: "Trần Đức Huy", className: "3A", schoolYear: "2025-2026", week: "4", emotion: "vui", happyThing: "Dạy bạn giải Toán", thinkingThing: "Mình có thể giúp nhiều hơn", neverSaidBefore: "Em thích dạy bạn học", goalImprove: "Kiên nhẫn hơn khi giảng", goalAction: "Giải thích từ từ", didWell: "Giúp bạn hiểu bài", needTry: "Không nóng tính", memorableMoment: "Bạn nói cảm ơn em", messageToSelf: "Em là thầy giáo nhỏ!" },
  { timestamp: "2026-03-22T09:00:00Z", fullName: "Phạm Gia Bảo", className: "3A", schoolYear: "2025-2026", week: "4", emotion: "hao-hung", happyThing: "Đạt điểm 10 Toán!", thinkingThing: "Em đã cố gắng được rồi", neverSaidBefore: "Em cảm ơn cô rất nhiều", goalImprove: "Giữ vững thành tích", goalAction: "Tiếp tục ôn bài", didWell: "Đạt mục tiêu điểm 10", needTry: "Tiếng Anh", memorableMoment: "Điểm 10 đầu tiên", messageToSelf: "Em làm được rồi!!!" },
  { timestamp: "2026-03-22T09:30:00Z", fullName: "Võ Thanh Tùng", className: "3A", schoolYear: "2025-2026", week: "4", emotion: "vui", happyThing: "Tham gia CLB cờ vua", thinkingThing: "Em muốn đánh giỏi", neverSaidBefore: "Em rất vui khi ở trường mới", goalImprove: "Đánh cờ vua giỏi", goalAction: "Tập mỗi ngày", didWell: "Tích cực tham gia", needTry: "Tập trung hơn", memorableMoment: "Thắng ván cờ đầu tiên", messageToSelf: "Em thích ở đây!" },
];

// --- Emotion Config ---
const EMOTION_CONFIG: Record<string, { label: string; color: string; bgColor: string; gradient: string }> = {
  "hao-hung": { label: "Hào hứng", color: "#F59E0B", bgColor: "#FEF3C7", gradient: "linear-gradient(135deg, #F59E0B, #FBBF24)" },
  "vui": { label: "Vui vẻ", color: "#10B981", bgColor: "#D1FAE5", gradient: "linear-gradient(135deg, #10B981, #34D399)" },
  "binh-thuong": { label: "Bình thường", color: "#3B82F6", bgColor: "#DBEAFE", gradient: "linear-gradient(135deg, #3B82F6, #60A5FA)" },
  "lo-lang": { label: "Lo lắng", color: "#F97316", bgColor: "#FED7AA", gradient: "linear-gradient(135deg, #F97316, #FB923C)" },
  "buon": { label: "Buồn", color: "#EF4444", bgColor: "#FEE2E2", gradient: "linear-gradient(135deg, #EF4444, #F87171)" },
};

// --- Helper Functions ---
function parseData(raw: any[]): DiaryRecord[] {
  return raw.map((r: any) => ({
    timestamp: r["Timestamp"] || r.timestamp || "",
    fullName: r["Họ và tên"] || r.fullName || "",
    className: r["Lớp"] || r.className || "",
    schoolYear: r["Năm học"] || r.schoolYear || "",
    week: r["Tuần"] || r.week || "",
    emotion: r["Cảm xúc"] || r.emotion || "",
    happyThing: r["Điều vui"] || r.happyThing || "",
    thinkingThing: r["Điều suy nghĩ"] || r.thinkingThing || "",
    neverSaidBefore: r["Điều muốn nói"] || r.neverSaidBefore || "",
    goalImprove: r["Mục tiêu cải thiện"] || r.goalImprove || "",
    goalAction: r["Hành động"] || r.goalAction || "",
    didWell: r["Làm tốt"] || r.didWell || "",
    needTry: r["Cần cố gắng"] || r.needTry || "",
    memorableMoment: r["Khoảnh khắc đáng nhớ"] || r.memorableMoment || "",
    messageToSelf: r["Lời nhắn cho bản thân"] || r.messageToSelf || "",
  }));
}

// ============================================================
// CHART COMPONENTS (Pure Canvas)
// ============================================================

// --- Donut Chart ---
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const total = data.reduce((s, d) => s + d.value, 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || total === 0) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(cx, cy) - 10;
    const innerRadius = radius * 0.6;
    let startAngle = -Math.PI / 2;

    data.forEach((d) => {
      const sliceAngle = (d.value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(cx, cy, innerRadius, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = d.color;
      ctx.fill();

      // Label
      if (d.value / total > 0.05) {
        const midAngle = startAngle + sliceAngle / 2;
        const labelRadius = (radius + innerRadius) / 2;
        const lx = cx + Math.cos(midAngle) * labelRadius;
        const ly = cy + Math.sin(midAngle) * labelRadius;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 13px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${Math.round((d.value / total) * 100)}%`, lx, ly);
      }
      startAngle += sliceAngle;
    });

    // Center text
    ctx.fillStyle = "#2D5A27";
    ctx.font = "bold 28px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(total), cx, cy - 8);
    ctx.fillStyle = "#6B8E23";
    ctx.font = "12px Inter, sans-serif";
    ctx.fillText("bài ghi", cx, cy + 14);
  }, [data, total]);

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas ref={canvasRef} style={{ width: 220, height: 220 }} />
      <div className="flex flex-wrap justify-center gap-3">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="font-medium text-gray-700">{d.label}</span>
            <span className="font-bold" style={{ color: d.color }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Bar Chart ---
function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maxVal = Math.max(...data.map(d => d.value), 1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const padding = { top: 20, right: 20, bottom: 50, left: 45 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    const barW = Math.min(50, (chartW / data.length) * 0.6);
    const gap = (chartW - barW * data.length) / (data.length + 1);

    // Grid lines
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(String(Math.round(maxVal - (maxVal / 4) * i)), padding.left - 8, y);
    }

    // Bars
    data.forEach((d, i) => {
      const barH = (d.value / maxVal) * chartH;
      const x = padding.left + gap * (i + 1) + barW * i;
      const y = padding.top + chartH - barH;

      // Bar gradient
      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      grad.addColorStop(0, "#6B8E23");
      grad.addColorStop(1, "#2D5A27");
      ctx.fillStyle = grad;

      // Rounded top
      const r = Math.min(6, barW / 2);
      ctx.beginPath();
      ctx.moveTo(x, y + barH);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.arcTo(x + barW, y, x + barW, y + r, r);
      ctx.lineTo(x + barW, y + barH);
      ctx.closePath();
      ctx.fill();

      // Value on top
      ctx.fillStyle = "#2D5A27";
      ctx.font = "bold 13px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(d.value), x + barW / 2, y - 6);

      // Label
      ctx.fillStyle = "#6B7280";
      ctx.font = "12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Tuần ${d.label}`, x + barW / 2, padding.top + chartH + 20);
    });
  }, [data, maxVal]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: 280 }} />;
}

// --- Line Chart ---
function LineChart({ data }: { data: { label: string; values: Record<string, number> }[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const padding = { top: 20, right: 20, bottom: 50, left: 45 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const emotions = Object.keys(EMOTION_CONFIG);
    const allValues = data.flatMap(d => Object.values(d.values));
    const maxVal = Math.max(...allValues, 1);

    // Grid
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
      ctx.fillStyle = "#9CA3AF";
      ctx.font = "11px Inter, sans-serif";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(String(Math.round(maxVal - (maxVal / 4) * i)), padding.left - 8, y);
    }

    // X labels
    data.forEach((d, i) => {
      const x = padding.left + (chartW / (data.length - 1 || 1)) * i;
      ctx.fillStyle = "#6B7280";
      ctx.font = "12px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Tuần ${d.label}`, x, padding.top + chartH + 20);
    });

    // Lines for each emotion
    emotions.forEach((emo) => {
      const config = EMOTION_CONFIG[emo];
      const points = data.map((d, i) => ({
        x: padding.left + (chartW / (data.length - 1 || 1)) * i,
        y: padding.top + chartH - ((d.values[emo] || 0) / maxVal) * chartH,
      }));

      // Area fill
      ctx.beginPath();
      ctx.moveTo(points[0].x, padding.top + chartH);
      points.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
      ctx.closePath();
      ctx.fillStyle = config.color + "15";
      ctx.fill();

      // Line
      ctx.beginPath();
      ctx.strokeStyle = config.color;
      ctx.lineWidth = 3;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();

      // Dots
      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = config.color;
        ctx.stroke();
      });
    });
  }, [data]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: 300 }} />;
}

// ============================================================
// MAIN DASHBOARD COMPONENT
// ============================================================

interface DashboardProps {
  onBack: () => void;
}

export default function Dashboard({ onBack }: DashboardProps) {
  const [records, setRecords] = useState<DiaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "trend" | "students" | "compare" | "data">("overview");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterWeek, setFilterWeek] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<string>("all");

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const scriptUrl = (import.meta as any).env.VITE_GOOGLE_SCRIPT_URL;

    if (!scriptUrl) {
      setRecords(MOCK_DATA);
      setUseMock(true);
      setLoading(false);
      return;
    }

    try {
      const resp = await fetch(scriptUrl);
      const json = await resp.json();
      if (json.success && json.data && json.data.length > 0) {
        setRecords(parseData(json.data));
        setUseMock(false);
      } else {
        setRecords(MOCK_DATA);
        setUseMock(true);
      }
    } catch {
      setRecords(MOCK_DATA);
      setUseMock(true);
    } finally {
      setLoading(false);
    }
  };

  // --- Filter options ---
  const allClasses = [...new Set(records.map((r) => r.className))].sort();
  const allWeeks = [...new Set(records.map((r) => r.week))].sort((a, b) => Number(a) - Number(b));
  const allStudents = [...new Set(records.map((r) => r.fullName))].sort();

  // --- Filtered records ---
  const filtered = records.filter((r) => {
    if (filterClass !== "all" && r.className !== filterClass) return false;
    if (filterWeek !== "all" && r.week !== filterWeek) return false;
    return true;
  });

  // --- Computed Stats (from filtered) ---
  const emotionCounts = filtered.reduce<Record<string, number>>((acc, r) => {
    acc[r.emotion] = (acc[r.emotion] || 0) + 1;
    return acc;
  }, {});

  const donutData = Object.entries(EMOTION_CONFIG).map(([key, cfg]) => ({
    label: cfg.label,
    value: emotionCounts[key] || 0,
    color: cfg.color,
  }));

  const weekCounts = filtered.reduce<Record<string, number>>((acc, r) => {
    acc[r.week] = (acc[r.week] || 0) + 1;
    return acc;
  }, {});
  const barData = Object.entries(weekCounts)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([label, value]) => ({ label, value: value as number }));

  const weekEmotions = filtered.reduce<Record<string, Record<string, number>>>((acc, r) => {
    if (!acc[r.week]) acc[r.week] = {};
    acc[r.week][r.emotion] = (acc[r.week][r.emotion] || 0) + 1;
    return acc;
  }, {});
  const trendData = Object.entries(weekEmotions)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([label, values]) => ({ label, values: values as Record<string, number> }));

  const studentCounts = filtered.reduce<Record<string, number>>((acc, r) => {
    acc[r.fullName] = (acc[r.fullName] || 0) + 1;
    return acc;
  }, {});
  const leaderboard = Object.entries(studentCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .map(([name, count], i) => ({ rank: i + 1, name, count: count as number }));

  const uniqueStudents = new Set(filtered.map((r) => r.fullName)).size;
  const uniqueWeeks = new Set(filtered.map((r) => r.week)).size;
  const positivePercent = filtered.length > 0 
    ? Math.round(((emotionCounts["hao-hung"] || 0) + (emotionCounts["vui"] || 0)) / filtered.length * 100) 
    : 0;

  // --- Student comparison data ---
  const compareStudent = selectedStudent !== "all" ? selectedStudent : allStudents[0] || "";
  const studentWeeklyEmotions = records
    .filter((r) => r.fullName === compareStudent)
    .sort((a, b) => Number(a.week) - Number(b.week));

  // --- Export CSV ---
  const exportCSV = () => {
    const headers = ["Tuần","Họ tên","Lớp","Cảm xúc","Điều vui","Suy nghĩ","Muốn nói","Mục tiêu","Hành động","Làm tốt","Cần cố gắng","Khoảnh khắc","Lời nhắn"];
    const rows = filtered.map(r => [
      r.week, r.fullName, r.className, EMOTION_CONFIG[r.emotion]?.label || r.emotion,
      r.happyThing, r.thinkingThing, r.neverSaidBefore, r.goalImprove, r.goalAction,
      r.didWell, r.needTry, r.memorableMoment, r.messageToSelf
    ].map(v => `"${(v||'').replace(/"/g,'""')}"`));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `nhatky_${filterClass}_tuan${filterWeek}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ---

  const tabs = [
    { id: "overview" as const, label: "Tổng quan", icon: PieChart },
    { id: "trend" as const, label: "Xu hướng", icon: TrendingUp },
    { id: "students" as const, label: "Xếp hạng", icon: Trophy },
    { id: "compare" as const, label: "Tiến bộ", icon: UserCheck },
    { id: "data" as const, label: "Dữ liệu", icon: Table2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f7e6] to-[#e8f0d8] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-4">
            <RefreshCw className="w-12 h-12 text-[#6B8E23] animate-spin" />
          </div>
          <p className="text-xl font-semibold text-[#2D5A27]">Đang tải dữ liệu...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f7e6] via-[#fdfcf0] to-[#e8f0d8] text-[#4A4A4A] font-sans">
      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-[#E1EBC8] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#6B8E23] hover:text-[#2D5A27] font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Về trang ghi nhật ký</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#6B8E23] rounded-xl">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#2D5A27] leading-tight">Dashboard Giáo viên</h1>
              <p className="text-xs text-[#6B8E23]">Nhật ký Trưởng thành</p>
            </div>
          </div>
          <button
            onClick={loadData}
            className="p-2 rounded-xl hover:bg-[#E1EBC8] transition-colors"
            title="Tải lại dữ liệu"
          >
            <RefreshCw className="w-5 h-5 text-[#6B8E23]" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mock data notice */}
        {useMock && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-700">
              <strong>Dữ liệu mẫu.</strong> Chưa kết nối Google Sheets. Thiết lập <code className="bg-amber-100 px-1 rounded">VITE_GOOGLE_SCRIPT_URL</code> trong file <code className="bg-amber-100 px-1 rounded">.env.local</code> để sử dụng dữ liệu thực.
            </p>
          </motion.div>
        )}

        {/* ===== FILTER BAR ===== */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Filter className="w-4 h-4" />
            <span>Lọc:</span>
          </div>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-4 py-2 rounded-xl border border-[#E1EBC8] bg-white text-sm font-medium focus:border-[#6B8E23] outline-none"
          >
            <option value="all">Tất cả lớp</option>
            {allClasses.map((c) => (
              <option key={c} value={c}>Lớp {c}</option>
            ))}
          </select>
          <select
            value={filterWeek}
            onChange={(e) => setFilterWeek(e.target.value)}
            className="px-4 py-2 rounded-xl border border-[#E1EBC8] bg-white text-sm font-medium focus:border-[#6B8E23] outline-none"
          >
            <option value="all">Tất cả tuần</option>
            {allWeeks.map((w) => (
              <option key={w} value={w}>Tuần {w}</option>
            ))}
          </select>
          <div className="flex-1" />
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E1EBC8] rounded-xl text-sm font-medium text-[#6B8E23] hover:bg-[#E1EBC8] transition-colors"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>
        </div>

        {/* ===== STAT CARDS ===== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: BookOpen, label: "Tổng bài ghi", value: filtered.length, color: "#6B8E23", bg: "from-[#6B8E23]/10 to-[#6B8E23]/5" },
            { icon: Users, label: "Học sinh", value: uniqueStudents, color: "#3B82F6", bg: "from-blue-500/10 to-blue-500/5" },
            { icon: Calendar, label: "Số tuần", value: uniqueWeeks, color: "#8B5CF6", bg: "from-purple-500/10 to-purple-500/5" },
            { icon: Heart, label: "Tích cực", value: `${positivePercent}%`, color: "#10B981", bg: "from-emerald-500/10 to-emerald-500/5" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${stat.bg} backdrop-blur-sm bg-white/60 p-5 rounded-2xl border border-white/80 shadow-sm`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl" style={{ backgroundColor: stat.color + "20" }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* ===== TABS ===== */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-[#6B8E23] text-white shadow-lg shadow-[#6B8E23]/30"
                  : "bg-white text-gray-600 hover:bg-[#E1EBC8] border border-[#E1EBC8]"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== TAB CONTENT ===== */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Donut Chart */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-[#E1EBC8]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-50 rounded-xl">
                    <Heart className="w-5 h-5 text-pink-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2D5A27]">Phân bố cảm xúc</h3>
                    <p className="text-xs text-gray-500">Toàn bộ các bài ghi nhật ký</p>
                  </div>
                </div>
                <DonutChart data={donutData} />
              </div>

              {/* Bar Chart */}
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-[#E1EBC8]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-xl">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2D5A27]">Số bài ghi theo tuần</h3>
                    <p className="text-xs text-gray-500">Hoạt động viết nhật ký</p>
                  </div>
                </div>
                <BarChart data={barData} />
              </div>
            </motion.div>
          )}

          {activeTab === "trend" && (
            <motion.div
              key="trend"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-[#E1EBC8]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-50 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2D5A27]">Xu hướng cảm xúc theo tuần</h3>
                    <p className="text-xs text-gray-500">Theo dõi sự thay đổi cảm xúc của cả lớp</p>
                  </div>
                </div>
                <LineChart data={trendData} />
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {Object.entries(EMOTION_CONFIG).map(([key, cfg]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-1 rounded-full" style={{ backgroundColor: cfg.color }} />
                      <span className="text-gray-600">{cfg.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insight cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {(() => {
                  const positive = (emotionCounts["hao-hung"] || 0) + (emotionCounts["vui"] || 0);
                  const neutral = emotionCounts["binh-thuong"] || 0;
                  const negative = (emotionCounts["lo-lang"] || 0) + (emotionCounts["buon"] || 0);
                  return [
                    { label: "Tích cực", value: positive, icon: Smile, color: "#10B981", desc: "Hào hứng + Vui vẻ" },
                    { label: "Trung lập", value: neutral, icon: Meh, color: "#3B82F6", desc: "Bình thường" },
                    { label: "Cần quan tâm", value: negative, icon: Frown, color: "#EF4444", desc: "Lo lắng + Buồn" },
                  ];
                })().map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-[#E1EBC8] text-center"
                  >
                    <item.icon className="w-8 h-8 mx-auto mb-2" style={{ color: item.color }} />
                    <p className="text-2xl font-bold" style={{ color: item.color }}>{item.value} bài</p>
                    <p className="font-semibold text-gray-700">{item.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "students" && (
            <motion.div
              key="students"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-[#E1EBC8]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-50 rounded-xl">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2D5A27]">Bảng xếp hạng học sinh tích cực</h3>
                    <p className="text-xs text-gray-500">Sắp xếp theo số lần ghi nhật ký</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {leaderboard.map((student, i) => {
                    const isTop3 = i < 3;
                    const medals = ["🥇", "🥈", "🥉"];
                    const studentRecords = records.filter((r) => r.fullName === student.name);
                    const mainEmotion = studentRecords.reduce<Record<string, number>>((acc, r) => {
                      acc[r.emotion] = (acc[r.emotion] || 0) + 1;
                      return acc;
                    }, {});
                    const topEmotion = Object.entries(mainEmotion).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] || "";

                    return (
                      <motion.div
                        key={student.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                          isTop3
                            ? "bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200"
                            : "bg-gray-50 border border-gray-100"
                        }`}
                      >
                        <div className="w-10 text-center">
                          {isTop3 ? (
                            <span className="text-2xl">{medals[i]}</span>
                          ) : (
                            <span className="text-lg font-bold text-gray-400">#{student.rank}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-bold ${isTop3 ? "text-[#2D5A27]" : "text-gray-700"}`}>{student.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {topEmotion && (
                              <span
                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{
                                  backgroundColor: EMOTION_CONFIG[topEmotion]?.bgColor || "#f3f4f6",
                                  color: EMOTION_CONFIG[topEmotion]?.color || "#6b7280",
                                }}
                              >
                                {EMOTION_CONFIG[topEmotion]?.label || topEmotion}
                              </span>
                            )}
                            <span className="text-xs text-gray-400">chủ yếu</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${isTop3 ? "text-[#6B8E23]" : "text-gray-600"}`}>{student.count}</p>
                          <p className="text-xs text-gray-400">bài ghi</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "compare" && (
            <motion.div
              key="compare"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-[#E1EBC8]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-xl">
                      <UserCheck className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2D5A27]">Tiến bộ học sinh</h3>
                      <p className="text-xs text-gray-500">Theo dõi sự phát triển từng em</p>
                    </div>
                  </div>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="px-4 py-2 rounded-xl border border-[#E1EBC8] bg-white text-sm font-medium focus:border-[#6B8E23] outline-none"
                  >
                    <option value="all">Chọn học sinh...</option>
                    {allStudents.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {compareStudent && studentWeeklyEmotions.length > 0 ? (
                  <div className="space-y-4">
                    {/* Timeline */}
                    <div className="relative">
                      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#E1EBC8]" />
                      {studentWeeklyEmotions.map((r, i) => {
                        const emoCfg = EMOTION_CONFIG[r.emotion];
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative flex gap-4 mb-4 pl-12"
                          >
                            <div
                              className="absolute left-3 top-3 w-5 h-5 rounded-full border-2 border-white shadow-sm"
                              style={{ backgroundColor: emoCfg?.color || "#9CA3AF" }}
                            />
                            <div className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-[#2D5A27]">Tuần {r.week}</span>
                                <span
                                  className="text-xs px-2 py-1 rounded-full font-medium"
                                  style={{ backgroundColor: emoCfg?.bgColor, color: emoCfg?.color }}
                                >
                                  {emoCfg?.label || r.emotion}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                {r.didWell && <p><span className="text-gray-400">⭐ Làm tốt:</span> {r.didWell}</p>}
                                {r.goalImprove && <p><span className="text-gray-400">🚀 Mục tiêu:</span> {r.goalImprove}</p>}
                                {r.needTry && <p><span className="text-gray-400">📌 Cần cố gắng:</span> {r.needTry}</p>}
                                {r.memorableMoment && <p><span className="text-gray-400">💖 Khoảnh khắc:</span> {r.memorableMoment}</p>}
                              </div>
                              {r.messageToSelf && (
                                <p className="mt-2 text-sm italic text-purple-600 bg-purple-50 px-3 py-1 rounded-lg">
                                  ✨ "{r.messageToSelf}"
                                </p>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      <div className="bg-green-50 p-4 rounded-2xl text-center border border-green-100">
                        <p className="text-2xl font-bold text-green-600">{studentWeeklyEmotions.length}</p>
                        <p className="text-xs text-green-600">bài ghi</p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-2xl text-center border border-amber-100">
                        <p className="text-2xl font-bold text-amber-600">
                          {studentWeeklyEmotions.filter(r => r.emotion === "hao-hung" || r.emotion === "vui").length}
                        </p>
                        <p className="text-xs text-amber-600">tuần tích cực</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-2xl text-center border border-blue-100 col-span-2 sm:col-span-1">
                        <p className="text-2xl font-bold text-blue-600">
                          {Math.round(studentWeeklyEmotions.filter(r => r.emotion === "hao-hung" || r.emotion === "vui").length / studentWeeklyEmotions.length * 100)}%
                        </p>
                        <p className="text-xs text-blue-600">tỷ lệ tích cực</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Chọn một học sinh để xem tiến bộ</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "data" && (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-sm border border-[#E1EBC8]">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-xl">
                      <Table2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#2D5A27]">Dữ liệu chi tiết</h3>
                      <p className="text-xs text-gray-500">{records.length} bài ghi nhật ký</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {records.map((r, i) => (
                    <div key={i} className="border border-[#E1EBC8] rounded-2xl overflow-hidden">
                      <button
                        onClick={() => setExpandedRow(expandedRow === i ? null : i)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-[#F9FBF2] transition-colors text-left"
                      >
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: EMOTION_CONFIG[r.emotion]?.color || "#9CA3AF" }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#2D5A27] truncate">{r.fullName}</p>
                          <p className="text-xs text-gray-400">Tuần {r.week} • {EMOTION_CONFIG[r.emotion]?.label || r.emotion}</p>
                        </div>
                        <div className="text-xs text-gray-400 hidden sm:block">
                          {new Date(r.timestamp).toLocaleDateString("vi-VN")}
                        </div>
                        {expandedRow === i ? (
                          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                        )}
                      </button>

                      <AnimatePresence>
                        {expandedRow === i && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 pt-0 space-y-3 text-sm">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                  { icon: "🌈", label: "Điều vui", value: r.happyThing },
                                  { icon: "💭", label: "Suy nghĩ", value: r.thinkingThing },
                                  { icon: "💌", label: "Muốn nói", value: r.neverSaidBefore },
                                  { icon: "🚀", label: "Mục tiêu", value: r.goalImprove },
                                  { icon: "🛠️", label: "Hành động", value: r.goalAction },
                                  { icon: "⭐", label: "Làm tốt", value: r.didWell },
                                  { icon: "📌", label: "Cần cố gắng", value: r.needTry },
                                  { icon: "💖", label: "Khoảnh khắc", value: r.memorableMoment },
                                ].filter(item => item.value).map((item) => (
                                  <div key={item.label} className="bg-[#F9FBF2] p-3 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-1">{item.icon} {item.label}</p>
                                    <p className="text-gray-700">{item.value}</p>
                                  </div>
                                ))}
                              </div>
                              {r.messageToSelf && (
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-100">
                                  <p className="text-xs text-purple-500 mb-1">✨ Lời nhắn cho bản thân</p>
                                  <p className="text-purple-700 font-medium italic">"{r.messageToSelf}"</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="text-center text-[#6B8E23] py-8 opacity-60 text-sm">
          <p>Dashboard Giáo viên • Nhật ký Trưởng thành © 2026</p>
        </footer>
      </div>
    </div>
  );
}
