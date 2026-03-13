'use client';
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ScannerPage() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader", 
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render((decodedText) => {
      scanner.clear();
      window.location.href = decodedText; 
    }, (error) => {});

    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err));
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      <div className="max-w-md mx-auto p-6">
        <BackButton className="text-white hover:text-blue-400 mb-6" />
        <Card className="bg-slate-800 border-slate-700 text-white overflow-hidden">
          <CardHeader className="text-center">
            <CardTitle>เตรียมสแกนคิวอาร์</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div id="reader" className="w-full"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}