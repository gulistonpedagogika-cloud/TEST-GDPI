
import React from 'react';
import { Subject } from '../types.ts';

interface StudentSubjectsProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject) => void;
  studentName: string;
}

const StudentSubjects: React.FC<StudentSubjectsProps> = ({ subjects, onSelectSubject, studentName }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <h2 className="text-base font-black text-gray-900 mb-0.5 uppercase tracking-tight">Salom, {studentName.split(' ')[0]}! 👋</h2>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Fanni tanlang va boshlang</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {subjects.length === 0 ? (
          <div className="col-span-full py-10 text-center bg-white rounded-xl border border-gray-50 shadow-sm">
            <i className="fas fa-layer-group text-2xl text-gray-100 mb-2"></i>
            <p className="text-gray-400 text-[10px] font-medium">Hali testlar yuklanmagan.</p>
          </div>
        ) : (
          subjects.map(subject => (
            <div 
              key={subject.id} 
              onClick={() => onSelectSubject(subject)}
              className="group cursor-pointer bg-white p-4 rounded-xl shadow-sm border border-gray-50 hover:border-indigo-400 hover:shadow transition-all relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xs mb-3 shadow-sm">
                  <i className="fas fa-file-alt"></i>
                </div>
                <h3 className="text-xs font-black text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors truncate">
                  {subject.name}
                </h3>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded text-[7px] font-black uppercase flex items-center border border-gray-100">
                    <i className="far fa-clock mr-0.5"></i> {subject.settings.timeLimitMinutes}m
                  </span>
                  <span className="bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded text-[7px] font-black uppercase flex items-center border border-gray-100">
                    <i className="far fa-question-circle mr-0.5"></i> {subject.settings.questionCount} ta
                  </span>
                </div>
              </div>

              <div className="flex items-center text-indigo-600 font-black text-[8px] uppercase tracking-widest group-hover:translate-x-0.5 transition-transform">
                Boshlash <i className="fas fa-chevron-right ml-1 text-[8px]"></i>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentSubjects;
