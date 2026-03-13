'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Camera, ShieldAlert, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function ScanPage() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  // 🟢 สถานะการสแกน: 'idle' | 'success' | 'error'
  const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    if (isInitializing.current || scanStatus !== 'idle') return;

    const startScanner = async () => {
      const element = document.getElementById("reader");
      if (!element) return;

      isInitializing.current = true;
      try {
        element.innerHTML = '';
        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
          async (decodedText) => {
            // หยุดสแกนชั่วคราว
            if (scannerRef.current?.isScanning) {
              await scannerRef.current.stop();
            }

            // ✅ กรณีที่ 1: QR Code ของระบบ CareEqual (ตรวจจาก /scan/)
            if (decodedText.includes('/scan/')) {
              setScanStatus('success');
              
              // 🛡️ [จุดสำคัญ] ระบบซ่อม URL อัตโนมัติ
              let finalUrl = decodedText;
              
              // ถ้าสแกนเจอ localhost ให้เปลี่ยนเป็น URL ปัจจุบันที่กำลังใช้งาน (Vercel)
              if (finalUrl.includes("localhost:3000")) {
                const currentOrigin = window.location.origin; // จะได้ https://careequalqrcode.vercel.app
                finalUrl = finalUrl.replace("http://localhost:3000", currentOrigin);
                console.log("Redirecting from localhost to:", finalUrl);
              }

              // รอ 1.5 วินาทีเพื่อให้แสดงหน้าจอ Success
              setTimeout(() => {
                window.location.href = finalUrl;
              }, 1500);
            } 
            // ❌ กรณีที่ 2: QR Code ไม่ใช่ของระบบ
            else {
              setScanStatus('error');
              setTimeout(() => {
                setScanStatus('idle');
              }, 2000);
            }
          },
          () => {} 
        );
        setHasPermission(true);
      } catch (err) {
        console.error("Camera error:", err);
        setHasPermission(false);
      } finally {
        isInitializing.current = false;
      }
    };

    const timer = setTimeout(startScanner, 100);
    return () => {
      clearTimeout(timer);
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().then(() => scannerRef.current?.clear()).catch(() => {});
      }
    };
  }, [scanStatus]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="rounded-full bg-white shadow-sm border-slate-200 text-slate-600">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800">สแกนประวัติฉุกเฉิน</h1>
            <p className="text-sm font-medium text-slate-500">CareEqual System</p>
          </div>
        </div>

        <Card className="border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-0 relative bg-black flex flex-col items-center justify-center min-h-[400px]">
            <div id="reader" className="w-full h-full" />
            
            {hasPermission === null && scanStatus === 'idle' && (
              <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-white z-10">
                <Loader2 className="animate-spin mb-4" size={40} />
                <p className="font-bold">กำลังเปิดกล้อง...</p>
              </div>
            )}

            {scanStatus === 'success' && (
              <div className="absolute inset-0 bg-emerald-600 flex flex-col items-center justify-center text-white z-20 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                  <CheckCircle2 size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-black mb-2">สแกนสำเร็จ!</h2>
                <div className="flex items-center gap-2 text-emerald-100">
                  <Loader2 className="animate-spin" size={18} />
                  <p className="font-medium">กำลังเปิดข้อมูลผู้ป่วย...</p>
                </div>
              </div>
            )}

            {scanStatus === 'error' && (
              <div className="absolute inset-0 bg-red-600 flex flex-col items-center justify-center text-white z-20 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                  <XCircle size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-black mb-2">ผิดพลาด!</h2>
                <p className="text-red-100 font-medium text-center px-6">
                  QR Code นี้ไม่ใช่ข้อมูลของระบบ CareEqual
                </p>
                <p className="mt-4 text-xs text-red-200 animate-pulse">กำลังเตรียมสแกนใหม่อีกครั้ง...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-slate-500 text-sm font-medium bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p>จัดให้ QR Code อยู่ในกรอบสี่เหลี่ยม<br/>เพื่อความรวดเร็วในการอ่านข้อมูล</p>
        </div>
      </div>
    </div>
  );
}