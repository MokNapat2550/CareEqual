'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PlusCircle, QrCode, Users, LogOut, Loader2, 
  Printer, ScanLine, Search, ShieldAlert, PhoneCall,
  IdCard, MapPin, UserIcon, ChevronLeft, HeartPulse,
  Globe2, BookOpen, Activity, Droplet
} from "lucide-react";
import { getRecentPatients, getPatientByIdCard } from "@/app/actions/patient";
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// 🟢 Interface ข้อมูลผู้ป่วย
interface PatientData {
  id: string;
  fullName: string;
  idCard: string;
  age: number;
  gender: string;
  bloodType: string;
  allergies: string | null;
  underlying: string | null;
  medications: string | null;
  medicalDevices: string | null;
  emergencyContactName: string;
  emergencyContactPhone: string;
  qrToken: string;
  phoneNumber?: string | null;
  address?: string | null;
  race?: string | null;
  nationality?: string | null;
  religion?: string | null;
  imageUrl?: string | null; 
}

export default function DashboardPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>(""); 
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [viewMode, setViewMode] = useState<'qr' | 'details'>('qr'); 
  const [searchIdCard, setSearchIdCard] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    async function fetchData() {
      const userString = localStorage.getItem("user");
      if (!userString) {
        router.push("/login");
        return;
      }
      try {
        const currentUser = JSON.parse(userString);
        const role = String(currentUser.role || currentUser.Role || "").toLowerCase().trim();
        setUserRole(role); 
        const isUserRescuer = role === "rescuer" || role === "rescue" || role === "กู้ภัย";
        if (!isUserRescuer) {
          const result = await getRecentPatients(currentUser.id);
          if (result.success && result.data) {
            setPatients(result.data as PatientData[]);
          }
        }
      } catch (e) {
        console.error("Fetch Error:", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [router]);

  const isRescuer = userRole === "rescuer" || userRole === "rescue" || userRole === "กู้ภัย";

  const handleSearch = async () => {
    if (searchIdCard.length < 13) {
      setSearchError("กรุณากรอกให้ครบ 13 หลัก");
      return;
    }
    setIsSearching(true);
    setSearchError("");
    try {
      const userString = localStorage.getItem("user");
      const currentUser = JSON.parse(userString || "{}");
      const result = await getPatientByIdCard(searchIdCard, currentUser.id);
      if (result.success && result.data) {
        setSelectedPatient(result.data as PatientData);
        setViewMode('details'); 
        setSearchIdCard("");
      } else {
        setSearchError(result.error || "ไม่พบข้อมูล");
      }
    } catch (e) {
      setSearchError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsSearching(false);
    }
  };

  const handlePrint = () => {
    if (!selectedPatient) return;
    const qrElement = document.getElementById("qr-svg-container")?.innerHTML;
    const printWindow = window.open('', '_blank');
    if (printWindow && qrElement) {
      printWindow.document.write(`
        <html>
        <head>
          <title>พิมพ์การ์ดฉุกเฉิน - ${selectedPatient.fullName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700;800&display=swap');
            body { font-family: 'Sarabun', sans-serif; text-align: center; padding: 40px; background: #f8fafc; color: #1e293b; }
            .card { background: white; border: 2px solid #e2e8f0; padding: 30px; border-radius: 30px; display: inline-block; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); max-width: 400px; width: 100%; border-top: 8px solid #2563eb; }
            h1 { color: #2563eb; margin: 0; font-size: 28px; font-weight: 800; }
            h2 { color: #0f172a; margin: 10px 0 20px; font-size: 22px; font-weight: 800; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; }
            .qr-box { margin: 20px auto; padding: 20px; background: white; border: 2px dashed #cbd5e1; border-radius: 20px; display: inline-block; }
            .info { text-align: left; margin-top: 20px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #f1f5f9; padding-bottom: 5px; }
            .label { font-weight: bold; color: #64748b; font-size: 14px; }
            .value { font-weight: 800; color: #1e293b; font-size: 16px; }
            .alert { color: #ef4444; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Careequal</h1>
            <h2>${selectedPatient.fullName}</h2>
            <div class="qr-box">${qrElement}</div>
            <div class="info">
              <div class="item"><span class="label">กรุ๊ปเลือด</span><span class="value" style="color:#ef4444">${selectedPatient.bloodType || '-'}</span></div>
              <div class="item"><span class="label">โรคประจำตัว</span><span class="value">${selectedPatient.underlying || '-'}</span></div>
              <div class="item"><span class="label">แพ้ยา</span><span class="value alert">${selectedPatient.allergies || '-'}</span></div>
              <div class="item"><span class="label">ติดต่อฉุกเฉิน</span><span class="value">${selectedPatient.emergencyContactPhone}</span></div>
            </div>
          </div>
          <script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); }</script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="animate-spin text-blue-500" size={40} /></div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans overflow-x-hidden">
     
      {/* 🧭 Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center relative">
          <div className="flex items-center z-20">
            <Link href="/" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
              <ChevronLeft size={24} />
            </Link>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img className="h-26 w-auto object-contain pointer-events-auto" src="/logo/logo.png" alt="CareEqual Logo" />
          </div>
          <div className="flex items-center gap-4 z-20">
            {isRescuer && (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest hidden md:inline-block">โหมดกู้ภัย</span>
            )}
            <Button variant="ghost" size="icon" onClick={() => { localStorage.clear(); router.push("/login"); }} className="text-slate-400 hover:text-red-500 rounded-full transition-colors">
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {isRescuer ? 'Dashboard ของกู้ภัย' : 'Dashboard ของเจ้าหน้าที่'}
            </h1>
            <p className="text-slate-500 font-medium mt-1">ระบบจัดการข้อมูลเพื่อความเท่าเทียมทางการแพทย์</p>
          </div>
          {!isRescuer && (
            <Link href="dashboard/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-12 px-6 shadow-lg shadow-blue-200 flex gap-2 font-bold transition-all active:scale-95">
                <PlusCircle size={20} /> ลงทะเบียนผู้ป่วย
              </Button>
            </Link>
          )}
        </div>

        {/* ⚡ Quick Actions */}
        <div className={`grid grid-cols-1 gap-6 mb-10 ${isRescuer ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-3'}`}>
          {!isRescuer && (
            <Card className="border-none shadow-sm rounded-3xl bg-white">
              <CardContent className="p-6 flex items-center gap-4 h-full">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Users size={28} />
                </div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ลงทะเบียนแล้ว</p><h3 className="text-2xl font-black text-slate-800">{patients.length} คน</h3></div>
              </CardContent>
            </Card>
          )}

          <Link href="/dashboard/scan" className="group">
            <Card className="h-full border-none shadow-sm rounded-3xl bg-white group-hover:ring-2 group-hover:ring-emerald-500/20 transition-all cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><ScanLine size={28} /></div>
                <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">สแกนกล้อง</p><h3 className="text-xl font-black text-slate-800 group-hover:text-emerald-700">สแกน QR Code</h3></div>
              </CardContent>
            </Card>
          </Link>

          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6 h-full flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3"><IdCard size={20} className="text-blue-600" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ค้นหาด้วยเลขบัตรประชาชน</p></div>
              <div className="relative">
                <input type="text" maxLength={13} value={searchIdCard} onChange={(e) => setSearchIdCard(e.target.value.replace(/\D/g, ""))} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="กรอกเลข 13 หลัก" className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl h-11 pl-4 pr-12 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold" />
                <button onClick={handleSearch} disabled={isSearching} className="absolute right-1.5 top-1.5 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">{isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}</button>
              </div>
              {searchError && <p className="text-[10px] text-red-500 mt-2 font-bold flex items-center gap-1"><ShieldAlert size={12}/> {searchError}</p>}
            </CardContent>
          </Card>
        </div>

        {/* 📜 รายชื่อผู้ป่วย */}
        {!isRescuer && (
          <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="px-8 py-6 border-b border-slate-50"><CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2"><BookOpen size={20} className="text-blue-500" /> ประวัติการออกรหัสล่าสุด</CardTitle></CardHeader>
            <CardContent className="p-0">
              {patients.length === 0 ? <div className="p-20 text-center text-slate-400 font-bold">ยังไม่มีข้อมูลผู้ป่วยที่ลงทะเบียน</div> : (
                <div className="divide-y divide-slate-50">
                  {patients.map(p => (
                    <div key={p.id} className="p-6 hover:bg-blue-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                      <div className="flex items-center gap-4">
                        {p.imageUrl ? (
                          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm"><img src={p.imageUrl} alt={p.fullName} className="w-full h-full object-cover" /></div>
                        ) : (
                          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl">{p.fullName[0]}</div>
                        )}
                        <div><p className="font-black text-slate-800 text-lg leading-tight">{p.fullName}</p><p className="text-xs text-slate-400 font-bold mt-1 flex items-center gap-1"><IdCard size={12}/> {p.idCard}</p></div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => { setSelectedPatient(p); setViewMode('qr'); }} variant="outline" className="rounded-xl h-11 px-5 font-bold gap-2"><QrCode size={18} /> ดูคิวอาร์</Button>
                        <Button onClick={() => { setSelectedPatient(p); setViewMode('details'); }} variant="ghost" className="rounded-xl h-11 px-5 font-bold text-slate-500">รายละเอียด</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* 🚀 Patient Modal (QR & Details) */}
      <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <DialogContent className={`bg-white border-none shadow-2xl rounded-[3rem] p-0 overflow-hidden ${viewMode === 'details' ? 'sm:max-w-2xl max-h-[90vh] overflow-y-auto' : 'sm:max-w-sm'}`}>
          {selectedPatient && (
            <div className="flex flex-col">
              <DialogTitle className="sr-only">ข้อมูลผู้ป่วย: {selectedPatient.fullName}</DialogTitle>
              
              {/* --- โหมดแสดง QR Code เท่านั้น --- */}
              {viewMode === 'qr' && (
                <div className="p-8 flex flex-col items-center">
                  <h3 className="text-xl font-black text-slate-800 mb-1">{selectedPatient.fullName}</h3>
                  <div className="p-6 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 my-6">
                    <div id="qr-svg-container" className="bg-white p-4 rounded-3xl shadow-sm">
                      <QRCode 
                        value={`${process.env.NEXT_PUBLIC_BASE_URL}/scan/${selectedPatient.qrToken}`} 
                        size={200} 
                        level="H" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <Button onClick={handlePrint} className="bg-blue-600 h-14 rounded-2xl font-black gap-2 shadow-lg shadow-blue-100"><Printer size={20} /> พิมพ์การ์ด</Button>
                    <Button variant="outline" onClick={() => setViewMode('details')} className="h-14 rounded-2xl font-black">ดูประวัติ</Button>
                  </div>
                </div>
              )}

              {/* --- 🟢 โหมดแสดงข้อมูลสำคัญแบบชัดเจน (พร้อม QR ด้านล่าง) --- */}
              {viewMode === 'details' && (
                <div className="flex flex-col">
                  {/* Header: ส่วนชื่อและรูปถ่าย */}
                  <div className="bg-blue-600 p-8 text-white relative">
                    <div className="flex justify-between items-start gap-4">
                      <div className="z-10">
                        <h3 className="text-3xl font-black mb-2 text-balance leading-tight">{selectedPatient.fullName}</h3>
                        <p className="text-blue-100 text-sm font-bold flex items-center gap-2"><IdCard size={16}/> {selectedPatient.idCard}</p>
                      </div>
                      <div className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
                        {selectedPatient.imageUrl ? <img src={selectedPatient.imageUrl} className="w-full h-full object-cover" /> : <UserIcon size={40} className="m-auto text-blue-200 mt-5" />}
                      </div>
                    </div>
                  </div>

                  {/* ⚡ Highlight Info: กรุ๊ปเลือด / อายุ / เพศ (เน้นให้ชัดเจน) */}
                  <div className="px-8 -mt-8 grid grid-cols-3 gap-3 z-20">
                    <Card className="mt-5 border-none shadow-xl rounded-[2rem] bg-white overflow-hidden text-center p-4">
                      <Droplet size={24} className="text-red-600 mx-auto mb-1" fill="currentColor" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Blood Type</p>
                      <p className="text-2xl font-black text-red-600">{selectedPatient.bloodType || "-"}</p>
                    </Card>
                    <Card className="mt-5 border-none shadow-xl rounded-[2rem] bg-white overflow-hidden text-center p-4">
                      <Activity size={24} className="text-blue-500 mx-auto mb-1" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Age</p>
                      <p className="text-2xl font-black text-slate-800">{selectedPatient.age}</p>
                    </Card>
                    <Card className="mt-5 border-none shadow-xl rounded-[2rem] bg-white overflow-hidden text-center p-4">
                      <UserIcon size={24} className="text-emerald-500 mx-auto mb-1" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Gender</p>
                      <p className="text-xl font-black text-slate-800">{selectedPatient.gender}</p>
                    </Card>
                  </div>

                  {/* Body Content */}
                  <div className="p-8 space-y-6">
                    {/* ข้อมูลแพ้ยา (อันตรายที่สุดต้องชัด) */}
                    <div className={`p-6 rounded-[2rem] border-2 ${selectedPatient.allergies && selectedPatient.allergies !== "ปฏิเสธการแพ้ยา" ? "bg-red-50 border-red-200 text-red-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"}`}>
                      <h4 className="font-black text-xs uppercase mb-1 flex items-center gap-2"><ShieldAlert size={18} /> ประวัติการแพ้ยา / แพ้อาหาร</h4>
                      <p className="text-2xl font-black py-1 leading-tight">{selectedPatient.allergies || "ไม่พบข้อมูล"}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">โรคประจำตัว</p>
                        <p className="font-bold text-slate-800 leading-snug">{selectedPatient.underlying || "-"}</p>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ยาที่ใช้ประจำ</p>
                        <p className="font-bold text-slate-800 leading-snug">{selectedPatient.medications || "-"}</p>
                      </div>
                    </div>

                    {/* ข้อมูลที่อยู่ และเบอร์โทร */}
                    <div className="bg-slate-50 p-6 rounded-[2.5rem] space-y-4 border border-slate-100 shadow-inner">
                      <div className="flex gap-4"><PhoneCall size={18} className="text-blue-500" /><div><p className="text-[10px] font-black text-slate-400 uppercase">เบอร์โทรศัพท์ผู้ป่วย</p><p className="font-bold text-slate-800">{selectedPatient.phoneNumber || "-"}</p></div></div>
                      <div className="flex gap-4"><MapPin size={18} className="text-blue-500" /><div><p className="text-[10px] font-black text-slate-400 uppercase">ที่อยู่ปัจจุบัน</p><p className="text-sm font-bold text-slate-800 leading-relaxed">{selectedPatient.address || "-"}</p></div></div>
                    </div>

                    {/* 📞 ติดต่อฉุกเฉิน (คลิกเพื่อโทรได้เลย) */}
                    <a href={`tel:${selectedPatient.emergencyContactPhone}`} className="block bg-blue-600 p-6 rounded-[2rem] text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 text-center">
                      <p className="text-[10px] font-black uppercase opacity-70 mb-1 tracking-widest">เบอร์ติดต่อฉุกเฉิน</p>
                      <p className="text-xl font-black mb-1">{selectedPatient.emergencyContactName}</p>
                      <p className="text-2xl font-black flex items-center justify-center gap-3"><PhoneCall size={24} fill="currentColor"/> {selectedPatient.emergencyContactPhone}</p>
                    </a>

                    {/* 🏁 ส่วนท้าย: QR Code ประจำตัวผู้ป่วย (พร้อมปุ่มพิมพ์ทันที) */}
                    <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-100 flex flex-col items-center bg-slate-50/50 rounded-[3rem] p-8">
                      <div className="flex items-center gap-2 mb-4 text-slate-400">
                        <QrCode size={20} />
                        <p className="text-xs font-black uppercase tracking-widest">Careequal Patient QR</p>
                      </div>
                      <div id="qr-svg-container" className="bg-white p-5 rounded-3xl shadow-xl border-4 border-white mb-6">
                        <QRCode 
                          value={`${process.env.NEXT_PUBLIC_BASE_URL}/scan/${selectedPatient.qrToken}`} 
                          size={160} 
                          level="H" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 w-full">
                        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 h-14 rounded-2xl font-black text-lg gap-2 shadow-lg shadow-blue-100 flex-1 transition-all active:scale-95">
                          <Printer size={22} /> พิมพ์ข้อมูลการ์ด
                        </Button>
                        <Button variant="ghost" onClick={() => setSelectedPatient(null)} className="h-14 rounded-2xl font-bold text-slate-400 flex-1 hover:bg-slate-100">
                          ปิดหน้าต่าง
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}