import { prisma } from "@/lib/prisma";
import { 
  AlertTriangle, Activity, Droplet, User, Phone, Pill, 
  Stethoscope, HeartPulse, ShieldAlert, MapPin, IdCard, Globe, Info 
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

  // ค้นหาข้อมูลผู้ป่วย
  const patient = await prisma.patient.findUnique({
    where: { qrToken: qrToken },
  });

  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert size={64} className="text-slate-300 mb-4" />
        <h1 className="text-2xl font-black text-slate-700 mb-2">ไม่พบข้อมูลผู้ป่วย</h1>
        <p className="text-slate-500 mb-6">คิวอาร์โค้ดนี้อาจถูกยกเลิก หรือไม่มีอยู่ในระบบ Careequal</p>
        <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200">
          กลับสู่หน้าหลัก
        </Link>
      </div>
    );
  }

  const hasAllergies = patient.allergies && patient.allergies !== "ปฏิเสธการแพ้ยา" && patient.allergies !== "-" && patient.allergies !== "";

  return (
    <div className="min-h-screen bg-slate-100 font-sans pb-12">
      {/* 🟦 ส่วนหัวฉุกเฉิน: ปรับให้โชว์รูปโปรไฟล์ด้วย */}
      <div className="bg-red-600 w-full pt-10 pb-24 px-4 rounded-b-[50px] shadow-lg flex flex-col items-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
        
        <AlertTriangle size={40} className="mb-4 animate-pulse" />
        
        {/* แสดงรูปโปรไฟล์ถ้ามี */}
        {patient.imageUrl ? (
          <div className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden mb-4 bg-white shrink-0">
            <img src={patient.imageUrl} alt="Profile" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-28 h-28 rounded-[2rem] border-4 border-white/30 bg-red-700 flex items-center justify-center mb-4 shrink-0">
            <User size={50} className="text-red-200" />
          </div>
        )}

        <h1 className="text-2xl md:text-3xl font-black tracking-wide text-center uppercase">{patient.fullName}</h1>
        <p className="text-red-100 font-bold mt-1 flex items-center gap-2"><IdCard size={16}/> {patient.idCard}</p>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-12 space-y-4 relative z-10">
        
        {/* 🟥 ข้อมูลวิกฤต: กรุ๊ปเลือด และ อายุ */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <Droplet size={28} className="text-red-600 mb-1" fill="currentColor" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">กรุ๊ปเลือด</p>
              <p className="text-2xl font-black text-red-600">{patient.bloodType || "-"}</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <Activity size={28} className="text-slate-400 mb-1" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">อายุ / เพศ</p>
              <p className="text-xl font-black text-slate-800">{patient.age} ปี / {patient.gender}</p>
            </CardContent>
          </Card>
        </div>

        {/* 🚨 ประวัติการแพ้ยา (เด่นที่สุด) */}
        <Card className={`border-none shadow-xl rounded-[2rem] overflow-hidden ${hasAllergies ? 'bg-red-600 text-white' : 'bg-emerald-500 text-white'}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={22} />
              <h3 className="font-bold text-sm uppercase tracking-wider">ประวัติแพ้ยา (Allergies)</h3>
            </div>
            <p className="text-2xl font-black leading-tight">
              {patient.allergies || "ไม่พบข้อมูล"}
            </p>
          </CardContent>
        </Card>

        {/* 🏥 รายละเอียดการแพทย์ */}
        <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
          <CardContent className="p-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1 text-slate-400">
                <Info size={18} /> <h3 className="font-bold text-[11px] uppercase tracking-widest">โรคประจำตัว (Underlying)</h3>
              </div>
              <p className="text-lg font-bold text-slate-800 leading-tight">{patient.underlying || "-"}</p>
            </div>
            <div className="pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2 mb-1 text-slate-400">
                <Pill size={18} /> <h3 className="font-bold text-[11px] uppercase tracking-widest">ยาที่ใช้ / อุปกรณ์การแพทย์</h3>
              </div>
              <p className="text-lg font-bold text-slate-800 leading-tight">{patient.medications || "-"}</p>
              {patient.medicalDevices && patient.medicalDevices !== "-" && (
                <p className="mt-2 text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg inline-block">
                  อุปกรณ์: {patient.medicalDevices}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 📍 ข้อมูลที่อยู่ และข้อมูลส่วนตัว (ที่ขอเพิ่ม) */}
        <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden">
          <CardContent className="p-6 space-y-5">
            <div className="flex gap-4">
               <div className="p-2.5 bg-slate-50 text-slate-500 rounded-2xl h-fit"><Phone size={20}/></div>
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">เบอร์โทรศัพท์ผู้ป่วย</h4>
                  <p className="text-lg font-bold text-slate-800">{patient.phoneNumber || "-"}</p>
               </div>
            </div>

            <div className="flex gap-4">
               <div className="p-2.5 bg-slate-50 text-slate-500 rounded-2xl h-fit"><MapPin size={20}/></div>
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ที่อยู่ปัจจุบัน</h4>
                  <p className="text-sm font-bold text-slate-800 leading-relaxed">{patient.address || "-"}</p>
               </div>
            </div>

            <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-center">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">เชื้อชาติ</p>
                <p className="text-xs font-black text-slate-700">{patient.race || "-"}</p>
              </div>
              <div className="w-px h-6 bg-slate-100"></div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">สัญชาติ</p>
                <p className="text-xs font-black text-slate-700">{patient.nationality || "-"}</p>
              </div>
              <div className="w-px h-6 bg-slate-100"></div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">ศาสนา</p>
                <p className="text-xs font-black text-slate-700">{patient.religion || "-"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 📞 ติดต่อฉุกเฉิน (ใหญ่และกดง่าย) */}
        <Card className="border-none shadow-xl rounded-[2rem] bg-white overflow-hidden border-2 border-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <HeartPulse size={24} /> 
              <h3 className="text-lg font-black uppercase tracking-tight">Emergency Contact</h3>
            </div>
            <div className="bg-blue-50/50 p-5 rounded-3xl border border-blue-100/50">
              <p className="text-xs font-bold text-blue-400 mb-1 uppercase">ชื่อผู้ติดต่อยามวิกฤต</p>
              <p className="text-xl font-black text-blue-900 mb-4">{patient.emergencyContactName}</p>
              
              <a href={`tel:${patient.emergencyContactPhone}`} className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black text-xl shadow-lg shadow-blue-200 transition-all active:scale-95">
                <Phone size={24} fill="currentColor" />
                โทรด่วน: {patient.emergencyContactPhone}
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="text-center pt-4">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Careequal Central Patient Database</p>
        </div>
      </div>
    </div>
  );
}