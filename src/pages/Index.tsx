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
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string; duration: string } | null>(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', username: '', password: '' });
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showPasswordProfile, setShowPasswordProfile] = useState(false);

  useEffect(() => {
    if (snowEnabled) {
      const flakes = Array.from({ length: 100 }, (_, i) => ({
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

  const handleBuyClick = (planName: string, price: string, duration: string) => {
    setSelectedPlan({ name: planName, price, duration });
    setShowPaymentModal(true);
  };

  const handlePaymentSelect = (method: string) => {
    const amount = selectedPlan?.price.replace(/[^\d]/g, '') || '0';
    const urls: Record<string, string> = {
      'YouMoney': `https://yoomoney.ru/to/410011234567890?amount=${amount}&comment=Astrix%20Client%20${selectedPlan?.name}`,
      'YooKassa': `https://yookassa.ru/`,
      'PSP': `https://psp.ru/`,
      'Sber': `https://www.sberbank.ru/`,
      'TBank': `https://www.tbank.ru/`,
      'Крипта': `https://www.binance.com/`
    };
    if (urls[method]) {
      window.open(urls[method], '_blank');
      setShowPaymentModal(false);
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
        setError('');
      } else {
        setError('Проверьте логин или пароль');
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
        setError('');
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

  const plans = [
    { name: 'на неделю', price: '100₽', duration: '7 дней', features: ['Все функции', 'Подписка на неделю', '7 дней в удовольствие'] },
    { name: 'на месяц', price: '200₽', duration: '30 дней', features: ['Все функции', 'Подписка на месяц', '30 дней в удовольствие'] },
    { name: 'на год', price: '350₽', duration: '365 дней', features: ['Все функции', 'Подписка на год', '365 дней в удовольствие'] },
    { name: 'навсегда', price: '500₽', duration: 'навсегда', features: ['Все функции', 'Навсегда', 'Бесконечное удовольствие'], highlight: true }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {snowEnabled && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {snowflakes.map((flake) => (
            <div
              key={flake.id}
              className="snowflake-full"
              style={{
                left: `${flake.left}%`,
                animationDuration: `${flake.animationDuration}s`,
                opacity: flake.opacity,
              }}
            >
              ❄
            </div>
          ))}
        </div>
      )}

      <header className="fixed top-0 right-0 p-6 z-40 flex items-center gap-4">
        {user ? (
          <Button 
            className="ios-button bg-red-900/80 hover:bg-red-800 text-white"
            onClick={() => setShowProfileModal(true)}
          >
            <Icon name="User" size={20} className="mr-2" />
            Личный кабинет
          </Button>
        ) : (
          <>
            <Button 
              className="ios-button bg-red-900/60 hover:bg-red-800/60 text-white"
              onClick={() => setShowLoginModal(true)}
            >
              Войти
            </Button>
            <Button 
              className="ios-button bg-red-900/80 hover:bg-red-800 text-white"
              onClick={() => setShowRegisterModal(true)}
            >
              Создать аккаунт
            </Button>
          </>
        )}
      </header>

      <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-32">
        <div className="text-center space-y-8 animate-fade-in">
          <h1 className="text-7xl md:text-9xl font-bold tracking-tight text-red-900">
            AstrixClient
          </h1>
          <p className="text-2xl md:text-3xl text-red-900/80 max-w-2xl mx-auto">
            Клиент для тех, кто хочет чувствовать преимущество
          </p>
          
          <div className="flex gap-4 justify-center pt-8">
            <Button 
              size="lg"
              onClick={() => scrollToSection('pricing')}
              className="ios-button bg-red-900 hover:bg-red-800 text-white text-lg px-8 py-6"
            >
              Купить
            </Button>
            <Button 
              size="lg"
              onClick={() => scrollToSection('features')}
              className="ios-button bg-red-900/60 hover:bg-red-800/60 text-white text-lg px-8 py-6"
            >
              Преимущества
            </Button>
          </div>

          <div className="flex items-center gap-3 justify-center pt-8">
            <Checkbox 
              id="snow" 
              checked={snowEnabled}
              onCheckedChange={(checked) => setSnowEnabled(checked as boolean)}
              className="border-red-900 data-[state=checked]:bg-red-900"
            />
            <label 
              htmlFor="snow" 
              className="text-sm text-red-900/70 cursor-pointer select-none"
            >
              Снег
            </label>
          </div>
        </div>
      </section>

      <section id="features" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-bold text-center mb-20 text-red-900">
            НАШИ ПРЕИМУЩЕСТВА
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="glass-card p-12 hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <Icon name="Zap" className="text-sky-400" size={48} />
                <h3 className="text-2xl font-bold text-red-900">Максимальная оптимизация и стабильность</h3>
              </div>
              <p className="text-red-900/60 text-lg">
                Высокая производительность и стабильность в любых игровых условиях
              </p>
            </Card>

            <Card className="glass-card p-12 hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <Icon name="Palette" className="text-sky-400" size={48} />
                <h3 className="text-2xl font-bold text-red-900">Уникальный минималистичный интерфейс</h3>
              </div>
              <p className="text-red-900/60 text-lg">
                Современный и интуитивный дизайн для максимального комфорта
              </p>
            </Card>

            <Card className="glass-card p-12 hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <Icon name="Shield" className="text-sky-400" size={48} />
                <h3 className="text-2xl font-bold text-red-900">Безопасность и защита данных</h3>
              </div>
              <p className="text-red-900/60 text-lg">
                Надёжная защита ваших данных и конфиденциальности
              </p>
            </Card>

            <Card className="glass-card p-12 hover:scale-105 transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <Icon name="Sparkles" className="text-sky-400" size={48} />
                <h3 className="text-2xl font-bold text-red-900">Постоянные обновления и поддержка</h3>
              </div>
              <p className="text-red-900/60 text-lg">
                Регулярные улучшения и поддержка 24/7
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-bold text-center mb-20 text-red-900">
            ТАРИФЫ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-8">
            {plans.slice(0, 3).map((plan) => (
              <Card key={plan.name} className="glass-card p-8 flex flex-col justify-between hover:scale-105 transition-all duration-300 min-h-[400px]">
                <div>
                  <h3 className="text-3xl font-bold text-red-900 mb-4">{plan.name}</h3>
                  <p className="text-5xl font-bold text-red-900 mb-8">{plan.price}</p>
                  <div className="space-y-3 mb-8">
                    <p className="text-red-900/80">При покупке подписки {plan.name} вы получите:</p>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Icon name="Check" className="text-sky-400" size={20} />
                        <span className="text-red-900/70">{feature}</span>
                      </div>
                    ))}
                    <p className="text-red-900/80 font-semibold mt-4">Это {plan.duration} в удовольствие!</p>
                  </div>
                </div>
                <Button 
                  className="w-full ios-button bg-red-900 hover:bg-red-800 text-white text-lg py-6"
                  onClick={() => handleBuyClick(plan.name, plan.price, plan.duration)}
                >
                  Купить
                </Button>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Card className="glass-card p-8 flex flex-col justify-between hover:scale-105 transition-all duration-300 min-h-[400px] w-full max-w-md border-2 border-sky-400/50">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="Crown" className="text-yellow-400" size={32} />
                  <h3 className="text-3xl font-bold text-red-900">{plans[3].name}</h3>
                </div>
                <p className="text-5xl font-bold text-red-900 mb-8">{plans[3].price}</p>
                <div className="space-y-3 mb-8">
                  <p className="text-red-900/80">При покупке подписки {plans[3].name} вы получите:</p>
                  {plans[3].features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Icon name="Check" className="text-sky-400" size={20} />
                      <span className="text-red-900/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button 
                className="w-full ios-button bg-red-900 hover:bg-red-800 text-white text-lg py-6"
                onClick={() => handleBuyClick(plans[3].name, plans[3].price, plans[3].duration)}
              >
                Купить
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="glass-modal max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center text-red-900">Вход</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div>
              <Label className="text-red-900/80">Введите логин</Label>
              <Input 
                className="glass-input mt-2"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                placeholder="Логин"
              />
            </div>
            <div>
              <Label className="text-red-900/80">Введите пароль</Label>
              <Input 
                type="password"
                className="glass-input mt-2"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Пароль"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button 
              className="w-full ios-button bg-red-900 hover:bg-red-800 text-white text-lg py-6"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Загрузка...' : 'Войти'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRegisterModal} onOpenChange={setShowRegisterModal}>
        <DialogContent className="glass-modal max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center text-red-900">Регистрация</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div>
              <Label className="text-red-900/80">Введите Email</Label>
              <Input 
                type="email"
                className="glass-input mt-2"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                placeholder="Email"
              />
            </div>
            <div>
              <Label className="text-red-900/80">Введите логин</Label>
              <Input 
                className="glass-input mt-2"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                placeholder="Логин"
              />
            </div>
            <div>
              <Label className="text-red-900/80">Введите пароль</Label>
              <Input 
                type="password"
                className="glass-input mt-2"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                placeholder="Пароль"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button 
              className="w-full ios-button bg-red-900 hover:bg-red-800 text-white text-lg py-6"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? 'Загрузка...' : 'Создать аккаунт'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="glass-modal max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center text-red-900 mb-2">Выберите способ оплаты</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              {['YouMoney', 'YooKassa', 'PSP', 'Sber', 'TBank', 'Крипта'].map((method) => (
                <Button
                  key={method}
                  className="ios-button bg-red-900/60 hover:bg-red-800/60 text-white py-6"
                  onClick={() => handlePaymentSelect(method)}
                >
                  {method}
                </Button>
              ))}
            </div>
            
            <div className="pt-4">
              <Label className="text-red-900/80 mb-2 block">Промокод (если у вас он есть)</Label>
              <Input 
                className="glass-input"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Введите промокод"
              />
            </div>

            <div className="glass-card p-4 mt-4">
              <p className="text-red-900/70 text-sm">Выбранный тариф: <span className="font-bold text-red-900">{selectedPlan?.name}</span></p>
              <p className="text-red-900/70 text-sm">Сумма: <span className="font-bold text-red-900">{selectedPlan?.price}</span></p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="glass-modal max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center text-red-900">Личный кабинет</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="glass-card p-4">
              <Label className="text-red-900/60 text-sm">UID</Label>
              <p className="text-red-900 font-mono mt-1">{user?.uid}</p>
            </div>
            
            <div className="glass-card p-4">
              <Label className="text-red-900/60 text-sm">Email</Label>
              <p className="text-red-900 mt-1">{user?.email}</p>
            </div>
            
            <div className="glass-card p-4">
              <Label className="text-red-900/60 text-sm">Логин</Label>
              <p className="text-red-900 mt-1">{user?.username}</p>
            </div>
            
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-red-900/60 text-sm">Пароль</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasswordProfile(!showPasswordProfile)}
                  className="text-sky-400 hover:text-sky-300 h-auto p-0"
                >
                  {showPasswordProfile ? 'Скрыть' : 'Показать'}
                </Button>
              </div>
              <p className="text-red-900 font-mono">
                {showPasswordProfile ? user?.password || '********' : '••••••••'}
              </p>
            </div>
            
            <div className="glass-card p-4">
              <Label className="text-red-900/60 text-sm">Подписка действительна до</Label>
              <p className="text-red-900 mt-1">
                {user?.subscription_expires_at 
                  ? new Date(user.subscription_expires_at).toLocaleDateString('ru-RU')
                  : 'Нет активной подписки'}
              </p>
            </div>

            <Button 
              className="w-full ios-button bg-red-900/60 hover:bg-red-800/60 text-white"
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
