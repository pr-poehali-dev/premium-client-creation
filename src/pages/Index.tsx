import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [snowEnabled, setSnowEnabled] = useState(false);
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; left: number; animationDuration: number; opacity: number }>>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (snowEnabled) {
      const flakes = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDuration: Math.random() * 3 + 5,
        opacity: Math.random() * 0.6 + 0.4,
      }));
      setSnowflakes(flakes);
    } else {
      setSnowflakes([]);
    }
  }, [snowEnabled]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBuyClick = (planName: string, price: string) => {
    setSelectedPlan({ name: planName, price });
    setShowPaymentModal(true);
  };

  const handlePaymentSelect = (method: string) => {
    const urls: Record<string, string> = {
      'YouMoney': 'https://yoomoney.ru/to/+bnDMvX7Ko67VDCR7RJECkb6',
      'YouCassa': 'https://yookassa.ru/',
      'PSP': 'https://psp.ru/',
      'Sber': 'https://www.sberbank.ru/',
      'TBank': 'https://www.tbank.ru/',
      'Крипта': 'https://www.binance.com/'
    };
    if (urls[method]) {
      window.open(urls[method], '_blank');
    }
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/3718aa2b-1f2e-4867-9c76-73ff8a9d5d2c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', ...loginData })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setShowLoginModal(false);
        setLoginData({ username: '', password: '' });
      } else {
        setError(data.error || 'Ошибка входа');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/3718aa2b-1f2e-4867-9c76-73ff8a9d5d2c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...registerData })
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setShowRegisterModal(false);
        setRegisterData({ email: '', username: '', password: '' });
      } else {
        setError(data.error || 'Ошибка регистрации');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowProfileModal(false);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="gradient-bg" />
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            opacity: flake.opacity,
          }}
        >
          ❄
        </div>
      ))}

      <header className="fixed top-0 right-0 p-6 z-50 flex items-center gap-4">
        {user ? (
          <Button 
            className="glass-effect bg-primary/80 hover:bg-primary text-white glow-effect"
            onClick={() => setShowProfileModal(true)}
          >
            <Icon name="User" size={20} className="mr-2" />
            Личный кабинет
          </Button>
        ) : (
          <>
            <Button 
              variant="ghost" 
              className="glass-effect text-white hover:bg-white/10"
              onClick={() => setShowLoginModal(true)}
            >
              Войти
            </Button>
            <Button 
              className="glass-effect bg-primary/80 hover:bg-primary text-white glow-effect"
              onClick={() => setShowRegisterModal(true)}
            >
              Создать аккаунт
            </Button>
          </>
        )}
      </header>

      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        <div className="text-center space-y-8 animate-fade-in">
          <h1 className="text-7xl md:text-9xl font-bold tracking-tight text-primary">
            AstrixClient
          </h1>
          <p className="text-2xl md:text-3xl text-gray-400 max-w-2xl">
            Клиент для тех, кто хочет чувствовать преимущество
          </p>
          
          <div className="flex gap-4 justify-center pt-8">
            <Button 
              size="lg"
              onClick={() => scrollToSection('pricing')}
              className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 rounded-2xl glow-effect"
            >
              Купить
            </Button>
            <Button 
              size="lg"
              onClick={() => scrollToSection('features')}
              variant="outline"
              className="glass-effect border-secondary text-white text-lg px-8 py-6 rounded-2xl hover:bg-white/10"
            >
              Преимущества
            </Button>
          </div>

          <div className="flex items-center gap-2 justify-center pt-8">
            <Checkbox 
              id="snow" 
              checked={snowEnabled}
              onCheckedChange={(checked) => setSnowEnabled(checked as boolean)}
              className="border-secondary data-[state=checked]:bg-secondary"
            />
            <label 
              htmlFor="snow" 
              className="text-sm text-gray-400 cursor-pointer"
            >
              Снег
            </label>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-primary">
            НАШИ ПРЕИМУЩЕСТВА
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="glass-effect p-10 rounded-3xl hover:scale-105 transition-transform duration-300 border-secondary/20">
              <div className="flex items-center gap-4 mb-4">
                <Icon name="Zap" className="text-secondary" size={40} />
                <h3 className="text-2xl font-bold text-white">Максимальная оптимизация</h3>
              </div>
              <p className="text-gray-400 text-lg">
                Высокая производительность и стабильность в любых игровых условиях
              </p>
            </Card>

            <Card className="glass-effect p-10 rounded-3xl hover:scale-105 transition-transform duration-300 border-secondary/20">
              <div className="flex items-center gap-4 mb-4">
                <Icon name="Palette" className="text-secondary" size={40} />
                <h3 className="text-2xl font-bold text-white">Уникальный интерфейс</h3>
              </div>
              <p className="text-gray-400 text-lg">
                Минималистичный дизайн, который не отвлекает от игры
              </p>
            </Card>

            <Card className="glass-effect p-10 rounded-3xl hover:scale-105 transition-transform duration-300 border-secondary/20">
              <div className="flex items-center gap-4 mb-4">
                <Icon name="Shield" className="text-secondary" size={40} />
                <h3 className="text-2xl font-bold text-white">Безопасность данных</h3>
              </div>
              <p className="text-gray-400 text-lg">
                Надежная защита вашего аккаунта и личной информации
              </p>
            </Card>

            <Card className="glass-effect p-10 rounded-3xl hover:scale-105 transition-transform duration-300 border-secondary/20">
              <div className="flex items-center gap-4 mb-4">
                <Icon name="Star" className="text-secondary" size={40} />
                <h3 className="text-2xl font-bold text-white">Постоянные обновления</h3>
              </div>
              <p className="text-gray-400 text-lg">
                Регулярные апдейты и круглосуточная поддержка пользователей
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 mb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-16 text-primary">
            ТАРИФЫ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <Card className="glass-effect p-8 rounded-3xl hover:scale-105 transition-all duration-300 border-secondary/20 flex flex-col h-[400px]">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-center mb-4 text-white">Неделя</h3>
                <p className="text-5xl font-bold text-center text-primary mb-6">100₽</p>
                <div className="space-y-3 text-gray-400">
                  <p>• Полный доступ ко всем функциям</p>
                  <p>• Идеально для пробы клиента</p>
                  <p>• Техподдержка 24/7</p>
                  <p>• Обновления включены</p>
                </div>
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl mt-4"
                onClick={() => handleBuyClick('Неделя', '100₽')}
              >
                Купить
              </Button>
            </Card>

            <Card className="glass-effect p-8 rounded-3xl hover:scale-105 transition-all duration-300 border-secondary/20 flex flex-col h-[400px]">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-center mb-4 text-white">Месяц</h3>
                <p className="text-5xl font-bold text-center text-primary mb-6">200₽</p>
                <div className="space-y-3 text-gray-400">
                  <p>• Все функции + приоритет в поддержке</p>
                  <p>• Ранний доступ к новым фичам</p>
                  <p>• Персональные настройки</p>
                  <p>• Скидка 33% к недельному тарифу</p>
                </div>
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl mt-4"
                onClick={() => handleBuyClick('Месяц', '200₽')}
              >
                Купить
              </Button>
            </Card>

            <Card className="glass-effect p-8 rounded-3xl hover:scale-105 transition-all duration-300 border-secondary/20 flex flex-col h-[400px]">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-center mb-4 text-white">Год</h3>
                <p className="text-5xl font-bold text-center text-primary mb-6">350₽</p>
                <div className="space-y-3 text-gray-400">
                  <p>• VIP-статус и эксклюзивные скины</p>
                  <p>• Бесплатные крупные обновления</p>
                  <p>• Личный менеджер поддержки</p>
                  <p>• Максимальная выгода — 71% экономии</p>
                </div>
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl mt-4"
                onClick={() => handleBuyClick('Год', '350₽')}
              >
                Купить
              </Button>
            </Card>
          </div>

          <div className="flex justify-center">
            <Card className="glass-effect p-8 rounded-3xl hover:scale-105 transition-all duration-300 border-secondary/20 flex flex-col w-full md:w-[400px] h-[400px]">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-center mb-4 text-white">Навсегда</h3>
                <p className="text-5xl font-bold text-center text-primary mb-6">500₽</p>
                <div className="space-y-3 text-gray-400">
                  <p>• Бессрочный доступ без продлений</p>
                  <p>• Все будущие обновления бесплатно</p>
                  <p>• Легендарный статус в сообществе</p>
                  <p>• Единоразовая оплата = вечный доступ</p>
                </div>
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl mt-4"
                onClick={() => handleBuyClick('Навсегда', '500₽')}
              >
                Купить
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-gray-500">
        <p>© 2024 AstrixClient. Все права защищены.</p>
      </footer>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="glass-effect border-secondary/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Вход в аккаунт</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {error && <p className="text-red-400 text-center">{error}</p>}
            <div>
              <Label htmlFor="login-username" className="text-gray-300">Логин</Label>
              <Input 
                id="login-username" 
                placeholder="Введите логин" 
                className="bg-black/40 border-secondary/30 text-white mt-2"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="login-password" className="text-gray-300">Пароль</Label>
              <Input 
                id="login-password" 
                type="password" 
                placeholder="Введите пароль" 
                className="bg-black/40 border-secondary/30 text-white mt-2"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              />
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent className="glass-effect border-secondary/20 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Регистрация</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {error && <p className="text-red-400 text-center">{error}</p>}
            <div>
              <Label htmlFor="register-email" className="text-gray-300">Email</Label>
              <Input 
                id="register-email" 
                type="email" 
                placeholder="Введите Email" 
                className="bg-black/40 border-secondary/30 text-white mt-2"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="register-username" className="text-gray-300">Логин</Label>
              <Input 
                id="register-username" 
                placeholder="Введите логин" 
                className="bg-black/40 border-secondary/30 text-white mt-2"
                value={registerData.username}
                onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="register-password" className="text-gray-300">Пароль</Label>
              <Input 
                id="register-password" 
                type="password" 
                placeholder="Введите пароль" 
                className="bg-black/40 border-secondary/30 text-white mt-2"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
              />
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="glass-effect border-secondary/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Оплата подписки</DialogTitle>
            {selectedPlan && (
              <p className="text-center text-gray-400 mt-2">
                Тариф: {selectedPlan.name} — {selectedPlan.price}
              </p>
            )}
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center">Выберите способ оплаты</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['YouMoney', 'YouCassa', 'PSP', 'Sber', 'TBank', 'Крипта'].map((method) => (
                  <Button
                    key={method}
                    onClick={() => handlePaymentSelect(method)}
                    className="glass-effect border border-secondary/30 hover:bg-secondary/20 text-white h-20"
                    variant="outline"
                  >
                    {method}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="promo" className="text-gray-300">Промокод (если у вас есть)</Label>
              <Input 
                id="promo" 
                placeholder="Введите промокод" 
                className="bg-black/40 border-secondary/30 text-white mt-2"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="glass-effect border-secondary/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Личный кабинет</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="glass-effect p-4 rounded-xl border border-secondary/20">
              <Label className="text-gray-400 text-sm">UID</Label>
              <p className="text-white font-mono mt-1">{user?.uid}</p>
            </div>
            
            <div className="glass-effect p-4 rounded-xl border border-secondary/20">
              <Label className="text-gray-400 text-sm">Email</Label>
              <p className="text-white mt-1">{user?.email}</p>
            </div>
            
            <div className="glass-effect p-4 rounded-xl border border-secondary/20">
              <Label className="text-gray-400 text-sm">Логин</Label>
              <p className="text-white mt-1">{user?.username}</p>
            </div>
            
            <div className="glass-effect p-4 rounded-xl border border-secondary/20">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-gray-400 text-sm">Пароль</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-secondary hover:text-secondary/80"
                >
                  <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
                </Button>
              </div>
              <p className="text-white font-mono">
                {showPassword ? '********' : '••••••••'}
              </p>
            </div>
            
            <div className="glass-effect p-4 rounded-xl border border-secondary/20">
              <Label className="text-gray-400 text-sm">Подписка действительна до</Label>
              <p className="text-white mt-1">
                {user?.subscription_expires_at 
                  ? new Date(user.subscription_expires_at).toLocaleDateString('ru-RU')
                  : 'Нет активной подписки'}
              </p>
            </div>

            <Button 
              className="w-full bg-primary/20 hover:bg-primary/30 text-white border border-primary"
              onClick={handleLogout}
            >
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти из аккаунта
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;