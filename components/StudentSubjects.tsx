
import React from 'react';
import { Subject } from '../types.ts';

interface StudentSubjectsProps {
  subjects: Subject[];
  onSelectSubject: (subject: Subject) => void;
  studentName: string;
}

const StudentSubjects: React.FC<StudentSubjectsProps> = ({ subjects, onSelectSubject, studentName }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-gray-900 mb-2">Salom, {studentName.split(' ')[0]}! 👋</h2>
        <p className="text-gray-500 text-lg">Bugun qaysi fan bo'yicha test topshirmoqchisiz?</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {subjects.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <i className="fas fa-ghost text-6xl text-gray-200 mb-4"></i>
            <p className="text-gray-400 text-xl font-medium">Hozircha faol testlar mavjud emas.</p>
          </div>
        ) : (
          subjects.map(subject => (
            <div 
              key={subject.id} 
              onClick={() => onSelectSubject(subject)}
              className="group cursor-pointer bg-white p-8 rounded-[2rem] shadow-lg border border-gray-100 hover:border-indigo-500 hover:shadow-2xl transition-all relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg shadow-indigo-100">
                  <i className="fas fa-book-open"></i>
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                  {subject.name}
                </h3>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <i className="far fa-clock mr-1.5"></i> {subject.settings.timeLimitMinutes} min
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <i className="far fa-question-circle mr-1.5"></i> {subject.settings.questionCount} ta savol
                  </span>
                </div>

                <div className="flex items-center text-indigo-600 font-bold group-hover:translate-x-2 transition-transform">
                  Testni boshlash <i className="fas fa-play-circle ml-2"></i>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentSubjects;