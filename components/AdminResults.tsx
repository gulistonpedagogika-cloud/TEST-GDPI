
import React, { useState } from 'react';
import { TestResult } from '../types.ts';

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
      doc.setFontSize(14);
      doc.text("Natijalar Hisoboti", 14, 20);
      const tableColumn = ["Sana", "Talaba", "Guruh", "Fan", "Ball", "%"];
      const tableRows = filteredResults.map(result => [
        new Date(result.date).toLocaleDateString(),
        result.studentName,
        result.group,
        result.subjectName,
        `${result.score}/${result.total}`,
        `${Math.round((result.score / result.total) * 100)}%`
      ]);
      // @ts-ignore
      doc.autoTable({ head: [tableColumn], body: tableRows, startY: 25, theme: 'grid', styles: { fontSize: 7 } });
      doc.save(`natijalar_${Date.now()}.pdf`);
    } catch (e) { alert("Xato!"); }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4 no-print">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"><i className="fas fa-arrow-left text-xs"></i></button>
          <div>
            <h1 className="text-base font-black text-gray-900 leading-none uppercase tracking-tight">Natijalar</h1>
            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5 block">Jami {results.length} ta yozuv</span>
          </div>
        </div>
        <button onClick={exportToPDF} className="px-3 py-1.5 bg-indigo-600 text-white text-[9px] font-black rounded-lg shadow uppercase tracking-widest">PDF Yuklash</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-3 border-b border-gray-50 no-print flex justify-between items-center">
          <div className="relative max-w-[200px] w-full">
            <i className="fas fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 text-[10px]"></i>
            <input 
              type="text" 
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-3 py-1.5 bg-gray-50/50 border-none rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-[10px] font-medium"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px]">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-3 py-2 font-black text-gray-400 uppercase tracking-widest">Sana</th>
                <th className="px-3 py-2 font-black text-gray-400 uppercase tracking-widest">Talaba</th>
                <th className="px-3 py-2 font-black text-gray-400 uppercase tracking-widest">Guruh</th>
                <th className="px-3 py-2 font-black text-gray-400 uppercase tracking-widest">Fan</th>
                <th className="px-3 py-2 font-black text-gray-400 uppercase tracking-widest">Ball</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50/20 transition-colors">
                  <td className="px-3 py-2 text-gray-400 font-medium">{new Date(result.date).toLocaleDateString()}</td>
                  <td className="px-3 py-2 font-bold text-gray-800 truncate max-w-[120px]">{result.studentName}</td>
                  <td className="px-3 py-2 font-bold text-indigo-500">{result.group}</td>
                  <td className="px-3 py-2 text-gray-600 truncate max-w-[150px]">{result.subjectName}</td>
                  <td className="px-3 py-2">
                    <span className="font-black text-gray-900">{result.score}/{result.total}</span>
                    <span className="ml-1.5 text-[7px] px-1 py-0.5 rounded bg-indigo-50 text-indigo-600 font-black">
                      {Math.round((result.score / result.total) * 100)}%
                    </span>
                  </td>
                </tr>
              ))}
              {filteredResults.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-10 text-center text-gray-300 font-bold uppercase tracking-widest">Natijalar topilmadi</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminResults;
