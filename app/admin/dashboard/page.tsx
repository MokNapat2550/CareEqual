'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllPatients, getAllStaff, deletePatient } from "@/app/actions/admin";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // 🟢 เพิ่ม Tabs
import { Button } from "@/components/ui/button";
import { 
  Users, Search, Trash2, Eye, Database, LogOut, 
  Loader2, IdCard, Droplet, UserCheck, Stethoscope, Truck 
} from "lucide-react";
import { toast } from "sonner";

interface PatientData {
  id: string;
  fullName: string;
  idCard: string;
  bloodType: string;
  phoneNumber?: string | null;
  qrToken: string;
}

interface StaffData {
  id: string;
  fullName: string;
  username: string;
  role: string;
  createdAt: Date;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const access = localStorage.getItem("admin_access");
    if (!access) {
      router.push("/admin");
      return;
    }

    async function fetchData() {
      const resP = await getAllPatients();
      const resS = await getAllStaff();
      if (resP.success) setPatients(resP.data as PatientData[]);
      if (resS.success) setStaff(resS.data as StaffData[]);
      setIsLoading(false);
    }
    fetchData();
  }, [router]);

  // กรองข้อมูลตามการค้นหา
  const filteredPatients = patients.filter(p => p.fullName.includes(search) || p.idCard.includes(search));
  const filteredStaff = staff.filter(s => s.fullName.includes(search) || s.username.includes(search));

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600" size={48} /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* 🧭 Navbar */}
      <nav className="bg-[#0F172A] text-white h-20 sticky top-0 z-50 px-6 md:px-12 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <Database className="text-blue-400" size={24} />
          <h1 className="font-black text-lg uppercase tracking-wider">Careequal Super Admin</h1>
        </div>
        <button onClick={() => { localStorage.clear(); router.push("/admin"); }} className="p-3 text-slate-400 hover:text-red-500 transition-all">
          <LogOut size={22} />
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-10">
        
        {/* 📊 Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8 flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><Users size={32} /></div>
            <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest">ผู้ป่วยในระบบ</p><h3 className="text-4xl font-black text-slate-800">{patients.length}</h3></div>
          </Card>
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-8 flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><UserCheck size={32} /></div>
            <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest">เจ้าหน้าที่ทั้งหมด</p><h3 className="text-4xl font-black text-slate-800">{staff.length}</h3></div>
          </Card>
        </div>

        {/* 📋 Main Database Section */}
        <Tabs defaultValue="patients" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <TabsList className="bg-slate-200/50 p-1.5 rounded-2xl h-14 w-full md:w-fit shadow-inner">
              <TabsTrigger value="patients" className="px-8 rounded-xl font-black text-sm data-[state=active]:bg-white data-[state=active]:text-blue-600">จัดการผู้ป่วย</TabsTrigger>
              <TabsTrigger value="staff" className="px-8 rounded-xl font-black text-sm data-[state=active]:bg-white data-[state=active]:text-emerald-600">จัดการเจ้าหน้าที่</TabsTrigger>
            </TabsList>

            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={18} />
              <input 
                type="text" 
                placeholder="ค้นหาชื่อหรือรหัส..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-14 bg-white border-none rounded-2xl pl-12 pr-4 shadow-xl shadow-slate-200/50 outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm"
              />
            </div>
          </div>

          {/* --- 🏥 ตารางผู้ป่วย --- */}
          <TabsContent value="patients">
            <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-none h-16">
                    <TableHead className="pl-10 font-black text-slate-400 uppercase text-[10px]">รายชื่อผู้ป่วย</TableHead>
                    <TableHead className="font-black text-slate-400 uppercase text-[10px]">เลขบัตรประชาชน</TableHead>
                    <TableHead className="font-black text-slate-400 uppercase text-[10px]">กรุ๊ปเลือด</TableHead>
                    <TableHead className="text-right pr-10 font-black text-slate-400 uppercase text-[10px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((p) => (
                    <TableRow key={p.id} className="hover:bg-blue-50/40 border-slate-50">
                      <TableCell className="pl-10 py-6 font-black text-slate-700">{p.fullName}</TableCell>
                      <TableCell className="font-mono text-slate-500 font-bold">{p.idCard}</TableCell>
                      <TableCell><span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-xs font-black">{p.bloodType}</span></TableCell>
                      <TableCell className="text-right pr-10">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/scan/${p.qrToken}`)}><Eye size={18} /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* --- 🛡️ ตารางเจ้าหน้าที่ --- */}
          <TabsContent value="staff">
            <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="border-none h-16">
                    <TableHead className="pl-10 font-black text-slate-400 uppercase text-[10px]">ชื่อเจ้าหน้าที่</TableHead>
                    <TableHead className="font-black text-slate-400 uppercase text-[10px]">รหัสประจำตัว</TableHead>
                    <TableHead className="font-black text-slate-400 uppercase text-[10px]">ตำแหน่ง</TableHead>
                    <TableHead className="font-black text-slate-400 uppercase text-[10px]">วันที่ลงทะเบียน</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((s) => (
                    <TableRow key={s.id} className="hover:bg-emerald-50/40 border-slate-50">
                      <TableCell className="pl-10 py-6 font-black text-slate-700">{s.fullName}</TableCell>
                      <TableCell className="font-mono text-slate-500 font-bold uppercase">{s.username}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {s.role === "DOCTOR" && <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1"><Stethoscope size={12}/> แพทย์</div>}
                          {s.role === "RESCUER" && <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1"><Truck size={12}/> กู้ภัย</div>}
                          {s.role === "NURSE" && <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1"><UserCheck size={12}/> พยาบาล</div>}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400 text-xs font-bold">
                        {new Date(s.createdAt).toLocaleDateString('th-TH')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}