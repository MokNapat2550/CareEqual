'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PlusCircle, QrCode, Users, LogOut, Loader2, 
  Printer, ScanLine, Search, ShieldAlert, PhoneCall,
  IdCard, MapPin, UserIcon
} from "lucide-react";
import { getRecentPatients, getPatientByIdCard } from "@/app/actions/patient";
import QRCode from "react-qr-code";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// 🟢 Interface รองรับข้อมูลทั้งหมดรวมถึงรูปภาพและข้อมูลใหม่
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
  const [origin, setOrigin] = useState("");

  const [searchIdCard, setSearchIdCard] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    
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

  // 🌟 ฟังก์ชันการพิมพ์ (อัปเดตเพิ่มข้อมูลใหม่ลงในการ์ด)
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
            body { font-family: 'Sarabun', sans-serif; text-align: center; padding: 40px; background: #f0f2f5; }
            .card { background: white; border: 2px solid #e2e8f0; padding: 30px; border-radius: 20px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); max-width: 450px; width: 100%; }
            h1 { color: #2563eb; margin-bottom: 5px; font-size: 24px; }
            h2 { color: #1e293b; margin-top: 0; font-size: 20px; border-bottom: 2px dashed #e2e8f0; padding-bottom: 15px; }
            .qr-box { margin: 20px auto; padding: 15px; background: white; border: 2px solid #e2e8f0; border-radius: 15px; display: inline-block; }
            .info { text-align: left; margin-top: 20px; background: #f8fafc; padding: 15px; border-radius: 10px; }
            .info p { margin: 6px 0; font-size: 14px; color: #475569; line-height: 1.4; }
            .info strong { color: #0f172a; }
            .alert { color: #ef4444; font-weight: bold; }
            .divider { height: 1px; background: #e2e8f0; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Careequal</h1>
            <h2>${selectedPatient.fullName}</h2>
            <div class="qr-box">${qrElement}</div>
            <p style="color: #64748b; font-size: 14px; margin-bottom: 20px;">สแกนเพื่อดูประวัติการแพทย์ฉุกเฉิน</p>
            <div class="info">
              <p><strong>เบอร์โทรผู้ป่วย:</strong> ${selectedPatient.phoneNumber || '-'}</p>
              <p><strong>ที่อยู่:</strong> ${selectedPatient.address || '-'}</p>
              <p><strong>เชื้อชาติ:</strong> ${selectedPatient.race || '-'} | <strong>สัญชาติ:</strong> ${selectedPatient.nationality || '-'} | <strong>ศาสนา:</strong> ${selectedPatient.religion || '-'}</p>
              <div class="divider"></div>
              <p><strong>กรุ๊ปเลือด:</strong> ${selectedPatient.bloodType || '-'}</p>
              <p><strong>โรคประจำตัว:</strong> ${selectedPatient.underlying || '-'}</p>
              <p class="alert"><strong>แพ้ยา:</strong> ${selectedPatient.allergies || '-'}</p>
              <div class="divider"></div>
              <p><strong>ติดต่อฉุกเฉิน:</strong> ${selectedPatient.emergencyContactPhone} (${selectedPatient.emergencyContactName})</p>
            </div>
          </div>
          <script>
            window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 500); }
          </script>
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
    <div className="min-h-screen bg-[#F8FAFC] pb-12 font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
          <div className="flex items-center ">
             <img className="mt-2 h-27 w-auto object-contain" src="/logo/logo.png" alt="CareEqual Logo" />
          </div>
          <div className="flex items-center gap-4">
            {isRescuer && (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest hidden sm:inline-block">
                โหมดกู้ภัยฉุกเฉิน
              </span>
            )}
            <Button variant="ghost" size="icon" onClick={() => { localStorage.clear(); router.push("/login"); }} className="text-slate-400 hover:text-red-500 rounded-full transition-colors">
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800">
              {isRescuer ? 'แดชบอร์ดกู้ภัยฉุกเฉิน' : 'แดชบอร์ดเจ้าหน้าที่'}
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {isRescuer ? 'ค้นหาหรือสแกนเพื่อดึงข้อมูลผู้ป่วยทันที' : 'จัดการข้อมูลผู้ป่วยและออกรหัสคิวอาร์'}
            </p>
          </div>
          
          {!isRescuer && (
            <Link href="/patient/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-6 shadow-lg shadow-blue-200 flex gap-2 font-bold transition-all active:scale-95">
                <PlusCircle size={20} /> ลงทะเบียนใหม่
              </Button>
            </Link>
          )}
        </div>

        <div className={`grid grid-cols-1 gap-6 mb-8 ${isRescuer ? 'md:grid-cols-2 max-w-3xl mx-auto mt-16 sm:mt-32' : 'md:grid-cols-3'}`}>
          {!isRescuer && (
            <Card className="border-none shadow-sm rounded-2xl bg-white hover:shadow-md transition-shadow h-full">
              <CardContent className="p-6 flex items-center gap-4 h-full">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">การลงทะเบียนผู้ป่วย</p>
                  <h3 className="text-2xl font-black text-slate-800">{patients.length} คน</h3>
                </div>
              </CardContent>
            </Card>
          )}

          <Link href="/dashboard/scan" className="group block h-full outline-none">
            <Card className="h-full shadow-sm rounded-2xl bg-white group-hover:ring-2 group-hover:ring-emerald-500/20 transition-all cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4 h-full">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <ScanLine size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">สแกนกล้อง</p>
                  <h3 className="text-xl font-black text-slate-800 group-hover:text-emerald-700 transition-colors">เปิดเครื่องสแกน</h3>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="h-full border-none shadow-sm rounded-2xl bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-6 h-full flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3">
                <IdCard size={40} className="text-blue-600" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ค้นหาด้วยเลขบัตรประชาชน</p>
              </div>
              <div className="relative group">
                <input 
                  type="text" maxLength={13} value={searchIdCard}
                  onChange={(e) => setSearchIdCard(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="กรอกเลข 13 หลัก"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl h-11 pl-4 pr-12 outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold text-slate-700"
                />
                <button 
                  onClick={handleSearch} 
                  disabled={isSearching || searchIdCard.length < 13} 
                  className="absolute right-1.5 top-1.5 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 disabled:bg-slate-300 transition-colors"
                >
                  {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                </button>
              </div>
              {searchError && <p className="text-xs text-red-500 mt-2 font-bold flex items-center gap-1"><ShieldAlert size={12}/> {searchError}</p>}
            </CardContent>
          </Card>
        </div>

        {!isRescuer && (
          <Card className="border-none shadow-sm rounded-2xl bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-50 px-6 py-5 bg-slate-50/50">
              <CardTitle className="text-md font-bold text-slate-800">ประวัติการออก QR ล่าสุด</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {patients.length === 0 ? (
                <div className="p-16 text-center text-slate-400 font-medium">ยังไม่มีข้อมูลผู้ป่วยที่ลงทะเบียน</div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {patients.map(p => (
                    <div key={p.id} className="p-5 hover:bg-blue-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                      <div className="flex items-center gap-4">
                        {p.imageUrl ? (
                           <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                             <img src={p.imageUrl} alt={p.fullName} className="w-full h-full object-cover" />
                           </div>
                        ) : (
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-lg shadow-inner shrink-0">
                            {p.fullName[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-800 text-base">{p.fullName}</p>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">บัตรประชาชน: {p.idCard}</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          setSelectedPatient(p);
                          setViewMode('qr'); 
                        }} 
                        variant="outline" 
                        className="rounded-xl h-10 px-4 text-sm font-bold gap-2 border-slate-200 hover:bg-white hover:border-blue-500 hover:text-blue-600 shadow-sm w-full sm:w-auto"
                      >
                        <QrCode size={16} /> ดูคิวอาร์โค้ด
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* 🚀 Modal โชว์ข้อมูลผู้ป่วย */}
      <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
        <DialogContent className={`bg-white border-none shadow-2xl rounded-[2rem] p-0 overflow-hidden ${viewMode === 'details' ? 'sm:max-w-2xl max-h-[90vh] overflow-y-auto' : 'sm:max-w-sm'}`}>
          {selectedPatient && (
            <div className="flex flex-col">
              <DialogTitle className="sr-only">ข้อมูลผู้ป่วย: {selectedPatient.fullName}</DialogTitle>
              
              {/* โหมดคิวอาร์โค้ด */}
              {viewMode === 'qr' && (
                <>
                  <div className="bg-blue-600 p-6 text-white text-center relative overflow-hidden">
                    <h3 className="text-xl font-black relative z-10">{selectedPatient.fullName}</h3>
                    <p className="text-blue-200 text-xs font-medium mt-1 relative z-10">ID: {selectedPatient.idCard}</p>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col items-center py-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                      <div id="qr-svg-container" className="bg-white p-3 rounded-2xl shadow-sm">
                        <QRCode value={origin ? `${origin}/scan/${selectedPatient.qrToken}` : ""} size={180} level="H" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={handlePrint} className="flex-1 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl h-12 gap-2 shadow-sm">
                        <Printer size={18} /> พิมพ์การ์ด
                      </Button>
                      <Button variant="ghost" onClick={() => setSelectedPatient(null)} className="w-20 font-bold text-slate-500 rounded-xl h-12 hover:bg-slate-100">ปิด</Button>
                    </div>
                  </div>
                </>
              )}

              {/* 🟢 โหมดรายละเอียด (เมื่อค้นหาเจอ) */}
              {viewMode === 'details' && (
                <>
                  <div className="bg-blue-600 p-6 md:p-8 text-white relative">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-2xl md:text-3xl font-black mb-2">{selectedPatient.fullName}</h3>
                        <p className="text-blue-100 text-sm font-medium flex items-center gap-2 mb-1"><IdCard size={14}/> {selectedPatient.idCard}</p>
                      </div>
                      
                      {selectedPatient.imageUrl ? (
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-white shadow-lg overflow-hidden shrink-0 bg-white">
                          <img src={selectedPatient.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border-4 border-white shadow-lg shrink-0 bg-blue-500 flex items-center justify-center">
                          <UserIcon size={40} className="text-blue-200" />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-6 mt-6 md:mt-8 pt-6 border-t border-blue-500/50">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-1">กรุ๊ปเลือด</span>
                        <span className="text-xl font-black text-white">{selectedPatient.bloodType || "-"}</span>
                      </div>
                      <div className="w-px bg-blue-400/50"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-1">อายุ</span>
                        <span className="text-xl font-black text-white">{selectedPatient.age} ปี</span>
                      </div>
                      <div className="w-px bg-blue-400/50"></div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider mb-1">เพศ</span>
                        <span className="text-xl font-black text-white">{selectedPatient.gender}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 space-y-6">
                    
                    {/* 🌟 แสดงข้อมูลที่อยู่ สัญชาติ ศาสนา เบอร์โทรศัพท์ แบบครบถ้วนจัดเต็ม */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1">
                        <MapPin size={12}/> ข้อมูลพื้นฐาน & ที่ติดต่อ
                      </p>
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="text-xs font-bold text-slate-500 w-24">เบอร์โทรศัพท์:</span>
                          <span className="text-sm font-black text-slate-800">{selectedPatient.phoneNumber || '-'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                          <span className="text-xs font-bold text-slate-500 w-24 pt-0.5">ที่อยู่ปัจจุบัน:</span>
                          <span className="text-sm font-bold text-slate-800 flex-1 leading-relaxed">{selectedPatient.address || '-'}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-slate-200/60 mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">เชื้อชาติ:</span>
                            <span className="text-sm font-bold text-slate-800">{selectedPatient.race || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">สัญชาติ:</span>
                            <span className="text-sm font-bold text-slate-800">{selectedPatient.nationality || '-'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500">ศาสนา:</span>
                            <span className="text-sm font-bold text-slate-800">{selectedPatient.religion || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-2xl border ${selectedPatient.allergies && selectedPatient.allergies !== "ปฏิเสธการแพ้ยา" ? "bg-red-50 border-red-100" : "bg-emerald-50 border-emerald-100"}`}>
                      <div className={`flex items-center gap-2 mb-2 ${selectedPatient.allergies && selectedPatient.allergies !== "ปฏิเสธการแพ้ยา" ? "text-red-600" : "text-emerald-600"}`}>
                        <ShieldAlert size={18} />
                        <h4 className="text-xs font-black uppercase tracking-wide">ประวัติการแพ้ยา</h4>
                      </div>
                      <p className={`text-base font-bold ${selectedPatient.allergies && selectedPatient.allergies !== "ปฏิเสธการแพ้ยา" ? "text-red-700" : "text-emerald-700"}`}>
                        {selectedPatient.allergies || "ไม่พบข้อมูล"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 h-full">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">โรคประจำตัว</p>
                        <p className="text-sm font-bold text-slate-800">{selectedPatient.underlying || "-"}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 h-full">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">ยาที่ใช้ประจำ</p>
                        <p className="text-sm font-bold text-slate-800">{selectedPatient.medications || "-"}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 md:col-span-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">อุปกรณ์การแพทย์ในร่างกาย</p>
                        <p className="text-sm font-bold text-slate-800">{selectedPatient.medicalDevices || "-"}</p>
                      </div>
                    </div>

                    <a href={`tel:${selectedPatient.emergencyContactPhone}`} className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex justify-between items-center hover:bg-blue-100 transition-colors cursor-pointer group">
                      <div>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">ติดต่อฉุกเฉิน</p>
                        <p className="text-sm font-black text-blue-900">{selectedPatient.emergencyContactName}</p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <PhoneCall size={16} className="text-blue-500 group-hover:scale-110 transition-transform" />
                        <p className="text-lg font-black text-blue-600">{selectedPatient.emergencyContactPhone}</p>
                      </div>
                    </a>

                    {/* 🌟 กล่องแสดง QR Code ผู้ป่วยในหน้า Details */}
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mt-6">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1"><QrCode size={14}/> Careequal QR ประจำตัว</p>
                      <div id="qr-svg-container" className="bg-white p-3 rounded-2xl shadow-sm">
                        <QRCode value={origin ? `${origin}/scan/${selectedPatient.qrToken}` : ""} size={140} level="H" />
                      </div>
                    </div>

                    {/* 🚀 ปุ่ม พิมพ์การ์ดฉุกเฉิน และ ปิดหน้าต่าง */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
                      <Button onClick={handlePrint} className="w-full sm:w-2/3 h-14 rounded-2xl font-black text-lg bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95">
                        <Printer size={20} /> พิมพ์การ์ดฉุกเฉิน
                      </Button>
                      <Button variant="ghost" onClick={() => setSelectedPatient(null)} className="w-full sm:w-1/3 h-14 rounded-2xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                        ปิดหน้าต่าง
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}