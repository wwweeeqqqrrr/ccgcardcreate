const nameInput = document.getElementById('name-input');
const photoInput = document.getElementById('photo-input');
const dateInput = document.getElementById('date-input');
const downloadBtn = document.getElementById('download');
const canvas = document.getElementById("card-canvas");
const ctx = canvas.getContext("2d");

// Глобальные переменные для кэширования
let cachedBgImage = null;
let cachedDefaultPhoto = null;
let generatedCode = '';

// Генерация кода (один раз при загрузке)
function generateRandomCode() {
    if (!generatedCode) {
        generatedCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    }
    return generatedCode;
}

// Загрузка изображений
function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
    });
}

// Предзагрузка изображений
async function preloadImages() {
    cachedBgImage = await loadImage("images/formatted.png");
    cachedDefaultPhoto = await loadImage("images/example.png");
}

// Загрузка фото пользователя
function loadUserPhoto(file) {
    return new Promise((resolve) => {
        if (!file) return resolve(cachedDefaultPhoto);
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = URL.createObjectURL(file);
    });
}

// Форматирование даты
function formatDateInput(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 2) {
        const day = Math.min(parseInt(value.substring(0, 2)), 31);
        value = day.toString().padStart(2, '0') + value.substring(2);
    }
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length > 5) {
        const month = Math.min(parseInt(value.substring(3, 5)), 12);
        value = value.substring(0, 3) + month.toString().padStart(2, '0');
    }
    input.value = value.substring(0, 5);
}

// Отрисовка данных
async function drawFormData(formData) {


    // Фон
    ctx.drawImage(cachedBgImage, 0, 0, canvas.width, canvas.height);

    // Фото
    const photo = await loadUserPhoto(formData.photo);
    ctx.drawImage(photo, 27, 112, 227, 325);

    // Имя
    ctx.save();
    ctx.font = "10px bold";
    ctx.fillStyle = 'rgba(0, 6, 8, 0.9)';
    ctx.scale(1.5, 1.4);
    ctx.fillText(formData.name?.toUpperCase() || "", 187, 130);
    ctx.restore();

    // Дата
    if (formData.date) {
        const [day, month] = formData.date.split('/');
        ctx.save();
        ctx.font = '10px bold';
        ctx.fillStyle = 'rgba(0, 6, 8, 0.9)';
        ctx.fillText(day || '', 425, 257);
        ctx.fillText(month || '', 442, 257);
        ctx.restore();
    }

    // Код
    ctx.save();
    ctx.font = '23px arial';
    ctx.fillStyle = 'rgba(0, 6, 8, 1)';
    ctx.fillText(generateRandomCode(), 430, 440);
    ctx.restore();
}
function isCanvasTainted(canvas) {
    try {
        canvas.toDataURL();
        return false;
    } catch (err) {
        return true;
    }
}

function downloadCanvas() {
    try {
        // Проверяем, не "загрязнен" ли canvas
        if (isCanvasTainted(canvas)) {
            throw new Error("Cannot export due to CORS restrictions");
        }

        const link = document.createElement('a');
        link.download = 'card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error("Download error:", error);
        alert("Не удалось сохранить изображение. Пожалуйста, используйте изображения с доверенных источников.");
    }
}

// Инициализация
(async function init() {
    await preloadImages();
    generateRandomCode();

    // Первая отрисовка
    await drawFormData({
        name: nameInput.value || "",
        photo: null,
        date: dateInput.value || ""
    });

    // Обработчики с дебаунсом
    let redrawTimeout;
    function scheduleRedraw(formData) {
        clearTimeout(redrawTimeout);
        redrawTimeout = setTimeout(() => drawFormData(formData), 100);
    }

    nameInput.addEventListener('input', () => {
        scheduleRedraw({
            name: nameInput.value,
            photo: photoInput.files[0] || null,
            date: dateInput.value
        });
    });

    photoInput.addEventListener('change', () => {
        scheduleRedraw({
            name: nameInput.value,
            photo: photoInput.files[0],
            date: dateInput.value
        });
    });

    dateInput.addEventListener('input', function() {
        formatDateInput(this);
        scheduleRedraw({
            name: nameInput.value,
            photo: photoInput.files[0] || null,
            date: dateInput.value
        });
    });

    // Обработчик кнопки скачивания
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        downloadCanvas();
    });
})();