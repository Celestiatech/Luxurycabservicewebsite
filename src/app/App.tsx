import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Users, Clock, Check, Star, Shield, Award, Car, Plane, Building2, Heart, Navigation, ChevronRight, MessageCircle, FileText, DollarSign, Zap, UserCheck, ArrowUp, X, CreditCard, ShoppingCart, Play, Quote, CheckCircle2, ArrowRight, Calendar, Sparkles, TrendingUp, Globe, Award as Trophy, Target } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    passengers: '',
    vehicle: '',
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [bookingStep, setBookingStep] = useState(1);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopifyCheckout = (packageData: any) => {
    setSelectedPackage(packageData);
    setShowBookingModal(true);
    setBookingStep(1);
  };

  const proceedToCheckout = () => {
    // Here you would integrate with Shopify Buy SDK
    const shopifyData = {
      ...formData,
      package: selectedPackage,
      totalAmount: selectedPackage?.price
    };
    console.log('Proceeding to Shopify checkout with:', shopifyData);
    alert('Redirecting to secure Shopify checkout...\n\nYour booking details have been saved!');
    setShowBookingModal(false);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const slideIn = {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.7 }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

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

  const services = [
    { icon: Plane, title: 'AIRPORT TRANSFERS', desc: '24/7 Auckland Airport pickup & drop-off', color: 'from-blue-500 to-blue-600' },
    { icon: Heart, title: 'WEDDING SERVICES', desc: 'Luxury wedding car hire with chauffeur', color: 'from-pink-500 to-pink-600' },
    { icon: Building2, title: 'CITY TOURS', desc: 'Guided Auckland sightseeing packages', color: 'from-purple-500 to-purple-600' },
    { icon: Navigation, title: 'INTERCITY TRAVEL', desc: 'Comfortable rides to Hamilton, Rotorua & more', color: 'from-orange-500 to-orange-600' },
    { icon: Sparkles, title: 'CORPORATE EVENTS', desc: 'Business meetings & conference transport', color: 'from-green-500 to-green-600' },
    { icon: Trophy, title: 'SPECIAL OCCASIONS', desc: 'Birthdays, anniversaries & celebrations', color: 'from-red-500 to-red-600' }
  ];

  const vehicles = [
    {
      name: 'LUXURY SEDAN',
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
      features: ['Spacious Interior', 'Entertainment System', 'USB Charging', 'Climate Control', 'Free WiFi', 'Luxury Seating']
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

  const testimonials = [
    { name: 'Sarah Thompson', country: 'UK', rating: 5, text: 'Absolutely fantastic service! Driver was on time, professional, and the vehicle was immaculate. Highly recommend for airport transfers.', service: 'Airport Transfer' },
    { name: 'David Chen', country: 'Singapore', rating: 5, text: 'Best city tour we\'ve ever experienced. Our guide was knowledgeable and friendly. Great value for money!', service: 'City Tour' },
    { name: 'Emily Wilson', country: 'Australia', rating: 5, text: 'Perfect for our wedding day! The 12-seater van was spacious and elegant. Made our day extra special.', service: 'Wedding' },
    { name: 'Michael Brown', country: 'USA', rating: 5, text: 'Reliable intercity transfer from Auckland to Hamilton. Comfortable ride and great communication.', service: 'Intercity' },
    { name: 'Lisa Anderson', country: 'Canada', rating: 5, text: 'The Waiheke wine tour was incredible! Everything was organized perfectly. Will book again!', service: 'Wine Tour' },
    { name: 'James Kumar', country: 'India', rating: 5, text: 'Professional corporate transport for our conference. Punctual, clean vehicles, and excellent service.', service: 'Corporate' }
  ];

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

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Top Bar */}
      <motion.div
        className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 text-white py-2.5 text-center font-bold shadow-lg overflow-hidden"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3 text-sm md:text-base">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>SPECIAL OFFER: Book Any Auckland Tour & Get 10% OFF! Call +64 27 777 7242</span>
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
      </motion.div>

      {/* Header */}
      <motion.header
        className="bg-white shadow-lg sticky top-0 z-40 border-b-2 border-orange-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl shadow-xl">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="font-black text-xl md:text-2xl text-gray-900 tracking-tight">LUXURY CABS LTD</h1>
                <p className="text-xs font-bold text-orange-600 tracking-wider">PREMIUM VANS & TOURS</p>
              </div>
            </motion.div>
            <div className="hidden lg:flex items-center gap-6">
              <a href="#services" className="font-bold text-gray-700 hover:text-orange-600 transition-colors">SERVICES</a>
              <a href="#fleet" className="font-bold text-gray-700 hover:text-orange-600 transition-colors">FLEET</a>
              <a href="#tours" className="font-bold text-gray-700 hover:text-orange-600 transition-colors">TOURS</a>
              <a href="#membership" className="font-bold text-gray-700 hover:text-orange-600 transition-colors">MEMBERSHIP</a>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-bold shadow-lg">
                <ShoppingCart className="w-4 h-4 mr-2" />
                BOOK NOW
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Contact Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-4">
            <motion.a
              href="tel:+64277777242"
              className="flex items-center gap-2 hover:text-orange-400 transition group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-orange-500 p-2 rounded-full group-hover:scale-110 transition">
                <Phone className="w-4 h-4" />
              </div>
              <span className="font-bold">+64 27 777 7242</span>
            </motion.a>
            <motion.a
              href="mailto:Luxurycabsltd@gmail.com"
              className="flex items-center gap-2 hover:text-orange-400 transition group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-orange-500 p-2 rounded-full group-hover:scale-110 transition">
                <Mail className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm md:text-base">Luxurycabsltd@gmail.com</span>
            </motion.a>
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-orange-500 p-2 rounded-full">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm md:text-base">Auckland Airport & City</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <motion.a
        href="https://wa.me/64277777242"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed left-6 bottom-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
      >
        <MessageCircle className="w-7 h-7" />
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          1
        </div>
      </motion.a>

      <motion.button
        onClick={() => setShowInquiryForm(true)}
        className="fixed right-6 bottom-24 z-50 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-full shadow-2xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2 }}
      >
        <FileText className="w-7 h-7" />
      </motion.button>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            onClick={scrollToTop}
            className="fixed right-6 bottom-6 z-50 bg-gray-900 hover:bg-black text-white p-4 rounded-full shadow-2xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <ArrowUp className="w-7 h-7" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quick Inquiry Modal */}
      <AnimatePresence>
        {showInquiryForm && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInquiryForm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="max-w-md w-full shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-black">QUICK INQUIRY</CardTitle>
                    <button onClick={() => setShowInquiryForm(false)} className="hover:bg-white/20 p-2 rounded-full transition">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <CardDescription className="text-orange-100 font-bold">Get response within 30 minutes!</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Input placeholder="Your Name *" className="font-semibold border-2" />
                  <Input placeholder="Phone Number *" type="tel" className="font-semibold border-2" />
                  <Input placeholder="Email Address *" type="email" className="font-semibold border-2" />
                  <Input placeholder="Pickup Location" className="font-semibold border-2" />
                  <Input placeholder="Drop-off Location" className="font-semibold border-2" />
                  <textarea
                    placeholder="Additional Requirements..."
                    className="w-full border-2 rounded-md p-3 font-semibold min-h-24"
                  />
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-black text-lg py-6">
                    SUBMIT INQUIRY
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multi-Step Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="my-8"
            >
              <Card className="max-w-2xl w-full shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-black">BOOK YOUR LUXURY RIDE</CardTitle>
                    <button onClick={() => setShowBookingModal(false)} className="hover:bg-white/20 p-2 rounded-full transition">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  {selectedPackage && (
                    <CardDescription className="text-white font-bold text-lg mt-2">
                      {selectedPackage.name} - ${selectedPackage.price}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  {/* Progress Steps */}
                  <div className="flex items-center justify-between mb-8">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${
                          bookingStep >= step ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {bookingStep > step ? <Check className="w-5 h-5" /> : step}
                        </div>
                        {step < 3 && (
                          <div className={`w-16 md:w-32 h-1 mx-2 transition-all ${
                            bookingStep > step ? 'bg-orange-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Trip Details */}
                  {bookingStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-black text-gray-900 mb-4">TRIP DETAILS</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Pickup Location *"
                          value={formData.pickup}
                          onChange={(e) => setFormData({...formData, pickup: e.target.value})}
                          className="font-semibold border-2"
                        />
                        <Input
                          placeholder="Drop-off Location *"
                          value={formData.dropoff}
                          onChange={(e) => setFormData({...formData, dropoff: e.target.value})}
                          className="font-semibold border-2"
                        />
                        <Input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="font-semibold border-2"
                        />
                        <Input
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({...formData, time: e.target.value})}
                          className="font-semibold border-2"
                        />
                        <select
                          className="w-full border-2 rounded-md p-2.5 font-semibold"
                          value={formData.passengers}
                          onChange={(e) => setFormData({...formData, passengers: e.target.value})}
                        >
                          <option value="">Number of Passengers *</option>
                          <option value="1-2">1-2 Passengers</option>
                          <option value="3-4">3-4 Passengers</option>
                          <option value="5-7">5-7 Passengers</option>
                          <option value="8-11">8-11 Passengers</option>
                        </select>
                        <select
                          className="w-full border-2 rounded-md p-2.5 font-semibold"
                          value={formData.vehicle}
                          onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                        >
                          <option value="">Select Vehicle Type *</option>
                          <option value="sedan">Luxury Sedan</option>
                          <option value="minivan">Mini Van (7-Seater)</option>
                          <option value="largevan">Large Van (12-Seater)</option>
                        </select>
                      </div>
                      <textarea
                        placeholder="Special Requests (Optional)"
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                        className="w-full border-2 rounded-md p-3 font-semibold min-h-24"
                      />
                      <Button
                        onClick={() => setBookingStep(2)}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-black text-lg py-6"
                      >
                        CONTINUE <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>
                  )}

                  {/* Step 2: Personal Details */}
                  {bookingStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-black text-gray-900 mb-4">YOUR DETAILS</h3>
                      <Input
                        placeholder="Full Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="font-semibold border-2"
                      />
                      <Input
                        placeholder="Email Address *"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="font-semibold border-2"
                      />
                      <Input
                        placeholder="Phone Number *"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="font-semibold border-2"
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={() => setBookingStep(1)}
                          variant="outline"
                          className="flex-1 font-black text-lg py-6 border-2"
                        >
                          BACK
                        </Button>
                        <Button
                          onClick={() => setBookingStep(3)}
                          className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-black text-lg py-6"
                        >
                          CONTINUE <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Confirmation & Checkout */}
                  {bookingStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-4"
                    >
                      <h3 className="text-xl font-black text-gray-900 mb-4">REVIEW & CHECKOUT</h3>
                      <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-700">Package:</span>
                          <span className="font-black text-gray-900">{selectedPackage?.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-700">Date & Time:</span>
                          <span className="font-black text-gray-900">{formData.date} at {formData.time}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-700">Pickup:</span>
                          <span className="font-black text-gray-900">{formData.pickup}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-700">Passengers:</span>
                          <span className="font-black text-gray-900">{formData.passengers}</span>
                        </div>
                        <div className="border-t-2 border-orange-300 pt-3 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-700 text-lg">TOTAL:</span>
                            <span className="font-black text-orange-600 text-3xl">${selectedPackage?.price}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-gray-900">Secure Shopify Checkout</p>
                            <p className="text-sm font-semibold text-gray-600">Your payment is processed securely through Shopify. You can pay with credit card, PayPal, or other payment methods.</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => setBookingStep(2)}
                          variant="outline"
                          className="flex-1 font-black text-lg py-6 border-2"
                        >
                          BACK
                        </Button>
                        <Button
                          onClick={proceedToCheckout}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 font-black text-lg py-6"
                        >
                          <CreditCard className="w-5 h-5 mr-2" />
                          PROCEED TO CHECKOUT
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1603122101829-e56305b0a5f7?w=1920"
            alt="Luxury Car"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              AUCKLAND'S PREMIER LUXURY CAB & TOUR SERVICE
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl font-bold text-orange-100 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Airport Transfers | City Tours | Intercity Travel | Wedding Cars
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4 justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-6 py-3 rounded-full">
                <Check className="w-6 h-6" />
                <span className="font-bold text-lg">24/7 Service</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-6 py-3 rounded-full">
                <Check className="w-6 h-6" />
                <span className="font-bold text-lg">Best Prices</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-6 py-3 rounded-full">
                <Check className="w-6 h-6" />
                <span className="font-bold text-lg">Professional Drivers</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Button
                size="lg"
                onClick={() => {
                  setSelectedPackage(tourPackages[0]);
                  setShowBookingModal(true);
                }}
                className="bg-white text-orange-600 hover:bg-gray-100 font-black text-xl px-12 py-8 shadow-2xl"
              >
                <ShoppingCart className="w-6 h-6 mr-3" />
                BOOK YOUR RIDE NOW
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '500+', label: 'HAPPY CUSTOMERS' },
              { number: '24/7', label: 'SERVICE AVAILABLE' },
              { number: '15+', label: 'LUXURY VEHICLES' },
              { number: '10+', label: 'YEARS EXPERIENCE' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                {...fadeIn}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl md:text-5xl font-black text-orange-500 mb-2">{stat.number}</div>
                <div className="font-bold text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase">OUR PREMIUM SERVICES</h2>
            <p className="text-xl font-bold text-gray-600 max-w-3xl mx-auto">
              Comprehensive luxury transportation for every occasion
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                {...fadeIn}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <Card className="h-full hover:shadow-2xl transition-all border-t-4 border-orange-500 cursor-pointer">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className={`bg-gradient-to-br ${service.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                      <service.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-black text-xl mb-3 text-gray-900">{service.title}</h3>
                    <p className="font-semibold text-gray-600 mb-4">{service.desc}</p>
                    <Button variant="outline" className="font-bold border-2 border-orange-500 text-orange-600 hover:bg-orange-50">
                      LEARN MORE <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Packages with Shopify Integration */}
      <section id="tours" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase">AUCKLAND TOUR PACKAGES</h2>
            <p className="text-xl font-bold text-gray-600 max-w-3xl mx-auto">
              Book directly online with secure Shopify checkout
            </p>
          </motion.div>
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

      {/* Fleet Section */}
      <section id="fleet" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase">OUR LUXURY FLEET</h2>
            <p className="text-xl font-bold text-gray-300 max-w-3xl mx-auto">
              Premium vehicles for the ultimate comfort
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={index}
                {...slideIn}
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

      {/* Membership Plans */}
      <section id="membership" className="py-20 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 uppercase">MEMBERSHIP PLANS</h2>
            <p className="text-xl font-bold text-gray-600 max-w-3xl mx-auto">
              Save more with our exclusive membership programs
            </p>
          </motion.div>
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase">CUSTOMER REVIEWS</h2>
            <p className="text-xl font-bold text-gray-300 max-w-3xl mx-auto">
              See what our happy customers say about us
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                {...fadeIn}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <Card className="h-full bg-white text-gray-900 hover:shadow-2xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <div className="mb-4">
                      <Quote className="w-8 h-8 text-orange-500 mb-2" />
                      <p className="font-semibold text-gray-700 italic">{testimonial.text}</p>
                    </div>
                    <div className="border-t-2 border-gray-200 pt-4">
                      <p className="font-black text-gray-900">{testimonial.name}</p>
                      <p className="text-sm font-bold text-gray-500">{testimonial.country}</p>
                      <div className="mt-2 inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                        {testimonial.service}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div className="max-w-5xl mx-auto" {...scaleIn}>
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-12 text-white text-center shadow-2xl">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white/20 backdrop-blur w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 cursor-pointer">
                  <Play className="w-12 h-12" />
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-4">SEE OUR FLEET IN ACTION</h3>
                <p className="text-xl font-bold mb-6">Watch how we deliver luxury transportation experience</p>
                <Button className="bg-white text-orange-600 hover:bg-gray-100 font-black text-lg px-8 py-6">
                  WATCH VIDEO
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gray-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1558222209-134191edfe0d?w=1920"
            alt="Luxury Service"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div {...fadeIn}>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white uppercase">READY FOR LUXURY?</h2>
            <p className="text-xl md:text-2xl mb-10 text-orange-300 font-bold max-w-3xl mx-auto">
              Book now with secure Shopify checkout and enjoy premium service
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <motion.a
                href="tel:+64277777242"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 font-black text-xl px-12 py-8">
                  <Phone className="w-6 h-6 mr-3" />
                  CALL NOW
                </Button>
              </motion.a>
              <motion.button
                onClick={() => {
                  setSelectedPackage(tourPackages[0]);
                  setShowBookingModal(true);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-black text-xl px-12 py-8">
                  <ShoppingCart className="w-6 h-6 mr-3" />
                  BOOK ONLINE
                </Button>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <motion.div
                className="flex items-center gap-3 mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-xl">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-xl">LUXURY CABS LTD</h3>
                </div>
              </motion.div>
              <p className="text-gray-400 font-semibold mb-4">
                Auckland's premier luxury taxi and tour service provider.
              </p>
            </div>
            <div>
              <h4 className="font-black mb-4 text-orange-400 text-lg">QUICK LINKS</h4>
              <ul className="space-y-2 font-semibold text-gray-400">
                <li><a href="#services" className="hover:text-orange-400 transition">Services</a></li>
                <li><a href="#fleet" className="hover:text-orange-400 transition">Our Fleet</a></li>
                <li><a href="#tours" className="hover:text-orange-400 transition">Tour Packages</a></li>
                <li><a href="#membership" className="hover:text-orange-400 transition">Membership</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 text-orange-400 text-lg">SERVICES</h4>
              <ul className="space-y-2 font-semibold text-gray-400">
                <li><a href="#" className="hover:text-orange-400 transition">Airport Transfers</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">City Tours</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Intercity Travel</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Wedding Cars</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 text-orange-400 text-lg">CONTACT</h4>
              <ul className="space-y-4 font-semibold text-gray-400">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-400 mt-1" />
                  <a href="tel:+64277777242" className="hover:text-orange-400 transition font-black text-white">
                    +64 27 777 7242
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-orange-400 mt-1" />
                  <a href="mailto:Luxurycabsltd@gmail.com" className="hover:text-orange-400 transition break-all">
                    Luxurycabsltd@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 font-semibold">&copy; 2026 LUXURY CABS LTD. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
