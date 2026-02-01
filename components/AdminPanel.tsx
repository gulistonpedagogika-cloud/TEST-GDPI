
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
        const options = {
          convertImage: mammoth.images.imgElement((image: any) => {
            return image.read("base64").then((imageBuffer: any) => {
              return { src: "data:" + image.contentType + ";base64," + imageBuffer };
            });
          })
        };
        const result = await mammoth.convertToHtml({ arrayBuffer }, options);
        const parser = new DOMParser();
        const doc = parser.parseFromString(result.value, 'text/html');
        const tables = doc.querySelectorAll('table');
        let questionsList: Question[] = [];
        tables.forEach(table => {
          const rows = Array.from(table.querySelectorAll('tr'));
          for (let i = 0; i < rows.length; i += 5) {
            if (i + 4 < rows.length) {
              const qCell = rows[i].querySelector('td') || rows[i];
              const qContent = extractContent(qCell);
              const options: string[] = [];
              const optionImages: (string | undefined)[] = [];
              for (let j = 1; j <= 4; j++) {
                const optCell = rows[i + j].querySelector('td') || rows[i + j];
                const optContent = extractContent(optCell);
                options.push(optContent.text);
                optionImages.push(optContent.image);
              }
              if (qContent.text || qContent.image) {
                questionsList.push({
                  id: `q-${i}-${Date.now()}`,
                  text: qContent.text,
                  image: qContent.image,
                  options,
                  optionImages,
                  correctIndex: 0
                });
              }
            }
          }
        });
        if (questionsList.length === 0) alert("Format xato!");
        else {
          setPreviewQuestions(questionsList);
          setQuestionCount(Math.min(questionsList.length, 20));
        }
      } catch (e) { alert("Xatolik!"); } finally {
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName || previewQuestions.length === 0) return;
    addSubject({
      id: `subj-${Date.now()}`,
      name: subjectName,
      questions: previewQuestions,
      settings: { timeLimitMinutes: timeLimit, questionCount: Math.min(questionCount, previewQuestions.length) },
      createdAt: Date.now()
    });
    setSubjectName(''); setPreviewQuestions([]); setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-lg font-black text-gray-900 leading-none">Admin Paneli</h1>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Boshqaruv</p>
        </div>
        <div className="flex space-x-1.5">
          <button onClick={onGoToResults} className="px-3 py-1.5 text-[10px] font-black text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 uppercase tracking-wider">Natijalar</button>
          <button onClick={() => { setShowForm(!showForm); setPreviewQuestions([]); }} className="px-3 py-1.5 text-[10px] font-black text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 uppercase tracking-wider">{showForm ? 'Yopish' : 'Yangi test'}</button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 animate-in slide-in-from-top-1">
          <form onSubmit={handleAddSubject}>
            <div className="grid md:grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-[8px] font-black text-gray-400 mb-1 uppercase tracking-widest">Fan nomi</label>
                <input type="text" value={subjectName} onChange={e => setSubjectName(e.target.value)} className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-100 bg-gray-50 outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Fan nomi" required />
              </div>
              <div className="md:col-span-2 flex items-end">
                <div onClick={() => fileInputRef.current?.click()} className="w-full cursor-pointer flex items-center justify-center py-1.5 border-2 border-dashed border-indigo-100 rounded-lg bg-indigo-50/30 hover:bg-indigo-50">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tight">{isProcessing ? "Yuklanmoqda..." : (previewQuestions.length > 0 ? `${previewQuestions.length} ta savol` : "Faylni tanlang (.docx)")}</span>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".docx" />
                </div>
              </div>
            </div>

            {previewQuestions.length > 0 && (
              <div className="animate-in fade-in">
                <div className="bg-gray-50/50 p-3 rounded-lg mb-4 grid grid-cols-2 gap-3 border border-gray-100">
                  <div>
                    <label className="block text-[8px] font-black text-gray-400 mb-1 uppercase tracking-widest">Nechta savol?</label>
                    <input type="number" value={questionCount} onChange={e => setQuestionCount(parseInt(e.target.value))} className="w-full px-2 py-1 text-xs rounded border border-gray-100 outline-none" max={previewQuestions.length} min="1" required />
                  </div>
                  <div>
                    <label className="block text-[8px] font-black text-gray-400 mb-1 uppercase tracking-widest">Vaqt (min)</label>
                    <input type="number" value={timeLimit} onChange={e => setTimeLimit(parseInt(e.target.value))} className="w-full px-2 py-1 text-xs rounded border border-gray-100 outline-none" min="1" required />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-black text-[10px] rounded-lg uppercase tracking-widest shadow-sm">Saqlash</button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {subjects.map(subject => (
          <div key={subject.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative group flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-black text-xs uppercase">{subject.name.charAt(0)}</div>
              <button onClick={() => deleteSubject(subject.id)} className="text-gray-200 hover:text-red-400 p-1 transition-colors"><i className="fas fa-trash-alt text-[10px]"></i></button>
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-800 truncate mb-1">{subject.name}</h3>
              <div className="flex gap-1.5 text-[8px] font-black text-gray-400 uppercase tracking-tighter">
                <span>{subject.settings.timeLimitMinutes} min</span>
                <span>•</span>
                <span>{subject.settings.questionCount} savol</span>
              </div>
            </div>
          </div>
        ))}
        {subjects.length === 0 && <div className="col-span-full py-10 text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">Testlar yo'q</div>}
      </div>
    </div>
  );
};

export default AdminPanel;
