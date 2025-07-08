
const translations = {
  rus: {
    aboutUs: "О нас",
    description: "Создайте свою собсвтенную\n CCG карточку и скачайте ее",
    createButton: "Создать",

   
  },
  eng: {
    aboutUs: "About Us",
    description: "Create your own CCG card \n  and download it",
    createButton: "Create",
    
   
  }
};

// Функция установки языка
function setLanguage(lang) {
  // Сохраняем в Local Storage
  localStorage.setItem('selectedLanguage', lang);
  
  // Получаем переводы
  const t = translations[lang];
  
  // Применяем переводы к элементам
  document.querySelector('.about').textContent = t.aboutUs;
  document.querySelector('.description').textContent = t.description;
   document.querySelector('.create').textContent = t.createButton


  
  // Обновляем выбранный вариант в селекторе
  document.getElementById('language-select').value = lang;
}

// Инициализация языка при загрузке
document.addEventListener('DOMContentLoaded', function() {
  const languageSelect = document.getElementById('language-select');
  
  // Получаем сохраненный язык или определяем по умолчанию
  const savedLang = localStorage.getItem('selectedLanguage') || 'rus';
  
  // Устанавливаем язык
  setLanguage(savedLang);
  
  // Обработчик изменения языка
  languageSelect.addEventListener('change', function() {
    setLanguage(this.value);
  });
});