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
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);

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

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
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
                  <p>При покупке подписки на неделю вы получите:</p>
                  <p>• Все функции клиента</p>
                  <p>• Подписку на 7 дней</p>
                  <p>• Это 7 дней в удовольствие</p>
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
                  <p>При покупке подписки на месяц вы получите:</p>
                  <p>• Все функции клиента</p>
                  <p>• Подписку на 30 дней</p>
                  <p>• Это 30 дней в удовольствие</p>
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
                  <p>При покупке подписки на год вы получите:</p>
                  <p>• Все функции клиента</p>
                  <p>• Подписку на 365 дней</p>
                  <p>• Это 365 дней в удовольствие</p>
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
                  <p>При покупке навсегда вы получите:</p>
                  <p>• Все функции клиента</p>
                  <p>• Бессрочную подписку</p>
                  <p>• Это навсегда в удовольствие</p>
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
            <div>
              <Label htmlFor="login-username" className="text-gray-300">Логин</Label>
              <Input 
                id="login-username" 
                placeholder="Введите логин" 
                className="bg-black/40 border-secondary/30 text-white mt-2"
              />
            </div>
            <div>
              <Label htmlFor="login-password" className="text-gray-300">Пароль</Label>
              <Input 
                id="login-password" 
                type="password" 
                placeholder="Введите пароль" 
                className="bg-black/40 border-secondary/30 text-white mt-2"
              />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              Войти
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
            <div>
              <Label htmlFor="register-email" className="text-gray-300">Email</Label>
              <Input 
                id="register-email" 
                type="email" 
                placeholder="Введите Email" 
                className="bg-black/40 border-secondary/30 text-white mt-2"
              />
            </div>
            <div>
              <Label htmlFor="register-username" className="text-gray-300">Логин</Label>
              <Input 
                id="register-username" 
                placeholder="Введите логин" 
                className="bg-black/40 border-secondary/30 text-white mt-2"
              />
            </div>
            <div>
              <Label htmlFor="register-password" className="text-gray-300">Пароль</Label>
              <Input 
                id="register-password" 
                type="password" 
                placeholder="Введите пароль" 
                className="bg-black/40 border-secondary/30 text-white mt-2"
              />
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white">
              Зарегистрироваться
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
    </div>
  );
};

export default Index;
