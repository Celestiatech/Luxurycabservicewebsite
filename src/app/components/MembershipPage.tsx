import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Award as Trophy, CheckCircle2, ShoppingCart } from 'lucide-react';

interface MembershipPageProps {
  handleShopifyCheckout: (data: any) => void;
}

export function MembershipPage({ handleShopifyCheckout }: MembershipPageProps) {
  const membershipPlans = [
    {
      name: 'SILVER',
      price: 99,
      period: 'month',
      features: ['5% Discount on All Rides', 'Priority Booking', 'Free Cancellation', '24/7 Support', 'Loyalty Points'],
      color: 'from-gray-400 to-gray-500'
    },
    {
      name: 'GOLD',
      price: 199,
      period: 'month',
      popular: true,
      features: ['10% Discount on All Rides', 'Airport Fast Track', 'Free Upgrades', 'Dedicated Manager', 'VIP Lounge Access', 'Double Loyalty Points'],
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      name: 'PLATINUM',
      price: 399,
      period: 'month',
      features: ['15% Discount on All Rides', 'Guaranteed Availability', 'Complimentary Tours (2/year)', 'Personal Concierge', 'Premium Vehicles Only', 'Triple Loyalty Points'],
      color: 'from-purple-400 to-purple-600'
    }
  ];

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center max-w-4xl mx-auto" {...scaleIn}>
            <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase">MEMBERSHIP PLANS</h1>
            <p className="text-xl font-bold text-gray-300">
              Save more with our exclusive membership programs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {membershipPlans.map((plan, index) => (
              <motion.div
                key={index}
                {...scaleIn}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <Card className={`h-full relative overflow-hidden hover:shadow-2xl transition-all ${plan.popular ? 'border-4 border-orange-500' : 'border-2 border-gray-200'}`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-orange-500 text-white px-6 py-1 font-black text-sm">
                      MOST POPULAR
                    </div>
                  )}
                  <CardContent className="p-8 text-center">
                    <div className={`bg-gradient-to-br ${plan.color} w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                      <Trophy className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="font-black text-3xl mb-2 text-gray-900">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-5xl font-black text-gray-900">${plan.price}</span>
                      <span className="text-xl font-bold text-gray-600">/{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8 text-left">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start gap-3 font-semibold text-gray-700">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleShopifyCheckout({...plan, name: `${plan.name} Membership`})}
                      className={`w-full font-black text-lg py-6 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                          : 'bg-gray-900 hover:bg-black text-white'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      JOIN NOW
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-center text-gray-900 mb-12 uppercase">
              MEMBERSHIP BENEFITS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { title: 'SAVE MONEY', desc: 'Get up to 15% discount on every ride with Platinum membership' },
                { title: 'PRIORITY SERVICE', desc: 'Skip the queue and get guaranteed availability anytime' },
                { title: 'EXCLUSIVE PERKS', desc: 'Access VIP lounges, free upgrades, and complimentary tours' },
                { title: 'DEDICATED SUPPORT', desc: 'Personal concierge and dedicated account manager' }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200"
                  whileHover={{ scale: 1.03 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="font-black text-xl text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="font-semibold text-gray-600">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
