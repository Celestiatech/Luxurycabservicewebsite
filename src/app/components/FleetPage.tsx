import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Users, CheckCircle2, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FleetPageProps {
  handleShopifyCheckout: (data: any) => void;
}

export function FleetPage({ handleShopifyCheckout }: FleetPageProps) {
  const vehicles = [
    {
      name: 'AFFORDABLE SEDAN',
      passengers: '1-4 Passengers',
      luggage: '3-4 Suitcases',
      hourlyRate: 75,
      cityTour: 499,
      image: 'https://images.unsplash.com/photo-1599912027667-755b68b4dd3b?w=600',
      features: ['Premium Leather', 'Climate Control', 'Free WiFi', 'Phone Chargers', 'Bottled Water', 'Professional Chauffeur']
    },
    {
      name: 'MINI VAN',
      passengers: '5-7 Passengers',
      luggage: '5-7 Suitcases',
      hourlyRate: 95,
      cityTour: 699,
      image: 'https://images.unsplash.com/photo-1624976609551-0d7577bd4ce2?w=600',
      features: ['Spacious Interior', 'Entertainment System', 'USB Charging', 'Climate Control', 'Free WiFi', 'Affordable Seating']
    },
    {
      name: 'LARGE VAN (12 SEATER)',
      passengers: 'Up to 11 Passengers',
      luggage: '10-12 Suitcases',
      hourlyRate: 125,
      cityTour: 990,
      image: 'https://images.unsplash.com/photo-1649136378672-b965cb9935d5?w=600',
      features: ['Maximum Capacity', 'Full Air Con', 'Entertainment', 'Ample Storage', 'Group Friendly', 'Professional Driver']
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
            <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase">OUR AFFORDABLE FLEET</h1>
            <p className="text-xl font-bold text-gray-300">
              Premium vehicles maintained to the highest standards for your comfort
            </p>
          </motion.div>
        </div>
      </section>

      {/* Fleet Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all bg-white">
                  <div className="h-64 overflow-hidden">
                    <ImageWithFallback
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-black text-2xl mb-4 text-gray-900">{vehicle.name}</h3>
                    <div className="flex items-center gap-6 mb-6 pb-6 border-b-2 border-gray-200">
                      <div className="flex items-center gap-2 font-bold text-gray-700">
                        <Users className="w-5 h-5 text-orange-500" />
                        {vehicle.passengers}
                      </div>
                      <div className="flex items-center gap-2 font-bold text-gray-700">
                        <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {vehicle.luggage}
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 rounded-lg mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold">HOURLY RATE</span>
                        <span className="text-2xl font-black">${vehicle.hourlyRate}/hr</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">CITY TOUR (3HR)</span>
                        <span className="text-3xl font-black">${vehicle.cityTour}</span>
                      </div>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {vehicle.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 font-semibold text-gray-700">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleShopifyCheckout({...vehicle, name: vehicle.name, price: vehicle.cityTour})}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-black text-lg py-6"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      BOOK THIS VEHICLE
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
