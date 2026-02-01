
import React, { useState, useRef } from 'react';
import { Subject, Question } from '../types.ts';

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

  const extractContent = (cell: Element) => {
    const text = cell.textContent?.trim() || '';
    const img = cell.querySelector('img');
    const imageData = img ? img.getAttribute('src') : undefined;
    return { text, image: imageData || undefined };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        
        // Mammoth options to handle images
        const options = {
          convertImage: mammoth.images.imgElement((image: any) => {
            return image.read("base64").then((imageBuffer: any) => {
              return {
                src: "data:" + image.contentType + ";base64," + imageBuffer
              };
            });
          })
        };

        const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer }, options);
        const html = result.value;

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const tables = doc.querySelectorAll('table');
        
        let questionsList: Question[] = [];

        tables.forEach(table => {
          const rows = Array.from(table.querySelectorAll('tr'));
          
          if (rows.length > 0) {
            rows.forEach((row, idx) => {
              const cells = Array.from(row.querySelectorAll('td'));
              if (cells.length >= 5) {
                const qContent = extractContent(cells[0]);
                const opt1 = extractContent(cells[1]);
                const opt2 = extractContent(cells[2]);
                const opt3 = extractContent(cells[3]);
                const opt4 = extractContent(cells[4]);

                questionsList.push({
                  id: `q-${idx}-${Date.now()}`,
                  text: qContent.text,
                  image: qContent.image,
                  options: [opt1.text, opt2.text, opt3.text, opt4.text],
                  optionImages: [opt1.image, opt2.image, opt3.image, opt4.image],
                  correctIndex: 0
                });
              }
            });
          }
        });

        if (questionsList.length === 0) {
          alert("Jadval ko'rinishidagi savollar topilmadi. Savollar Word jadvalining birinchi ustunida savol, qolgan 4 ta ustunida javoblar bo'lishi kerak.");
        } else {
          setPreviewQuestions(questionsList);
          setQuestionCount(Math.min(questionsList.length, 20));
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
          <p className="text-gray-500">Test bazasini yaratish (Rasmlar bilan)</p>
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
              <i className="fas fa-upload text-indigo-500 mr-3"></i> Worddan Import (Jadval usuli)
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
                  placeholder="Masalan: Fizika"
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
                      <p className="text-indigo-600 font-bold">Rasmlar tahlil qilinmoqda...</p>
                    </div>
                  ) : (
                    <>
                      <i className="fas fa-file-word text-xl text-indigo-500 mr-3"></i>
                      <p className="text-indigo-900 font-bold">
                        {previewQuestions.length > 0 ? `${previewQuestions.length} ta savol yuklandi` : "Rasmli Word (.docx) tanlang"}
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
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Test Sozlamalari</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Savollar soni</label>
                      <input 
                        type="number" 
                        value={questionCount}
                        onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        max={previewQuestions.length}
                        min="1"
                        required
                      />
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
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Yuklangan savollar (Preview)</h3>
                  <div className="max-h-96 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {previewQuestions.map((q, i) => (
                      <div key={i} className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex flex-col mb-2">
                          <p className="font-bold text-gray-900"><span className="text-indigo-500 mr-2">{i+1}.</span>{q.text}</p>
                          {q.image && <img src={q.image} alt="Question" className="mt-2 max-h-40 object-contain rounded-lg border border-gray-100" />}
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          {q.options.map((opt, idx) => (
                            <div key={idx} className={`text-xs p-3 rounded-lg flex flex-col items-center ${idx === 0 ? 'bg-green-50 text-green-700 border border-green-200 font-bold' : 'bg-gray-50 text-gray-500 border border-gray-200'}`}>
                              <span className="mb-1">{opt}</span>
                              {q.optionImages && q.optionImages[idx] && (
                                <img src={q.optionImages[idx]} alt={`Opt ${idx}`} className="max-h-20 object-contain mt-1 rounded shadow-sm" />
                              )}
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
                    Bazaga Saqlash
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
            <p className="text-gray-400 font-medium">Hozircha bazada testlar yo'q</p>
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
