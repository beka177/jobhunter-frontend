import React, { useEffect, useState } from 'react';
import { HelpCircle, ArrowLeft, BookOpen } from 'lucide-react';
import { API_URL } from '../constants';

const HelpPage = ({ onNavigate }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHelp = async () => {
      try {
        const response = await fetch(`${API_URL}/help.php`);
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        }
      } catch (error) {
        console.error("Ошибка загрузки помощи", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHelp();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-6 px-4 pb-12">
      <button 
        onClick={() => onNavigate('home')} 
        className="mb-6 inline-flex items-center px-4 py-2 bg-white border border-blue-600 text-blue-700 rounded-md hover:bg-blue-50 transition-colors font-medium shadow-sm"
      >
        <ArrowLeft className="h-5 w-5 mr-2" /> Назад
      </button>

      <div className="text-center mb-10">
        <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-extrabold text-gray-900">Центр помощи</h1>
        <p className="mt-2 text-lg text-gray-600">Ответы на часто задаваемые вопросы</p>
      </div>

      {loading ? (
        <div className="text-center py-10">Загрузка статей...</div>
      ) : (
        <div className="space-y-6">
          {articles.length === 0 ? (
            <div className="text-center text-gray-500">Пока нет статей.</div>
          ) : (
            articles.map((article) => (
              <div key={article.id} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 transition-shadow hover:shadow-lg">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center mb-3">
                    <BookOpen className="h-5 w-5 text-blue-500 mr-2" />
                    {article.title}
                  </h3>
                  <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                    {article.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default HelpPage;