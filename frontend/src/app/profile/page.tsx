'use client';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">Профиль пользователя</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-dark-hover border border-dark-border rounded-xl p-6 text-center space-y-4">
          <div className="w-20 h-20 bg-primary-main rounded-full mx-auto flex items-center justify-center text-3xl">
            👤
          </div>
          <h2 className="text-2xl font-bold text-white">Гость</h2>
          <p className="text-gray-400 text-sm">Авторизуйтесь для сохранения проектов</p>
          <button className="w-full py-2 bg-primary-main hover:bg-primary-light text-white font-semibold rounded transition">
            Войти
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-dark-hover border border-dark-border rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">Мои интерьеры</h3>
            <p className="text-gray-400">У вас пока нет сохранённых интерьеров</p>
            <a
              href="/upload"
              className="inline-block px-4 py-2 bg-primary-main hover:bg-primary-light text-white font-semibold rounded transition"
            >
              Создать интерьер
            </a>
          </div>

          <div className="bg-dark-hover border border-dark-border rounded-xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">Статистика</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-main">0</p>
                <p className="text-gray-400 text-sm">Интерьеры</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-main">0</p>
                <p className="text-gray-400 text-sm">Просмотры</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-main">0</p>
                <p className="text-gray-400 text-sm">Лайки</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
