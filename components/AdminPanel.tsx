
import React, { useState, useRef } from 'react';
import { Subject, Question } from '../types';

declare const mammoth: any;

interface AdminPanelProps {
  subjects: Subject[];
  addSubject: (subject: Subject) => void;
  deleteSubject: (id: string) => void;
  onGoToResults: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ subjects, addSubject, deleteSubject, onGoToResults }) => {
  const [showForm, setShowForm] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [previewQuestions, setPreviewQuestions] = useState<Question[]>([]);
  const [timeLimit, setTimeLimit] = useState(30);
  const [questionCount, setQuestionCount] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });
        const html = result.value;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const tables = doc.querySelectorAll('table');
        
        let questionsList: Question[] = [];

        tables.forEach(table => {
          const rows = Array.from(table.querySelectorAll('tr'));
          
          // Pattern 1: Horizontal Table (1 row = 1 question with 5+ columns)
          if (rows.length > 0 && rows[0].querySelectorAll('td').length >= 5) {
            rows.forEach((row, idx) => {
              const cols = Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim());
              if (cols[0] && cols.length >= 5) {
                questionsList.push({
                  id: `q-${idx}-${Date.now()}`,
                  text: cols[0],
                  options: cols.slice(1, 5),
                  correctIndex: 0
                });
              }
            });
          } 
          // Pattern 2: Vertical Table (5 rows = 1 question)
          else if (rows.length >= 5) {
            for (let i = 0; i < rows.length; i += 5) {
              if (i + 4 < rows.length) {
                const qText = rows[i].innerText.trim();
                const options = [
                  rows[i+1].innerText.trim(),
                  rows[i+2].innerText.trim(),
                  rows[i+3].innerText.trim(),
                  rows[i+4].innerText.trim()
                ];
                if (qText && options[0]) {
                  questionsList.push({
                    id: `q-v-${i}-${Date.now()}`,
                    text: qText,
                    options: options,
                    correctIndex: 0
                  });
                }
              }
            }
          }
        });

        if (questionsList.length > 0) {
          setPreviewQuestions(questionsList);
          setQuestionCount(Math.min(questionsList.length, 20));
        } else {
          // Fallback text extraction if no tables
          const textResult = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
          const lines = textResult.value.split('\n').filter((l: string) => l.trim());
          const fallbackQs: Question[] = [];
          for (let i = 0; i < lines.length; i += 5) {
            if (i + 4 < lines.length) {
              fallbackQs.push({
                id: `q-f-${i}-${Date.now()}`,
                text: lines[i],
                options: [lines[i+1], lines[i+2], lines[i+3], lines[i+4]],
                correctIndex: 0
              });
            }
          }
          setPreviewQuestions(fallbackQs);
          setQuestionCount(Math.min(fallbackQs.length, 20));
          if (fallbackQs.length === 0) alert("Hech qanday test savollari topilmadi. Word fayl formatini tekshiring.");
        }
      } catch (error) {
        console.error("Faylni o'qishda xatolik:", error);
        alert("Faylni o'qishda xatolik yuz berdi.");
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName || previewQuestions.length === 0) return;

    const newSubject: Subject = {
      id: `subj-${Date.now()}`,
      name: subjectName,
      questions: previewQuestions,
      settings: {
        timeLimitMinutes: timeLimit,
        questionCount: Math.min(questionCount, previewQuestions.length)
      },
      createdAt: Date.now()
    };

    addSubject(newSubject);
    setSubjectName('');
    setPreviewQuestions([]);
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Admin Paneli</h1>
          <p className="text-gray-500">Test bazasini yaratish va boshqarish</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={onGoToResults}
            className="px-5 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-all flex items-center border border-indigo-200"
          >
            <i className="fas fa-list-check mr-2"></i> Natijalar
          </button>
          <button 
            onClick={() => { setShowForm(!showForm); setPreviewQuestions([]); }}
            className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center shadow-lg shadow-indigo-200"
          >
            <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'} mr-2`}></i> {showForm ? 'Bekor qilish' : 'Yangi test yuklash'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-12 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold flex items-center">
              <i className="fas fa-upload text-indigo-500 mr-3"></i> Test Yuklash
            </h2>
          </div>
          
          <form onSubmit={handleAddSubject}>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 mb-2">Fan nomi</label>
                <input 
                  type="text" 
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Masalan: Informatika"
                  required
                />
              </div>

              <div className="md:col-span-2 flex items-end">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full cursor-pointer group flex items-center justify-center p-3 border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 transition-all"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                      <p className="text-indigo-600 font-bold">Fayl tahlil qilinmoqda...</p>
                    </div>
                  ) : (
                    <>
                      <i className="fas fa-file-word text-xl text-indigo-500 mr-3"></i>
                      <p className="text-indigo-900 font-bold">
                        {previewQuestions.length > 0 ? `${previewQuestions.length} ta savol yuklandi` : "Word (.docx) yuklash"}
                      </p>
                    </>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden" 
                    accept=".docx"
                  />
                </div>
              </div>
            </div>

            {previewQuestions.length > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Test Sozlamalari</h3>
                    <div className="text-sm font-bold text-indigo-600 bg-white px-3 py-1 rounded-full shadow-sm">
                      Jami: {previewQuestions.length} ta savol
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Talabaga nechta savol ko'rinsin?
                      </label>
                      <input 
                        type="number" 
                        value={questionCount}
                        onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        max={previewQuestions.length}
                        min="1"
                        required
                      />
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Savollar bazadan random tarzda tanlanadi</p>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Vaqt (daqiqa)</label>
                      <input 
                        type="number" 
                        value={timeLimit}
                        onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Savollar Ko'rinishi (Preview)</h3>
                  <div className="max-h-96 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {previewQuestions.map((q, i) => (
                      <div key={i} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <p className="font-bold text-gray-900 mb-2"><span className="text-indigo-500 mr-2">{i+1}.</span>{q.text}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((opt, idx) => (
                            <div key={idx} className={`text-xs p-2 rounded-lg ${idx === 0 ? 'bg-green-50 text-green-700 border border-green-100 font-bold' : 'bg-gray-50 text-gray-500 border border-gray-100'}`}>
                              {idx === 0 && <i className="fas fa-check-circle mr-1"></i>} {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="submit"
                    className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-300"
                  >
                    Testni Baza Sifatida Saqlash
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] shadow-sm border border-gray-100">
            <i className="fas fa-folder-open text-gray-200 text-6xl mb-4"></i>
            <p className="text-gray-400 font-medium">Hozircha fanlar bazasi mavjud emas</p>
          </div>
        ) : (
          subjects.map(subject => (
            <div key={subject.id} className="bg-white p-8 rounded-[2rem] shadow-lg border border-gray-100 hover:shadow-2xl transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-2 h-full bg-indigo-500"></div>
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-xl">
                  {subject.name.charAt(0).toUpperCase()}
                </div>
                <button 
                  onClick={() => deleteSubject(subject.id)}
                  className="text-gray-300 hover:text-red-500 p-2 transition-colors"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </div>
              <h3 className="text-2xl font-black mb-2 text-gray-800">{subject.name}</h3>
              <div className="space-y-3 mb-8">
                <div className="flex items-center text-sm font-bold text-gray-500">
                  <i className="far fa-clock w-6 text-indigo-400"></i>
                  <span>{subject.settings.timeLimitMinutes} daqiqa</span>
                </div>
                <div className="flex items-center text-sm font-bold text-gray-500">
                  <i className="far fa-file-alt w-6 text-indigo-400"></i>
                  <span>{subject.settings.questionCount} ta savol / Jami: {subject.questions.length}</span>
                </div>
              </div>
              <div className="flex items-center text-[10px] text-gray-300 font-black uppercase tracking-widest">
                Yuklangan: {new Date(subject.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #818cf8;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
