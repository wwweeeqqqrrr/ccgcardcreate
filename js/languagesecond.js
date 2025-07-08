
const translations = {
  rus: {
    cardData: "Данные карточки",
    enterName: "Введите имя",
    enterDate: "Введите дату",
    uploadPhoto: "Загрузить фото",
    download: "Скачать",
   
  },
  eng: {
    cardData: "Card data",
    enterName: "Enter name",
    enterDate: "Enter date",
    uploadPhoto: "Upload photo",
    download: "Download",
   
  }
};

// Функция установки языка
function setLanguage(lang) {
  // Сохраняем в Local Storage
  localStorage.setItem('selectedLanguage', lang);
  
  // Получаем переводы
  const t = translations[lang];
  
  // Применяем переводы к элементам
  document.querySelector('.main-label').textContent = t.cardData;
  document.getElementById('name-input').placeholder = t.enterName;
  document.getElementById('date-input').placeholder = t.enterDate;
  document.querySelector('.file-input-label').textContent = t.uploadPhoto;
  document.getElementById('download').textContent = t.download;

  
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