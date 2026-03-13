import { prisma } from "@/lib/prisma";
import { 
  Activity, Droplet, User, Phone, Pill, 
 HeartPulse, ShieldAlert, MapPin, IdCard, 
  ChevronLeft , BookHeart
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default async function EmergencyProfilePage({ params }: { params: Promise<{ qrToken: string }> }) {
  
  const resolvedParams = await params;
  const qrToken = resolvedParams.qrToken;

  if (!qrToken) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold bg-slate-50">
        ไม่พบรหัสคิวอาร์โค้ด
      </div>
    );
  }

  // ค้นหาข้อมูลผู้ป่วยจาก Database
  const patient = await prisma.patient.findUnique({
    where: { qrToken: qrToken },
  });

  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert size={64} className="text-slate-300 mb-4" />
        <h1 className="text-2xl font-black text-slate-700 mb-2">ไม่พบข้อมูลผู้ป่วย</h1>
        <p className="text-slate-500 mb-6">คิวอาร์โค้ดนี้อาจถูกยกเลิก หรือไม่มีอยู่ในระบบ Careequal</p>
        <Link href="/dashboard" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2">
          <ChevronLeft size={20} /> กลับสู่แดชบอร์ด
        </Link>
      </div>
    );
  }

  const hasAllergies = patient.allergies && patient.allergies !== "ปฏิเสธการแพ้ยา" && patient.allergies !== "-" && patient.allergies !== "";

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-12 relative">
      
      {/* 🔙 ปุ่มย้อนกลับ */}
      <Link 
        href="/dashboard" 
        className="absolute top-6 left-4 z-30 flex items-center gap-1 bg-black/20 hover:bg-black/30 backdrop-blur-md text-white px-3 py-2 rounded-2xl transition-all active:scale-95 border border-white/20"
      >
        <ChevronLeft size={20} />
        <span className="text-sm font-bold hidden md:inline">ย้อนกลับ</span>
      </Link>

      {/* 🟦 Header ส่วนบน: จัด Layout ใหม่ให้รองรับจอใหญ่และสมดุลบนมือถือ */}
      <div className="bg-emerald-500 w-full pt-20 md:pt-16 pb-28 md:pb-36 px-4 md:px-12 rounded-b-[3rem] md:rounded-b-[5rem] shadow-lg relative overflow-hidden flex justify-center">
        {/* แสงวงกลมตกแต่ง */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl pointer-events-none" />
        
        <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-between relative z-10">
          
          {/* 📱 โลโก้สำหรับมือถือ (แสดงเฉพาะจอมือถือ จัดให้อยู่ตรงกลางบนสุด) */}
          <div className="flex md:hidden w-full justify-center mb-6">
             <img className="h-30 w-auto object-contain opacity-90 drop-shadow-sm" src="/logo/logo6.png" alt="CareEqual Logo" />
          </div>

          {/* ข้อมูลโปรไฟล์ (ซ้ายบนจอใหญ่ / กลางบนมือถือ) */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 md:mt-8">
            {/* รูปโปรไฟล์ */}
            {patient.imageUrl ? (
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden bg-white shrink-0">
                <img src={patient.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] border-4 border-white/30 bg-red-700 flex items-center justify-center shrink-0 shadow-inner">
                <User size={60} className="text-red-200" />
              </div>
            )}

            {/* ชื่อและรหัส */}
            <div className="text-center md:text-left flex flex-col justify-center mt-2 md:mt-4">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-wide uppercase text-white drop-shadow-md text-balance">
                {patient.fullName}
              </h1>
              <div className="mt-3 flex justify-center md:justify-start">
                <p className="text-red-100 font-bold flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-full text-sm shadow-inner backdrop-blur-sm">
                  <IdCard size={18}/> {patient.idCard}
                </p>
              </div>
            </div>
          </div>

          {/* 💻 โลโก้สำหรับจอใหญ่ (แสดงเฉพาะจอใหญ่ อยู่ขวามือ) */}
          <div className="hidden md:flex flex-col items-end shrink-0">
             <img className="h-24 lg:h-40 w-auto object-contain drop-shadow-lg" src="/logo/logo6.png" alt="CareEqual Logo" />
          </div>

        </div>
      </div>

      {/* 📦 Main Content: ปรับเป็น Grid System สำหรับ Responsive */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 md:-mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          
          {/* 🟥 กรุ๊ปเลือด และ อายุ */}
          <div className="md:col-span-5 lg:col-span-4 grid grid-cols-2 gap-4">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden hover:shadow-2xl transition-shadow">
              <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
                <Droplet size={32} className="text-red-600 mb-2" fill="currentColor" />
                <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">กรุ๊ปเลือด</p>
                <p className="text-3xl md:text-4xl font-black text-red-600 mt-1">{patient.bloodType || "-"}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden hover:shadow-2xl transition-shadow">
              <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
                <Activity size={32} className="text-blue-500 mb-2" />
                <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">อายุ / เพศ</p>
                <p className="text-xl md:text-2xl font-black text-slate-800 mt-2">{patient.age} ปี<br/><span className="text-lg text-slate-500">{patient.gender}</span></p>
              </CardContent>
            </Card>
          </div>

          {/* 🚨 ข้อมูลแพ้ยา */}
          <Card className={`md:col-span-7 lg:col-span-8 border-none shadow-xl rounded-[2.5rem] overflow-hidden flex flex-col justify-center ${hasAllergies ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}`}>
            <CardContent className="p-6 md:p-8 flex flex-col justify-center h-full">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert size={26} />
                <h3 className="font-black text-sm md:text-base uppercase tracking-wider opacity-90">ประวัติแพ้ยา (Allergies)</h3>
              </div>
              <p className="text-2xl md:text-3xl lg:text-4xl font-black leading-snug py-2 md:py-0">
                {patient.allergies || "ไม่พบข้อมูล"}
              </p>
            </CardContent>
          </Card>

          {/* 🏥 รายละเอียดการแพทย์ */}
          <Card className="md:col-span-6 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardContent className="p-7 space-y-6">
              <div className="flex gap-4">
                <div className="p-3 md:p-4 bg-orange-50 text-orange-500 rounded-2xl h-fit shadow-sm"><Activity size={24} /></div>
                <div>
                  <h3 className="font-black text-[11px] md:text-xs text-slate-400 uppercase tracking-widest mb-1">โรคประจำตัว</h3>
                  <p className="text-lg md:text-xl font-bold text-slate-800 leading-snug">{patient.underlying || "-"}</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-slate-100 flex gap-4">
                <div className="p-3 md:p-4 bg-blue-50 text-blue-500 rounded-2xl h-fit shadow-sm"><Pill size={24} /></div>
                <div>
                  <h3 className="font-black text-[11px] md:text-xs text-slate-400 uppercase tracking-widest mb-1">ยาที่ใช้ / อุปกรณ์การแพทย์</h3>
                  <p className="text-lg md:text-xl font-bold text-slate-800 leading-snug">{patient.medications || "-"}</p>
                  {patient.medicalDevices && patient.medicalDevices !== "-" && (
                    <div className="mt-3 flex items-center gap-2 text-blue-700 font-bold text-sm bg-blue-50/80 px-4 py-2 rounded-xl w-fit">
                      {patient.medicalDevices}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 📍 ข้อมูลส่วนตัวและที่อยู่ */}
          <Card className="md:col-span-6 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardContent className="p-7 space-y-6">
              <div className="flex gap-4">
                 <div className="p-3 md:p-4 bg-slate-100 text-slate-500 rounded-2xl h-fit"><Phone size={24}/></div>
                 <div>
                    <h4 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">เบอร์โทรศัพท์ผู้ป่วย</h4>
                    <p className="text-xl md:text-2xl font-bold text-slate-800">{patient.phoneNumber || "-"}</p>
                 </div>
              </div>

              <div className="flex gap-4">
                 <div className="p-3 md:p-4 bg-slate-100 text-slate-500 rounded-2xl h-fit"><MapPin size={24}/></div>
                 <div>
                    <h4 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-1">ที่อยู่ปัจจุบัน</h4>
                    <p className="text-sm md:text-base font-bold text-slate-800 leading-relaxed">{patient.address || "-"}</p>
                 </div>
              </div>

              {/* แถว เชื้อชาติ สัญชาติ ศาสนา */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">เชื้อชาติ</p>
                  <p className="text-sm font-black text-slate-700 mt-1">{patient.race || "-"}</p>
                </div>
                <div className="border-x border-slate-200">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">สัญชาติ</p>
                  <p className="text-sm font-black text-slate-700 mt-1">{patient.nationality || "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ศาสนา</p>
                  <p className="text-sm font-black text-slate-700 mt-1">{patient.religion || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 📞 ติดต่อฉุกเฉิน: ปรับให้เต็มพื้นที่เท่าเพื่อนๆ */}
          <Card className="md:col-span-12 border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden border-4 border-blue-50 mt-2">
            <CardContent className="p-6 md:p-8">
              <div className="flex items-center gap-2 mb-5 text-blue-600 justify-center">
                <HeartPulse size={28} className="animate-pulse" /> 
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight">Emergency Contact</h3>
              </div>
              <div className="bg-blue-600 p-6 md:p-8 rounded-[2rem] text-center shadow-inner">
                <p className="text-xs md:text-sm font-bold text-blue-200 mb-1 uppercase tracking-widest">บุคคลที่ติดต่อได้ทันที</p>
                <p className="text-2xl md:text-4xl font-black text-white mb-6 md:mb-8">{patient.emergencyContactName}</p>
                
                <a 
                  href={`tel:${patient.emergencyContactPhone}`} 
                  className="w-full bg-white text-blue-600 flex items-center justify-center gap-3 py-5 md:py-6 rounded-[1.5rem] font-black text-2xl md:text-3xl shadow-xl hover:bg-blue-50 hover:shadow-2xl transition-all active:scale-95"
                >
                  <Phone size={28} fill="currentColor" />
                  {patient.emergencyContactPhone}
                </a>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Footer */}
        <div className="text-center pt-12 pb-4">
           <div className="flex items-center justify-center gap-4 mb-2 opacity-50">
              <div className="h-px w-12 bg-slate-400"></div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">CareEqual</p>
              <div className="h-px w-12 bg-slate-400"></div>
           </div>
        </div>
      </div>
    </div>
  );
}