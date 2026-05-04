import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Plane, Heart, Building2, Navigation, Sparkles, Trophy, ChevronRight, Check, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ServicesPageProps {
  handleShopifyCheckout: (data: any) => void;
}

export function ServicesPage({ handleShopifyCheckout }: ServicesPageProps) {
  const services = [
    {
      icon: Plane,
      title: 'AIRPORT TRANSFERS',
      desc: '24/7 Auckland Airport pickup & drop-off with meet & greet service',
      color: 'from-blue-500 to-blue-600',
      features: ['Flight Tracking', 'Meet & Greet', 'Free Waiting Time', 'Luggage Assistance'],
      price: 65,
      image: 'https://images.unsplash.com/photo-1616804947838-6646ae0e423d?w=800'
    },
    {
      icon: Heart,
      title: 'WEDDING SERVICES',
      desc: 'Luxury wedding car hire with professional chauffeurs and decorations',
      color: 'from-pink-500 to-pink-600',
      features: ['Decorated Vehicles', 'Red Carpet Service', 'Champagne Included', 'Photo Time'],
      price: 799,
      image: 'https://images.unsplash.com/photo-1558222209-134191edfe0d?w=800'
    },
    {
      icon: Building2,
      title: 'AUCKLAND CITY TOURS',
      desc: 'Guided Auckland sightseeing packages with professional tour guides',
      color: 'from-purple-500 to-purple-600',
      features: ['Expert Guides', 'All Attractions', 'Flexible Duration', 'Photo Stops'],
      price: 499,
      image: 'https://images.unsplash.com/photo-1595125989588-36d745a2a828?w=800'
    },
    {
      icon: Navigation,
      title: 'INTERCITY TRAVEL',
      desc: 'Comfortable rides to Hamilton, Rotorua, Wellington & other NZ cities',
      color: 'from-orange-500 to-orange-600',
      features: ['Long Distance Comfort', 'Multiple Stops', 'Fixed Pricing', 'Experienced Drivers'],
      price: 180,
      image: 'https://images.unsplash.com/photo-1677557769755-875d8141c0c6?w=800'
    },
    {
      icon: Sparkles,
      title: 'CORPORATE EVENTS',
      desc: 'Professional business transportation for conferences and meetings',
      color: 'from-green-500 to-green-600',
      features: ['Executive Service', 'Punctual', 'Professional Drivers', 'Group Discounts'],
      price: 599,
      image: 'https://images.unsplash.com/photo-1603122101829-e56305b0a5f7?w=800'
    },
    {
      icon: Trophy,
      title: 'SPECIAL OCCASIONS',
      desc: 'Birthdays, anniversaries & celebration transportation packages',
      color: 'from-red-500 to-red-600',
      features: ['Party Vans', 'Decorations', 'Music System', 'Custom Packages'],
      price: 399,
      image: 'https://images.unsplash.com/photo-1599912027667-755b68b4dd3b?w=800'
    }
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center max-w-4xl mx-auto" {...fadeIn}>
            <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase">OUR SERVICES</h1>
            <p className="text-xl font-bold text-gray-300">
              Comprehensive luxury transportation solutions for every occasion
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -10 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-2xl transition-all">
                  <div className="h-56 overflow-hidden">
                    <ImageWithFallback
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className={`bg-gradient-to-br ${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-black text-2xl mb-3 text-gray-900">{service.title}</h3>
                    <p className="font-semibold text-gray-600 mb-4">{service.desc}</p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-bold text-gray-600 mb-2">INCLUDES:</p>
                      <ul className="space-y-2">
                        {service.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Check className="w-4 h-4 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-bold text-gray-600">STARTING FROM</p>
                        <p className="text-3xl font-black text-orange-600">${service.price}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleShopifyCheckout({ name: service.title, price: service.price })}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-black text-lg py-6"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      BOOK NOW
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
