
import React, { useState } from 'react';
import { TestResult } from '../types';

interface AdminResultsProps {
  results: TestResult[];
  onBack: () => void;
}

const AdminResults: React.FC<AdminResultsProps> = ({ results, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResults = results.filter(r => 
    r.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.group?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.subjectName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToPDF = () => {
    try {
      // @ts-ignore
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Add Title
      doc.setFontSize(20);
      doc.setTextColor(79, 70, 229); // Indigo 600
      doc.text("TEST GDPI - Natijalar Hisoboti", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Hisobot yaratilgan vaqt: ${new Date().toLocaleString()}`, 14, 30);

      const tableColumn = ["Sana", "Talaba", "Guruh", "Fan", "Ball", "Foiz"];
      const tableRows = filteredResults.map(result => [
        new Date(result.date).toLocaleDateString() + ' ' + new Date(result.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        result.studentName,
        result.group,
        result.subjectName,
        `${result.score} / ${result.total}`,
        `${Math.round((result.score / result.total) * 100)}%`
      ]);

      // @ts-ignore
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        headStyles: { 
          fillColor: [79, 70, 229], 
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: { 
          fontSize: 9,
          textColor: [50, 50, 50]
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251]
        },
        margin: { top: 35 },
      });

      const fileName = `test_natijalari_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("PDF yaratishda xatolik:", error);
      alert("PDF yaratishda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 no-print">
        <div>
          <button 
            onClick={onBack}
            className="mb-4 text-indigo-600 font-bold flex items-center hover:translate-x-[-4px] transition-transform"
          >
            <i className="fas fa-arrow-left mr-2"></i> Orqaga
          </button>
          <h1 className="text-3xl font-black text-gray-900">Talabalar Natijalari</h1>
          <p className="text-gray-500">Bazada jami {results.length} ta natija bor</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={exportToPDF}
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center"
          >
            <i className="fas fa-file-pdf mr-2"></i> PDF Yuklash
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-12">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
          <div className="relative flex-grow max-w-md">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input 
              type="text" 
              placeholder="F.I.O, guruh yoki fanni qidiring..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span> Yaxshi (>= 80%)
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span> Qoniqarli (>= 60%)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left" id="results-table">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Sana</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Talaba</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Guruh</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Fan</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Natija</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Foiz</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredResults.map((result) => {
                const percentage = (result.score / result.total) * 100;
                let colorClass = 'text-red-600 bg-red-50';
                if (percentage >= 80) colorClass = 'text-green-600 bg-green-50';
                else if (percentage >= 60) colorClass = 'text-amber-600 bg-amber-50';

                return (
                  <tr key={result.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(result.date).toLocaleDateString()}<br/>
                      <span className="text-[10px] uppercase font-bold text-gray-300">
                        {new Date(result.date).toLocaleTimeString([], { hour: '2-digit',