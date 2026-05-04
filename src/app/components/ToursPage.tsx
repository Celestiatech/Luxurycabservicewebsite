import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Clock, Star, CheckCircle2, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ToursPageProps {
  handleShopifyCheckout: (data: any) => void;
}

export function ToursPage({ handleShopifyCheckout }: ToursPageProps) {
  const tourPackages = [
    {
      id: 1,
      name: 'AUCKLAND CITY HIGHLIGHTS',
      duration: '3 Hours',
      price: 499,
      vanPrice: 990,
      image: 'https://images.unsplash.com/photo-1595125989588-36d745a2a828?w=800',
      highlights: ['Sky Tower Visit', 'Harbour Bridge', 'Viaduct Harbour', 'Queen Street', 'Mission Bay', 'Parnell Village'],
      includes: ['Professional Guide', 'Free WiFi', 'Bottled Water', 'Photo Stops']
    },
    {
      id: 2,
      name: 'WAIHEKE ISLAND WINE TOUR',
      duration: '6 Hours',
      price: 899,
      vanPrice: 1790,
      image: 'https://images.unsplash.com/photo-1602847189686-6bb361a3066d?w=800',
      highlights: ['Ferry Transport', '3 Premium Wineries', 'Gourmet Lunch', 'Scenic Beaches', 'Wine Tasting', 'Island Tour'],
      includes: ['All Entrance Fees', 'Lunch Included', 'Wine Tasting', 'Return Ferry']
    },
    {
      id: 3,
      name: 'WEST COAST BEACHES',
      duration: '5 Hours',
      price: 749,
      vanPrice: 1490,
      image: 'https://images.unsplash.com/photo-1677557769755-875d8141c0c6?w=800',
      highlights: ['Piha Beach', 'Karekare Falls', 'Rainforest Walk', 'Black Sand Beach', 'Lion Rock', 'Surf Culture'],
      includes: ['Nature Guide', 'Beach Time', 'Photo Stops', 'Refreshments']
    },
    {
      id: 4,
      name: 'HOBBITON & ROTORUA',
      duration: 'Full Day',
      price: 1499,
      vanPrice: 2990,
      image: 'https://images.unsplash.com/photo-1677557771394-f4fa56446952?w=800',
      highlights: ['Hobbiton Movie Set', 'Rotorua Geothermal', 'Maori Culture', 'Te Puia Geysers', 'Lunch Included', 'Return Transport'],
      includes: ['All Entry Tickets', 'Lunch & Snacks', 'Expert Guide', 'Photo Package']
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
            <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase">AUCKLAND TOUR PACKAGES</h1>
            <p className="text-xl font-bold text-gray-300">
              Book directly online with secure Shopify checkout
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tourPackages.map((tour, index) => (
              <motion.div
                key={tour.id}
                {...scaleIn}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -10 }}
              >
                <Card className="h-full overflow-hidden hover:shadow-2xl transition-all cursor-pointer">
                  <div className="h-64 overflow-hidden relative">
                    <ImageWithFallback
                      src={tour.image}
                      alt={tour.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-black text-sm shadow-lg">
                      {tour.duration}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-black text-xl mb-3 text-gray-900">{tour.name}</h3>
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
                      <div className="text-sm font-black text-gray-700 mb-1">SEDAN (1-4 PAX)</div>
                      <div className="text-3xl font-black text-orange-600">${tour.price}</div>
                      <div className="text-sm font-black text-gray-700 mt-3 mb-1">VAN (8-11 PAX)</div>
                      <div className="text-2xl font-black text-gray-900">${tour.vanPrice}</div>
                    </div>
                    <div className="mb-4">
                      <p className="font-bold text-gray-700 mb-2 text-sm">HIGHLIGHTS:</p>
                      <div className="space-y-1">
                        {tour.highlights.slice(0, 4).map((highlight, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                            {highlight}
                          </div>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleShopifyCheckout(tour)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-black text-base py-6"
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
