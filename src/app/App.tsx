import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Calendar, Users, Clock, Check, Star, Shield, Headphones, Award, Car, Plane, Building2, Heart, Navigation, ChevronRight, MessageCircle, FileText, DollarSign, Zap, UserCheck, ArrowUp, CreditCard, Smartphone, Briefcase, Gift, Download, PlayCircle, Globe, Wifi, Coffee, Music, Sparkles, Baby, Luggage } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

export default function App() {
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    passengers: '',
    vehicle: ''
  });

  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const services = [
    { title: 'Airport Transfers', desc: '24/7 Auckland Airport pickup and drop-off with flight tracking and meet & greet service', icon: Plane, color: 'from-blue-500 to-blue-600' },
    { title: 'Wedding Services', desc: 'Make your special day memorable with our luxury decorated vehicles and professional chauffeurs', icon: Heart, color: 'from-pink-500 to-pink-600' },
    { title: 'City Tours', desc: 'Explore Auckland top attractions with our knowledgeable guides in comfortable luxury vehicles', icon: Building2, color: 'from-purple-500 to-purple-600' },
    { title: 'Intercity Travel', desc: 'Long distance travel to Hamilton, Rotorua, Tauranga and other major New Zealand cities', icon: Navigation, color: 'from-orange-500 to-orange-600' },
    { title: 'Corporate Travel', desc: 'Professional business transportation with monthly billing and dedicated account management', icon: Briefcase, color: 'from-green-500 to-green-600' },
    { title: 'Special Events', desc: 'Birthdays, anniversaries, concerts - we handle all your special occasion transportation', icon: Gift, color: 'from-red-500 to-red-600' }
  ];

  const routes = [
    { from: 'Auckland Airport', to: 'City Center', sedan: '$65', van: '$120', time: '35 min' },
    { from: 'Auckland', to: 'Hamilton', sedan: '$180', van: '$320', time: '1h 45min' },
    { from: 'Auckland', to: 'Rotorua', sedan: '$350', van: '$630', time: '3h 15min' },
    { from: 'Auckland', to: 'Tauranga', sedan: '$320', van: '$580', time: '2h 50min' },
    { from: 'Auckland Airport', to: 'North Shore', sedan: '$75', van: '$140', time: '45 min' },
    { from: 'Auckland', to: 'Wellington', sedan: '$850', van: '$1,520', time: '8h 30min' }
  ];

  const vehicles = [
    {
      name: 'Luxury Sedan',
      capacity: '1-4 Passengers',
      luggage: '3-4 Bags',
      price: '$499',
      image: 'https://images.unsplash.com/photo-1599912027667-755b68b4dd3b?w=600',
      features: ['Premium Leather Seats', 'Climate Control', 'Free WiFi', 'Phone Chargers', 'Bottled Water', 'Professional Chauffeur']
    },
    {
      name: 'Mini Van (7 Seater)',
      capacity: '5-7 Passengers',
      luggage: '5-7 Bags',
      price: '$699',
      image: 'https://images.unsplash.com/photo-1624976609551-0d7577bd4ce2?w=600',
      features: ['Spacious Interior', 'Entertainment System', 'Free WiFi', 'USB Charging', 'Air Conditioning', 'Perfect for Families']
    },
    {
      name: 'Large Van (12 Seater)',
      capacity: 'Up to 11 Passengers',
      luggage: '10-12 Bags',
      price: '$990',
      image: 'https://images.unsplash.com/photo-1765461734605-34657fa04db2?w=600',
      features: ['Maximum Capacity', 'Ample Luggage Space', 'Full AC', 'Entertainment', 'Group Friendly', 'Professional Driver']
    }
  ];

  const tours = [
    {
      name: 'Auckland City Highlights',
      duration: '3 Hours',
      sedan: '$499',
      van: '$990',
      image: 'https://images.unsplash.com/photo-1677557771394-f4fa56446952?w=600',
      highlights: ['Sky Tower Visit', 'Harbour Bridge', 'Viaduct Harbour', 'Queen Street Shopping', 'Mission Bay Beach']
    },
    {
      name: 'Waiheke Island Wine Tour',
      duration: '6 Hours',
      sedan: '$899',
      van: '$1,790',
      image: 'https://images.unsplash.com/photo-1602847189686-6bb361a3066d?w=600',
      highlights: ['Ferry Transport', '3 Premium Wineries', 'Lunch Included', 'Scenic Coastal Drive', 'Beach Stop']
    },
    {
      name: 'West Coast & Black Sand',
      duration: '5 Hours',
      sedan: '$749',
      van: '$1,490',
      image: 'https://images.unsplash.com/photo-1618130075350-850c3a24fa5d?w=600',
      highlights: ['Piha Beach', 'Karekare Falls', 'Rainforest Walk', 'Lion Rock', 'Surf Beach']
    },
    {
      name: 'Hobbiton Movie Set Tour',
      duration: '8 Hours',
      sedan: '$1,199',
      van: '$2,390',
      image: 'https://images.unsplash.com/photo-1595125988905-8f407ecb399f?w=600',
      highlights: ['Hobbiton Movie Set', 'Matamata Farmland', 'Shire Experience', 'Lunch at Green Dragon', 'Photo Opportunities']
    }
  ];

  const testimonials = [
    { name: 'Sarah Johnson', location: 'London, UK', text: 'Excellent service from start to finish. The driver was waiting for us at Auckland Airport with a sign. Vehicle was spotless and the ride was very comfortable. Highly recommend!', rating: 5, service: 'Airport Transfer' },
    { name: 'David Chen', location: 'Singapore', text: 'We booked the Auckland city tour for our family of 6. The van was spacious and clean. Our driver was very knowledgeable about the city and took us to all the best spots. Great value!', rating: 5, service: 'City Tour' },
    { name: 'Emily Wilson', location: 'Sydney, Australia', text: 'Used Luxury Cabs for our wedding last month. They provided a beautiful decorated vehicle and the service was impeccable. Made our day extra special!', rating: 5, service: 'Wedding' },
    { name: 'Michael Brown', location: 'Los Angeles, USA', text: 'Needed a reliable transfer from Auckland to Hamilton for a business meeting. The driver was professional, punctual and the ride was smooth. Will use again!', rating: 5, service: 'Intercity' },
    { name: 'Priya Patel', location: 'Mumbai, India', text: 'Booked a 12-seater van for our group tour. Everything was perfect - comfortable seats, air conditioning worked great, and the driver was very helpful. Thank you!', rating: 5, service: 'Group Tour' },
    { name: 'James Smith', location: 'Auckland, NZ', text: 'Regular customer for corporate travel. Always professional, always on time. Their monthly billing system makes expense management easy. Excellent service!', rating: 5, service: 'Corporate' }
  ];

  const whyChoose = [
    { icon: Shield, title: 'Fully Licensed & Insured', desc: 'All vehicles and drivers are fully licensed and insured for your safety and peace of mind' },
    { icon: Clock, title: '24/7 Service Available', desc: 'Round the clock service available 365 days a year including holidays and weekends' },
    { icon: DollarSign, title: 'Transparent Pricing', desc: 'No hidden charges or surge pricing. What you see is what you pay' },
    { icon: UserCheck, title: 'Professional Drivers', desc: 'Experienced, background-checked drivers who are courteous and knowledgeable' },
    { icon: Award, title: '10+ Years Experience', desc: 'Serving Auckland since 2016 with thousands of satisfied customers' },
    { icon: Headphones, title: 'Live Customer Support', desc: '24/7 customer support via phone, WhatsApp, and email' }
  ];

  const safetyMeasures = [
    { icon: Shield, text: 'GPS Tracking on All Vehicles' },
    { icon: Check, text: 'Regular Vehicle Sanitization' },
    { icon: UserCheck, text: 'Driver Temperature Checks' },
    { icon: CreditCard, text: 'Contactless Payment Options' },
    { icon: Headphones, text: 'Emergency Support Button' },
    { icon: Check, text: 'First Aid Kit in Every Vehicle' },
    { icon: Baby, text: 'Child Safety Seats Available' },
    { icon: Shield, text: 'CCTV in All Vehicles' }
  ];

  const amenities = [
    { icon: Wifi, text: 'Free WiFi' },
    { icon: Coffee, text: 'Bottled Water' },
    { icon: Music, text: 'Entertainment System' },
    { icon: Phone, text: 'Phone Chargers' },
    { icon: Sparkles, text: 'Premium Interiors' },
    { icon: Luggage, text: 'Spacious Luggage' }
  ];

  const paymentOptions = [
    { icon: DollarSign, name: 'Cash Payment' },
    { icon: CreditCard, name: 'Credit/Debit Cards' },
    { icon: Smartphone, name: 'Online Payment' },
    { icon: Briefcase, name: 'Bank Transfer' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 text-center">
        <p className="text-sm md:text-base px-4">
          <Sparkles className="w-4 h-4 inline mr-2" />
          <strong>SPECIAL OFFER:</strong> Book Online & Get 10% OFF on All Auckland Tours | Call +64 27 777 7242
        </p>
      </div>

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2.5 rounded-lg">
                <Car className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">LUXURY CABS LTD</h1>
                <p className="text-xs text-orange-600 font-semibold">Vans & Tours Specialist</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-6">
              <a href="#services" className="text-gray-700 hover:text-orange-600 font-semibold transition">Services</a>
              <a href="#fleet" className="text-gray-700 hover:text-orange-600 font-semibold transition">Fleet</a>
              <a href="#tours" className="text-gray-700 hover:text-orange-600 font-semibold transition">Tours</a>
              <a href="#testimonials" className="text-gray-700 hover:text-orange-600 font-semibold transition">Reviews</a>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Bar */}
      <div className="bg-gray-900 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 text-sm">
            <a href="tel:+64277777242" className="flex items-center gap-2 hover:text-orange-400 transition">
              <Phone className="w-4 h-4" />
              <span className="font-semibold">+64 27 777 7242</span>
            </a>
            <a href="mailto:Luxurycabsltd@gmail.com" className="flex items-center gap-2 hover:text-orange-400 transition">
              <Mail className="w-4 h-4" />
              <span className="font-semibold">Luxurycabsltd@gmail.com</span>
            </a>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="font-semibold">Auckland Airport & City Based</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <a
        href="https://wa.me/64277777242"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed left-4 md:left-6 bottom-6 z-50 bg-green-500 hover:bg-green-600 text-white p-3 md:p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
      >
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
          1
        </span>
      </a>

      <button
        onClick={() => setShowInquiryForm(!showInquiryForm)}
        className="fixed right-4 md:right-6 bottom-24 z-50 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-3 md:p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
      >
        <FileText className="w-6 h-6 md:w-7 md:h-7" />
      </button>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-4 md:right-6 bottom-6 z-50 bg-gray-900 hover:bg-black text-white p-3 md:p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
        >
          <ArrowUp className="w-6 h-6 md:w-7 md:h-7" />
        </button>
      )}

      {/* Inquiry Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowInquiryForm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Inquiry</h3>
            <p className="text-gray-600 mb-6">Send us your details for instant quote!</p>
            <div className="space-y-4">
              <Input placeholder="Your Name" />
              <Input placeholder="Phone Number" type="tel" />
              <Input placeholder="Email Address" type="email" />
              <Input placeholder="Pickup Location" />
              <Input placeholder="Drop-off Location" />
              <textarea className="w-full border rounded-lg p-3" rows={3} placeholder="Additional Requirements..."></textarea>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 py-6">
                Submit Inquiry
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 md:py-24">
        <div className="absolute inset-0 opacity-10">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1617530821773-2414262045d2?w=1920"
            alt="Auckland"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Auckland's Premium Taxi & Tour Service
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-6">
              Airport Transfers | City Tours | Intercity Travel | Wedding Cars | Corporate Transport
            </p>
            <div className="flex flex-wrap gap-4 justify-center text-base md:text-lg">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 md:px-6 py-2 md:py-3 rounded-full">
                <Check className="w-5 h-5" />
                <span>24/7 Service</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 md:px-6 py-2 md:py-3 rounded-full">
                <Check className="w-5 h-5" />
                <span>Best Prices</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-4 md:px-6 py-2 md:py-3 rounded-full">
                <Check className="w-5 h-5" />
                <span>Professional Drivers</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
              <h3 className="text-2xl md:text-3xl font-bold">Book Your Ride Now</h3>
              <p className="text-orange-100">Get instant quote & confirmation</p>
            </div>
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pickup Location</label>
                  <Input placeholder="Enter pickup address" value={formData.pickup} onChange={(e) => setFormData({ ...formData, pickup: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Drop-off Location</label>
                  <Input placeholder="Enter destination" value={formData.dropoff} onChange={(e) => setFormData({ ...formData, dropoff: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Type</label>
                  <select className="w-full border rounded-lg p-2.5" value={formData.vehicle} onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}>
                    <option value="">Select Vehicle</option>
                    <option value="sedan">Luxury Sedan (1-4 pax)</option>
                    <option value="minivan">Mini Van (5-7 pax)</option>
                    <option value="largevan">Large Van (8-11 pax)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Travel Date</label>
                  <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pickup Time</label>
                  <Input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Passengers</label>
                  <Input type="number" placeholder="Number of passengers" value={formData.passengers} onChange={(e) => setFormData({ ...formData, passengers: e.target.value })} />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <Button className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 py-6 text-lg">
                  <Zap className="w-5 h-5 mr-2" />
                  Get Instant Quote
                </Button>
                <a href="tel:+64277777242" className="flex-1">
                  <Button variant="outline" className="w-full py-6 text-lg border-2 border-orange-500 text-orange-600 hover:bg-orange-50">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Now
                  </Button>
                </a>
              </div>
              <div className="mt-6 p-4 bg-orange-50 rounded-lg text-center">
                <p className="text-gray-900">
                  🎉 <strong className="text-orange-600">ONLINE DISCOUNT:</strong> Book now & get 10% off on all city tours!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">500+</div>
              <div className="text-gray-300">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">24/7</div>
              <div className="text-gray-300">Service Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">15+</div>
              <div className="text-gray-300">Luxury Vehicles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2">10+</div>
              <div className="text-gray-300">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-8 border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="w-7 h-7 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">FULLY LICENSED</p>
                <p className="text-xs text-gray-600">NZ Transport Certified</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Check className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">FULLY INSURED</p>
                <p className="text-xs text-gray-600">Comprehensive Coverage</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <Award className="w-7 h-7 text-purple-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">5-STAR RATED</p>
                <p className="text-xs text-gray-600">Top Service Provider</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-full">
                <Headphones className="w-7 h-7 text-orange-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">24/7 SUPPORT</p>
                <p className="text-xs text-gray-600">Always Here For You</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive luxury transportation solutions for all your needs in Auckland
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 hover:shadow-xl transition-shadow border">
                <div className={`bg-gradient-to-br ${service.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.desc}</p>
                <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                  Learn More <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Popular Routes & Pricing</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transparent pricing for most popular routes in and around Auckland
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route, index) => (
              <div key={index} className="bg-white border-2 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                      <p className="font-bold text-gray-900">{route.from}</p>
                    </div>
                    <div className="border-l-2 border-dashed border-gray-300 h-4 ml-1.5"></div>
                    <div className="flex items-center gap-2">
                      <div className="bg-red-500 w-3 h-3 rounded-full"></div>
                      <p className="font-bold text-gray-900">{route.to}</p>
                    </div>
                  </div>
                  <Navigation className="w-6 h-6 text-orange-500" />
                </div>
                <div className="border-t-2 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 text-sm">Sedan (1-4 pax)</span>
                    <span className="text-2xl font-bold text-orange-600">{route.sedan}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-600 text-sm">Van (5-11 pax)</span>
                    <span className="text-2xl font-bold text-orange-600">{route.van}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {route.time}
                    </span>
                    <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section id="fleet" className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Luxury Fleet</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Premium vehicles maintained to the highest standards for your comfort
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicles.map((vehicle, index) => (
              <div key={index} className="bg-white text-gray-900 rounded-xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2">
                <div className="h-64 overflow-hidden">
                  <ImageWithFallback
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{vehicle.name}</h3>
                  <div className="flex items-center gap-6 mb-6 pb-6 border-b-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Users className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold">{vehicle.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Luggage className="w-5 h-5 text-orange-500" />
                      <span className="font-semibold">{vehicle.luggage}</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg mb-4">
                    <div className="text-sm mb-1">City Tour Price (3 hrs)</div>
                    <div className="text-4xl font-bold">{vehicle.price}</div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {vehicle.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-gray-700">
                        <Check className="w-5 h-5 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 py-6">
                    Book This Vehicle
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tours */}
      <section id="tours" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Auckland Tour Packages</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore the best of Auckland with our curated luxury tour packages
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tours.map((tour, index) => (
              <div key={index} className="bg-white border-2 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="h-64 overflow-hidden">
                  <ImageWithFallback
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{tour.name}</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-orange-600">
                      <Clock className="w-5 h-5" />
                      <span className="font-bold">{tour.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-1 text-gray-600">(4.9/5)</span>
                    </div>
                  </div>
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Sedan (1-4 pax)</div>
                        <div className="text-2xl font-bold text-orange-600">{tour.sedan}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">Van (5-11 pax)</div>
                        <div className="text-2xl font-bold text-orange-600">{tour.van}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="font-bold text-gray-700 mb-2">Tour Highlights:</p>
                    <div className="space-y-2">
                      {tour.highlights.map((highlight, hIndex) => (
                        <div key={hIndex} className="flex items-center gap-2 text-gray-600">
                          <Check className="w-4 h-4 text-green-600" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 py-6">
                    Book This Tour
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Luxury Amenities</h2>
            <p className="text-lg text-gray-600">Every ride includes premium features for your comfort</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {amenities.map((amenity, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl border-2 hover:border-orange-500 hover:shadow-lg transition-all">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <amenity.icon className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-sm font-bold text-gray-900">{amenity.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Luxury Cabs Ltd?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your trusted partner for luxury transportation in Auckland
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChoose.map((item, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Measures */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Your Safety is Our Priority</h2>
            <p className="text-lg text-gray-300">Comprehensive safety measures for worry-free travel</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {safetyMeasures.map((measure, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur p-4 rounded-lg">
                <measure.icon className="w-10 h-10 text-orange-400 flex-shrink-0" />
                <span className="font-semibold">{measure.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real reviews from real customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border-2 hover:shadow-lg transition-all">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t-2 pt-4">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                  <span className="inline-block mt-2 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                    {testimonial.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Options */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Flexible Payment Options</h2>
            <p className="text-lg text-gray-600">We accept all major payment methods for your convenience</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {paymentOptions.map((payment, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl border-2 hover:border-orange-500 transition-all">
                <payment.icon className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <p className="font-bold text-gray-900">{payment.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-orange-500 to-red-500 py-20">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Book Your Luxury Ride?</h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Contact us now for instant quotes and professional service
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <a href="tel:+64277777242">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-xl px-10 py-8">
                <Phone className="w-6 h-6 mr-2" />
                Call +64 27 777 7242
              </Button>
            </a>
            <a href="https://wa.me/64277777242" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-xl px-10 py-8">
                <MessageCircle className="w-6 h-6 mr-2" />
                WhatsApp Now
              </Button>
            </a>
            <a href="mailto:Luxurycabsltd@gmail.com">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-xl px-10 py-8">
                <Mail className="w-6 h-6 mr-2" />
                Email Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-lg">
                  <Car className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">LUXURY CABS LTD</h3>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Auckland's premier luxury taxi and tour service provider since 2016.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-orange-400 text-lg">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#services" className="hover:text-orange-400 transition">Airport Transfers</a></li>
                <li><a href="#fleet" className="hover:text-orange-400 transition">Our Fleet</a></li>
                <li><a href="#tours" className="hover:text-orange-400 transition">Tour Packages</a></li>
                <li><a href="#testimonials" className="hover:text-orange-400 transition">Reviews</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-orange-400 text-lg">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-orange-400 transition">Wedding Services</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Corporate Travel</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">Intercity Transfers</a></li>
                <li><a href="#" className="hover:text-orange-400 transition">City Tours</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-orange-400 text-lg">Contact</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-1 text-orange-400" />
                  <div>
                    <a href="tel:+64277777242" className="hover:text-orange-400 block font-bold text-white">
                      +64 27 777 7242
                    </a>
                    <span className="text-xs">24/7 Hotline</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-1 text-orange-400" />
                  <a href="mailto:Luxurycabsltd@gmail.com" className="hover:text-orange-400 break-all">
                    Luxurycabsltd@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 text-orange-400" />
                  <span>Auckland Airport & City, NZ</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 LUXURY CABS LTD. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
