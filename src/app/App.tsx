'use client';

import { useState, useEffect, startTransition } from 'react';
import { Phone, Mail, MapPin, Users, Check, Star, Shield, Award, Car, ChevronRight, MessageCircle, FileText, ArrowUp, X, CreditCard, ShoppingCart, CheckCircle2, ArrowRight, Calendar, Quote, ChevronLeft } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardDescription, CardHeader } from './components/ui/card';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { LocationAutocomplete } from './components/LocationAutocomplete';
import { SectionHeader } from './components/SectionHeader';
import { motion, AnimatePresence } from 'motion/react';
import { createShopifyCheckoutUrl } from './lib/shopify';
import { DatePicker } from './components/DatePicker';
import { ShopifyVariantSelect, type ShopifyVariantOption } from './components/ShopifyVariantSelect';
import { PassengersSelect } from './components/PassengersSelect';

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

  const [currentPage, setCurrentPage] = useState('home');
  const [bookingStep, setBookingStep] = useState(1);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentClient, setCurrentClient] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shopifyVariants, setShopifyVariants] = useState<ShopifyVariantOption[]>([]);
  const [shopifyVariantsLoading, setShopifyVariantsLoading] = useState(true);
  const [shopifyVariantsError, setShopifyVariantsError] = useState<string | null>(null);

  const validateStep1 = (): string | null => {
    if (!formData.pickup.trim()) return 'Please enter pickup location.';
    if (!formData.dropoff.trim()) return 'Please enter drop-off location.';
    if (!formData.date.trim()) return 'Please select pickup date.';
    if (!formData.time.trim()) return 'Please select pickup time.';
    if (!formData.passengers.trim()) return 'Please select passengers.';
    if (!formData.vehicle.trim()) return 'Please select vehicle/product.';
    return null;
  };

  const validateStep2 = (): string | null => {
    if (!formData.name.trim()) return 'Please enter your full name.';
    if (!formData.email.trim()) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) return 'Please enter a valid email address.';
    if (!formData.phone.trim()) return 'Please enter your phone number.';
    return null;
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Optional: if Shopify is configured, show products/variants in selects.
    try {
      const cached = localStorage.getItem('shopify_variants_cache');
      if (cached) {
        const parsed = JSON.parse(cached) as unknown;
        if (Array.isArray(parsed)) setShopifyVariants(parsed as ShopifyVariantOption[]);
      }
    } catch {
      // ignore
    }

    setShopifyVariantsLoading(true);
    fetch('/api/shopify/products')
      .then((r) => r.json())
      .then((json: any) => {
        const variants = Array.isArray(json?.variants) ? (json.variants as ShopifyVariantOption[]) : [];
        setShopifyVariants(variants);
        setShopifyVariantsError(typeof json?.error === 'string' && json.error ? json.error : null);
        try {
          localStorage.setItem('shopify_variants_cache', JSON.stringify(variants));
        } catch {
          // ignore
        }
      })
      .catch(() => {
        setShopifyVariants([]);
        setShopifyVariantsError(null);
      })
      .finally(() => {
        setShopifyVariantsLoading(false);
      });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const focusBookingForm = (opts?: { pickup?: string; dropoff?: string; focus?: 'pickup' | 'dropoff' | 'date'; openModal?: boolean }) => {
    const pickup = opts?.pickup;
    const dropoff = opts?.dropoff;

    if (pickup !== undefined || dropoff !== undefined) {
      startTransition(() =>
        setFormData((prev) => ({
          ...prev,
          pickup: pickup !== undefined ? pickup : prev.pickup,
          dropoff: dropoff !== undefined ? dropoff : prev.dropoff,
        })),
      );
    }

    if (opts?.openModal) {
      setSelectedPackage(null);
      setShowBookingModal(true);
      setBookingStep(1);
      window.setTimeout(() => {
        const id = opts?.focus === 'dropoff' ? 'modal-dropoff' : opts?.focus === 'date' ? 'modal-date' : 'modal-pickup';
        document.getElementById(id)?.focus();
      }, 350);
      return;
    }

    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(() => {
      const id = opts?.focus === 'dropoff' ? 'booking-dropoff' : opts?.focus === 'date' ? 'booking-date' : 'booking-pickup';
      document.getElementById(id)?.focus();
    }, 450);
  };

  const handleShopifyCheckout = (packageData: any) => {
    setSelectedPackage(packageData);
    setShowBookingModal(true);
    setBookingStep(1);
  };

  const proceedToCheckout = async () => {
    if (isCheckingOut) return;
    const s1 = validateStep1();
    if (s1) {
      alert(s1);
      return;
    }
    const s2 = validateStep2();
    if (s2) {
      alert(s2);
      return;
    }
    const chosenVariant =
      shopifyVariants.find((v) => v.id === formData.vehicle) ||
      null;
    const selectedPackageMerchandiseId =
      (typeof selectedPackage?.variantId === 'string' && selectedPackage.variantId.trim()) ||
      (typeof selectedPackage?.shopifyVariantId === 'string' && selectedPackage.shopifyVariantId.trim()) ||
      null;

    // Prefer a Shopify variant selected from dropdown so orders always match the exact variant/price in Shopify.
    const effectivePackage = chosenVariant
      ? {
          name: chosenVariant.label,
          price: chosenVariant.priceAmount ? Number(chosenVariant.priceAmount) : undefined,
          variantId: chosenVariant.id,
        }
      : selectedPackageMerchandiseId
        ? {
            name: selectedPackage?.name || selectedPackage?.title || 'Booking',
            price: typeof selectedPackage?.price === 'number' ? selectedPackage.price : undefined,
            variantId: selectedPackageMerchandiseId,
          }
        : null;

    if (!effectivePackage) {
      alert('Please select a vehicle/product (Shopify) so your order matches the correct variant and price.');
      return;
    }

    setIsCheckingOut(true);
    try {
      try {
        localStorage.setItem(
          'latest_booking',
          JSON.stringify({
            pickup: formData.pickup,
            dropoff: formData.dropoff,
            date: formData.date,
            time: formData.time,
            passengers: formData.passengers,
            vehicle: formData.vehicle,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            specialRequests: formData.specialRequests,
          }),
        );
      } catch {
        // ignore
      }

      const checkoutUrl = await createShopifyCheckoutUrl({
        merchandiseId: effectivePackage?.variantId || null,
        quantity: 1,
        attributes: {
          booking_type: effectivePackage?.name || 'Booking',
          booking_price_display: effectivePackage?.price,
          pickup: formData.pickup,
          dropoff: formData.dropoff,
          date: formData.date,
          time: formData.time,
          passengers: formData.passengers,
          vehicle: chosenVariant?.label || formData.vehicle,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          special_requests: formData.specialRequests,
        },
      });

      window.location.assign(checkoutUrl);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to start Shopify checkout.';
      alert(message);
    } finally {
      setIsCheckingOut(false);
      setShowBookingModal(false);
    }
  };

  // Data
  const majorCities = [
    {
      city: 'Auckland',
      routes: 120,
      image: 'https://images.unsplash.com/photo-1595125989588-36d745a2a828?w=600',
      description: 'Premium airport transfers and city tours'
    },
    {
      city: 'Hamilton',
      routes: 45,
      image: 'https://images.unsplash.com/photo-1602847189686-6bb361a3066d?w=600',
      description: 'Comfortable intercity affordable travel'
    },
    {
      city: 'Rotorua',
      routes: 38,
      image: 'https://images.unsplash.com/photo-1677557769755-875d8141c0c6?w=600',
      description: 'Geothermal tours and attractions'
    },
    {
      city: 'Tauranga',
      routes: 52,
      image: 'https://images.unsplash.com/photo-1677557771394-f4fa56446952?w=600',
      description: 'Coastal destinations and beaches'
    },
    {
      city: 'Wellington',
      routes: 67,
      image: 'https://images.unsplash.com/photo-1595125988905-8f407ecb399f?w=600',
      description: 'Capital city transfers and tours'
    },
    {
      city: 'Queenstown',
      routes: 41,
      image: 'https://images.unsplash.com/photo-1558222209-134191edfe0d?w=600',
      description: 'Adventure capital affordable transport'
    }
  ];

  const offers = [
    {
      title: 'INSTANT 10% OFF ON PREPAY',
      description: 'Pay online in advance and get instant discount on your ride',
      validUntil: 'Limited Time',
      code: 'PREPAY10',
      image: 'https://images.unsplash.com/photo-1574849693510-00ab036e8978?w=600',
      discount: '10%'
    },
    {
      title: 'RETURNING USER BONUS',
      description: 'Returning users receive an additional 5–10% discount',
      validUntil: 'Ongoing',
      code: 'WELCOME_BACK',
      image: 'https://images.unsplash.com/photo-1603122101829-e56305b0a5f7?w=600',
      discount: '5–10%'
    },
    {
      title: 'FIXED FARE SHORT RIDES',
      description: 'Fixed fare pricing available for short-distance rides (conditions apply)',
      validUntil: 'Ongoing',
      code: 'FIXED_FARE',
      image: 'https://images.unsplash.com/photo-1616804947838-6646ae0e423d?w=600',
      discount: 'FIXED'
    }
  ];

  const fixedFareCategories = [
    {
      title: 'CBD → CBD (Fixed Fare)',
      subtitle: 'Short distance rides within CBD',
      items: [
        { label: 'ECO', value: '$35' },
        { label: 'Sedan', value: '$40' },
        { label: 'Van', value: '$60' },
      ],
    },
    {
      title: 'Airport Environment (Fixed Fare)',
      subtitle: 'Airport precinct / nearby area',
      items: [
        { label: 'ECO', value: '$40' },
        { label: 'Sedan', value: '$55' },
        { label: 'Van', value: '$65' },
      ],
    },
    {
      title: 'CBD ↔ Airport (Both Directions)',
      subtitle: 'CBD → Airport and Airport → CBD',
      items: [
        { label: 'ECO', value: '$89' },
        { label: 'Sedan', value: '$99' },
        { label: 'Van', value: '$130' },
      ],
      notes: ['Inclusive GST', 'No Hidden Charges'],
    },
  ];

  const suburbIntercityVan = [
    { distance: '1–10 km', price: '$75 Fixed' },
    { distance: '10–15 km', price: '$85 Fixed' },
    { distance: '15–20 km', price: '$100 Fixed' },
    { distance: '20–25 km', price: '$120 Fixed' },
    { distance: '25–30 km', price: '$130 Fixed' },
  ];

  const suburbIntercityCar = [
    { distance: '1–10 km', price: '$50' },
    { distance: '10–15 km', price: '$65' },
    { distance: '15–20 km', price: '$85' },
    { distance: '20–25 km', price: '$110' },
    { distance: '25–30 km', price: '$120' },
  ];

  const services = [
    {
      title: 'AIRPORT TRANSFERS',
      description: '24/7 Auckland Airport premium pickup and drop-off services',
      image: 'https://images.unsplash.com/photo-1616804947838-6646ae0e423d?w=600',
      features: ['Flight Tracking', 'Meet & Greet', 'Free Wait Time']
    },
    {
      title: 'WEDDING SERVICES',
      description: 'Affordable wedding transportation with decorated vehicles',
      image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600',
      features: ['Decorated Cars', 'Red Carpet', 'Champagne']
    },
    {
      title: 'CITY TOURS',
      description: 'Guided Auckland sightseeing in affordable comfort',
      image: 'https://images.unsplash.com/photo-1595125989588-36d745a2a828?w=600',
      features: ['Professional Guide', 'All Attractions', 'Photo Stops']
    },
    {
      title: 'INTERCITY TRAVEL',
      description: 'Comfortable rides to Hamilton, Rotorua, Wellington',
      image: 'https://images.unsplash.com/photo-1602847189686-6bb361a3066d?w=600',
      features: ['Long Distance', 'Spacious Vans', 'Rest Stops']
    },
    {
      title: 'CORPORATE EVENTS',
      description: 'Business meetings and conference transportation',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
      features: ['Professional', 'Punctual', 'Discreet']
    },
    {
      title: 'SPECIAL OCCASIONS',
      description: 'Birthdays, anniversaries, and celebrations',
      image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600',
      features: ['Customizable', 'Decorations', 'VIP Service']
    }
  ];

  const uniqueFeatures = [
    {
      title: 'PREMIUM FLEET',
      description: 'Latest model affordable vehicles maintained to perfection',
      image: 'https://images.unsplash.com/photo-1599912027667-755b68b4dd3b?w=600',
      stat: '15+ Vehicles'
    },
    {
      title: 'PROFESSIONAL DRIVERS',
      description: 'Licensed, background-checked chauffeurs with 10+ years experience',
      image: 'https://images.unsplash.com/photo-1603122101829-e56305b0a5f7?w=600',
      stat: '100% Verified'
    },
    {
      title: '24/7 AVAILABILITY',
      description: 'Round-the-clock service with instant booking confirmation',
      image: 'https://images.unsplash.com/photo-1618866157430-b4d2e6a8800b?w=600',
      stat: 'Always Ready'
    },
    {
      title: 'AFFORDABLE AMENITIES',
      description: 'Free WiFi, charging ports, bottled water, climate control',
      image: 'https://images.unsplash.com/photo-1624976609551-0d7577bd4ce2?w=600',
      stat: 'Premium Comfort'
    }
  ];

  const popularDestinations = [
    {
      name: 'Sky Tower',
      description: 'Auckland\'s iconic landmark with stunning views',
      image: 'https://images.unsplash.com/photo-1595125989588-36d745a2a828?w=600',
      distance: '10 min from city'
    },
    {
      name: 'Waiheke Island',
      description: 'Wine country paradise with premium wineries',
      image: 'https://images.unsplash.com/photo-1602847189686-6bb361a3066d?w=600',
      distance: '40 min ferry ride'
    },
    {
      name: 'Piha Beach',
      description: 'Famous black sand surfing beach',
      image: 'https://images.unsplash.com/photo-1677557769755-875d8141c0c6?w=600',
      distance: '45 min drive'
    },
    {
      name: 'Hobbiton',
      description: 'Movie set experience in Matamata',
      image: 'https://images.unsplash.com/photo-1677557771394-f4fa56446952?w=600',
      distance: '2h 30min drive'
    }
  ];

  const driverReviews = [
    {
      name: 'John Smith',
      rating: 4.9,
      trips: 1250,
      experience: '8 years',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      specialty: 'Airport Transfers',
      quote: 'Punctual and professional service is my priority'
    },
    {
      name: 'Michael Chen',
      rating: 5.0,
      trips: 980,
      experience: '6 years',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      specialty: 'City Tours',
      quote: 'Making Auckland tours unforgettable'
    },
    {
      name: 'David Kumar',
      rating: 4.8,
      trips: 1560,
      experience: '10 years',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
      specialty: 'Intercity Travel',
      quote: 'Safe and comfortable long-distance journeys'
    },
    {
      name: 'James Wilson',
      rating: 4.9,
      trips: 890,
      experience: '5 years',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      specialty: 'Wedding Services',
      quote: 'Making your special day perfect'
    }
  ];

  const clientLogos = [
    {
      name: 'Air New Zealand',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200',
      type: 'Airline Partner'
    },
    {
      name: 'Hilton Hotels',
      logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200',
      type: 'Hospitality'
    },
    {
      name: 'Microsoft NZ',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200',
      type: 'Corporate'
    },
    {
      name: 'Tourism Auckland',
      logo: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200',
      type: 'Tourism Board'
    },
    {
      name: 'Sky City',
      logo: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200',
      type: 'Entertainment'
    },
    {
      name: 'Auckland Council',
      logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200',
      type: 'Government'
    }
  ];

  const pressReleases = [
    {
      title: 'Affordable Cabs Ltd Wins "Best Transport Service 2026" Award',
      date: 'April 2026',
      excerpt: 'Recognized for outstanding customer service and premium fleet management excellence.',
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'
    },
    {
      title: 'Expansion to Wellington: New Fleet of Affordable Vans',
      date: 'March 2026',
      excerpt: 'Major expansion with introduction of premium intercity services to capital city.',
      image: 'https://images.unsplash.com/photo-1552581234-26160f608093?w=600'
    },
    {
      title: 'Partnership with Auckland Airport for VIP Services',
      date: 'February 2026',
      excerpt: 'Exclusive deal to provide premium transfers for business travelers and VIP guests.',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600'
    }
  ];

  const popularRoutes = [
    {
      from: 'CBD',
      to: 'CBD',
      price: 35,
      time: 'Fixed Fare',
      demand: 'High',
      image: 'https://images.unsplash.com/photo-1574849693510-00ab036e8978?w=400'
    },
    {
      from: 'CBD',
      to: 'Airport',
      price: 89,
      time: 'Fixed Fare',
      demand: 'Medium',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400'
    },
    {
      from: 'Airport',
      to: 'CBD',
      price: 89,
      time: 'Fixed Fare',
      demand: 'High',
      image: 'https://images.unsplash.com/photo-1603122101829-e56305b0a5f7?w=400'
    },
    {
      from: 'Suburb',
      to: 'Suburb',
      price: 50,
      time: 'From (1–10 km)',
      demand: 'High',
      image: 'https://images.unsplash.com/photo-1576566465339-2b99f6b33277?w=400'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Thompson',
      country: 'United Kingdom',
      rating: 5,
      text: 'Absolutely fantastic service! Driver was punctual, professional, and the vehicle was immaculate. Highly recommend for airport transfers.',
      service: 'Airport Transfer',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
    },
    {
      name: 'David Chen',
      country: 'Singapore',
      rating: 5,
      text: 'Best city tour we\'ve ever experienced. Our guide was knowledgeable and friendly. Great value for money!',
      service: 'City Tour',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
    },
    {
      name: 'Emily Wilson',
      country: 'Australia',
      rating: 5,
      text: 'Perfect for our wedding day! The 12-seater van was spacious and elegant. Made our day extra special.',
      service: 'Wedding',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'
    }
  ];

  const faqs = [
    {
      question: 'How do I book a affordable cab in Auckland?',
      answer: 'You can book online through our website, call +64 27 777 7242, or WhatsApp us. We provide instant confirmation and 24/7 booking support.'
    },
    {
      question: 'Do you provide airport pickup services?',
      answer: 'Yes! We offer 24/7 Auckland Airport transfers with flight tracking, meet & greet service, and complimentary wait time.'
    },
    {
      question: 'What vehicles do you have for weddings?',
      answer: 'We offer affordable sedans and decorated 12-seater vans perfect for weddings with professional chauffeurs.'
    },
    {
      question: 'Are your drivers licensed and insured?',
      answer: 'Absolutely! All chauffeurs are fully licensed, background-checked, and insured.'
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-2.5 text-center font-bold shadow-lg">
        <div className="flex items-center justify-center gap-3 text-sm md:text-base">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>INSTANT OFFER: 10% OFF on Prepay | Inclusive GST | No Hidden Charges</span>
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        </div>
      </div>

      {/* BMW/Porsche Style Header */}
      <header className="bg-white shadow-md sticky top-0 z-40 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* BMW/Porsche Style Logo */}
            <div className="flex items-center gap-4">
              <img
                src="/logo-square.png"
                alt="Affordable Cabs"
                className="w-22 h-20 rounded-full shadow-2xl bg-white"
              />
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">AFFORDABLE CABS LTD</h1>
                <p className="text-xs font-bold text-yellow-800 tracking-widest">PREMIUM TRANSPORTATION</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              <a href="#home" className="font-bold text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:scale-105">
                HOME
              </a>
              <a href="#services" className="font-bold text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:scale-105">
                SERVICES
              </a>
              <a href="#cities" className="font-bold text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:scale-105">
                CITIES
              </a>
              <a href="#tours" className="font-bold text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:scale-105">
                TOURS
              </a>
              <a href="#contact" className="font-bold text-gray-700 hover:text-yellow-600 transition-all duration-300 hover:scale-105">
                CONTACT
              </a>
              <Button
                onClick={() => focusBookingForm({ focus: 'pickup' })}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-black shadow-lg transition-all duration-300 hover:scale-110"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                BOOK NOW
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Bar */}
      <div className="bg-black text-white py-3 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-4">
            <a href="tel:+64277777242" className="flex items-center gap-2 hover:text-yellow-400 transition group hover:scale-105">
              <div className="bg-yellow-500 p-2 rounded-full group-hover:scale-110 transition">
                <Phone className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold">+64 27 777 7242</span>
            </a>
            <a href="mailto:Luxurycabsltd@gmail.com" className="flex items-center gap-2 hover:text-yellow-400 transition group hover:scale-105">
              <div className="bg-yellow-500 p-2 rounded-full group-hover:scale-110 transition">
                <Mail className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-sm md:text-base">Luxurycabsltd@gmail.com</span>
            </a>
            <div className="flex items-center gap-2 hover:scale-105 transition">
              <div className="bg-yellow-500 p-2 rounded-full">
                <MapPin className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-sm md:text-base">Auckland Airport & City</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Buttons */}
      <a
        href="https://wa.me/64277777242"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed left-6 bottom-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          1
        </div>
      </a>

      <button
        onClick={() => setShowInquiryForm(true)}
        className="fixed right-6 bottom-24 z-50 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-all"
        aria-label="Open inquiry form"
      >
        <FileText className="w-7 h-7" />
      </button>

      <AnimatePresence>
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed right-6 bottom-6 z-50 bg-gray-900 hover:bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-7 h-7" />
          </button>
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
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="max-w-md w-full shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black">QUICK INQUIRY</h2>
                    <button
                      onClick={() => setShowInquiryForm(false)}
                      className="hover:bg-black/10 p-2 rounded-full transition"
                      aria-label="Close inquiry form"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <CardDescription className="text-gray-900 font-bold">Get response within 30 minutes!</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Input placeholder="Your Name *" className="font-semibold border-2" />
                  <Input placeholder="Phone Number *" type="tel" className="font-semibold border-2" />
                  <Input placeholder="Email Address *" type="email" className="font-semibold border-2" />
                  <LocationAutocomplete
                    placeholder="Pickup Location"
                    value={formData.pickup}
                    onChange={(value) => setFormData((prev) => ({ ...prev, pickup: value }))}
                  />
                  <LocationAutocomplete
                    placeholder="Drop-off Location"
                    value={formData.dropoff}
                    onChange={(value) => setFormData((prev) => ({ ...prev, dropoff: value }))}
                  />
                  <textarea
                    placeholder="Additional Requirements..."
                    className="w-full border-2 rounded-md p-3 font-semibold min-h-24"
                  />
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-black text-lg py-6">
                    SUBMIT INQUIRY
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multi-Step Booking Modal - Same as before but with new colors */}
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
              onClick={(e) => e.stopPropagation()}
              className="my-8"
            >
              <Card className="max-w-2xl w-full shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black">BOOK YOUR AFFORDABLE RIDE</h2>
                    <button
                      onClick={() => setShowBookingModal(false)}
                      className="hover:bg-black/10 p-2 rounded-full transition"
                      aria-label="Close booking form"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  {selectedPackage && (
                    <CardDescription className="text-gray-900 font-bold text-lg mt-2">
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
                          bookingStep >= step ? 'bg-yellow-500 text-black' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {bookingStep > step ? <Check className="w-5 h-5" /> : step}
                        </div>
                        {step < 3 && (
                          <div className={`w-16 md:w-32 h-1 mx-2 transition-all ${
                            bookingStep > step ? 'bg-yellow-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Step 1: Trip Details */}
                  {bookingStep === 1 && (
                    <div className="space-y-4 text-left">
                      <h3 className="text-xl font-black text-gray-900 mb-4">TRIP DETAILS</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 group">
                          <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                            Pickup Location <span className="text-red-600">*</span>
                          </div>
                        <LocationAutocomplete
                          placeholder="Pickup Location *"
                          value={formData.pickup}
                          onChange={(value) => setFormData((prev) => ({ ...prev, pickup: value }))}
                          inputId="modal-pickup"
                        />
                        </div>
                        <div className="space-y-1 group">
                          <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                            Drop-off Location <span className="text-red-600">*</span>
                          </div>
                        <LocationAutocomplete
                          placeholder="Drop-off Location *"
                          value={formData.dropoff}
                          onChange={(value) => setFormData((prev) => ({ ...prev, dropoff: value }))}
                          inputId="modal-dropoff"
                        />
                        </div>
                        <div className="space-y-1 group">
                          <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                            Pickup Date <span className="text-red-600">*</span>
                          </div>
                        <DatePicker
                          value={formData.date}
                          onChange={(date) => setFormData({ ...formData, date })}
                          className="h-9"
                          id="modal-date"
                        />
                        </div>
                        <div className="space-y-1 group">
                          <label
                            htmlFor="modal-time"
                            className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700"
                          >
                            Pickup Time <span className="text-red-600">*</span>
                          </label>
                          <Input
                            id="modal-time"
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                            className="font-semibold border-2"
                          />
                        </div>
                        <div className="space-y-1 group">
                          <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                            Passengers <span className="text-red-600">*</span>
                          </div>
                          <PassengersSelect
                            value={formData.passengers}
                            onChange={(passengers) => setFormData({ ...formData, passengers })}
                          />
                        </div>
                        <div className="space-y-1 group">
                          <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                            Vehicle Type <span className="text-red-600">*</span>
                          </div>
                          {shopifyVariants.length > 0 ? (
                            <ShopifyVariantSelect
                              value={formData.vehicle}
                              onChange={(v) => setFormData({ ...formData, vehicle: v })}
                              options={shopifyVariants}
                              placeholder="Select vehicle / product"
                            />
                          ) : shopifyVariantsLoading ? (
                            <select
                              className="w-full border-2 rounded-md p-2.5 font-semibold bg-input-background outline-none"
                              value=""
                              disabled
                            >
                              <option value="">Loading vehicles…</option>
                            </select>
                          ) : (
                            <select
                              className="w-full border-2 rounded-md p-2.5 font-semibold bg-input-background outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                              value={formData.vehicle}
                              onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                            >
                              <option value="">Select vehicle</option>
                              <option value="sedan">Affordable Sedan (1-4 pax)</option>
                              <option value="minivan">Mini Van (5-11 pax)</option>
                              <option value="largevan">Large Van (8-11 pax)</option>
                            </select>
                          )}
                          {shopifyVariantsError ? (
                            <div className="text-[11px] font-semibold text-gray-500">
                              Shopify products not loaded: {shopifyVariantsError}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <textarea
                        placeholder="Special Requests (Optional)"
                        value={formData.specialRequests}
                        onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                        className="w-full border-2 rounded-md p-3 font-semibold min-h-24"
                      />
                      <Button
                        onClick={() => {
                          const err = validateStep1();
                          if (err) return alert(err);
                          setBookingStep(2);
                        }}
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-black text-lg py-6"
                      >
                        CONTINUE <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  )}

                  {/* Step 2: Personal Details */}
                  {bookingStep === 2 && (
                    <div className="space-y-4 text-left">
                      <h3 className="text-xl font-black text-gray-900 mb-4">YOUR DETAILS</h3>
                      <div className="space-y-1 group">
                        <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                          Full Name <span className="text-red-600">*</span>
                        </div>
                        <Input
                          placeholder="Full Name *"
                          value={formData.name}
                          autoComplete="name"
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="font-semibold border-2"
                        />
                      </div>
                      <div className="space-y-1 group">
                        <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                          Email Address <span className="text-red-600">*</span>
                        </div>
                        <Input
                          placeholder="Email Address *"
                          type="email"
                          value={formData.email}
                          autoComplete="email"
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="font-semibold border-2"
                        />
                      </div>
                      <div className="space-y-1 group">
                        <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                          Phone Number <span className="text-red-600">*</span>
                        </div>
                        <Input
                          placeholder="Phone Number *"
                          type="tel"
                          value={formData.phone}
                          autoComplete="tel"
                          inputMode="tel"
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="font-semibold border-2"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => setBookingStep(1)}
                          variant="outline"
                          className="flex-1 font-black text-lg py-6 border-2"
                        >
                          BACK
                        </Button>
                        <Button
                          onClick={() => {
                            const err = validateStep2();
                            if (err) return alert(err);
                            setBookingStep(3);
                          }}
                          className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-black text-lg py-6"
                        >
                          CONTINUE <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Confirmation */}
                  {bookingStep === 3 && (
                    <div className="space-y-4 text-left">
                      <h3 className="text-xl font-black text-gray-900 mb-4">REVIEW & CHECKOUT</h3>
                      <div className="bg-yellow-50 border-2 border-yellow-500 rounded-lg p-6 space-y-3">
                        <div className="flex justify-between">
                          <span className="font-bold">Date & Time:</span>
                          <span className="font-black">{formData.date} at {formData.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold">Pickup:</span>
                          <span className="font-black">{formData.pickup}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold">Passengers:</span>
                          <span className="font-black">{formData.passengers}</span>
                        </div>
                        <div className="border-t-2 border-yellow-400 pt-3 mt-3">
                          <div className="flex justify-between">
                            <span className="font-bold text-lg">TOTAL:</span>
            <span className="font-black text-yellow-700 text-3xl">${selectedPackage?.price || 499}</span>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-xs font-semibold text-gray-700">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-600"></span>
                          Inclusive GST
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-green-600"></span>
                          No Hidden Charges
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
                          disabled={isCheckingOut}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black text-lg py-6"
                        >
                          <CreditCard className="w-5 h-5 mr-2" />
                          {isCheckingOut ? 'REDIRECTING…' : 'CHECKOUT'}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Direct Booking Form */}
      <section id="home" className="relative min-h-screen bg-black">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1603122101829-e56305b0a5f7?w=1280&auto=format&fit=crop&q=70"
            alt="Affordable Car"
            className="w-full h-full object-cover opacity-40"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 min-h-screen flex items-center py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
            {/* Left: Heading */}
            <motion.div
              className="text-white flex flex-col justify-center"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1
                className="text-5xl md:text-7xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                AUCKLAND'S PREMIER AFFORDABLE TRANSPORTATION
              </motion.h1>
              <motion.p
                className="text-2xl font-bold text-yellow-400 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Airport Transfers | City Tours | Intercity | Sedan Cars
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-6 py-3 rounded-full">
                  <Check className="w-6 h-6 text-yellow-400" />
                  <span className="font-bold">24/7 Service</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-6 py-3 rounded-full">
                  <Check className="w-6 h-6 text-yellow-400" />
                  <span className="font-bold">Best Prices</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-6 py-3 rounded-full">
                  <Check className="w-6 h-6 text-yellow-400" />
                  <span className="font-bold">Professional Drivers</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Direct Booking Form */}
            <motion.div
              id="booking"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            >
              <Card className="bg-white/95 backdrop-blur shadow-2xl border-2 border-yellow-500">
                <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-t-lg">
                  <h2 className="text-3xl font-black">BOOK YOUR AFFORDABLE RIDE</h2>
                  <CardDescription className="text-gray-900 font-bold text-lg">Get instant quote & confirmation</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 group">
                      <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                        Pickup Location <span className="text-red-600">*</span>
                      </div>
                      <LocationAutocomplete
                        placeholder="Pickup Location *"
                        value={formData.pickup}
                        onChange={(value) => setFormData((prev) => ({ ...prev, pickup: value }))}
                        inputId="booking-pickup"
                      />
                    </div>
                    <div className="space-y-1 group">
                      <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                        Drop-off Location <span className="text-red-600">*</span>
                      </div>
                      <LocationAutocomplete
                        placeholder="Drop-off Location *"
                        value={formData.dropoff}
                        onChange={(value) => setFormData((prev) => ({ ...prev, dropoff: value }))}
                        inputId="booking-dropoff"
                      />
                    </div>
                    <div className="space-y-1 group">
                      <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                        Pickup Date <span className="text-red-600">*</span>
                      </div>
                    <DatePicker
                      value={formData.date}
                      onChange={(date) => setFormData({ ...formData, date })}
                      className="h-9"
                      id="booking-date"
                    />
                    </div>
                    <div className="space-y-1 group">
                      <label
                        htmlFor="booking-time"
                        className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700"
                      >
                        Pickup Time <span className="text-red-600">*</span>
                      </label>
                    <Input
                      id="booking-time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                      className="font-semibold border-2"
                    />
                    </div>
                  </div>
                  <div className="space-y-1 group">
                    <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                      Passengers <span className="text-red-600">*</span>
                    </div>
                    <PassengersSelect
                      value={formData.passengers}
                      onChange={(passengers) => setFormData({ ...formData, passengers })}
                    />
                  </div>
                  <div className="space-y-1 group">
                    <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                      Vehicle Type <span className="text-red-600">*</span>
                    </div>
                    {shopifyVariants.length > 0 ? (
                      <ShopifyVariantSelect
                        value={formData.vehicle}
                        onChange={(v) => setFormData({ ...formData, vehicle: v })}
                        options={shopifyVariants}
                        placeholder="Select vehicle / product"
                      />
                    ) : shopifyVariantsLoading ? (
                      <select
                        className="w-full border-2 rounded-md p-2.5 font-semibold bg-input-background outline-none"
                        value=""
                        disabled
                      >
                        <option value="">Loading vehicles…</option>
                      </select>
                    ) : (
                      <select
                        className="w-full border-2 rounded-md p-2.5 font-semibold bg-input-background outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        value={formData.vehicle}
                        onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                      >
                        <option value="">Select vehicle</option>
                        <option value="sedan">Affordable Sedan (1-4 pax)</option>
                        <option value="minivan">Mini Van (5-7 pax)</option>
                        <option value="largevan">Large Van (8-11 pax)</option>
                      </select>
                    )}
                    {shopifyVariantsError ? (
                      <div className="text-[11px] font-semibold text-gray-500">
                        Shopify products not loaded: {shopifyVariantsError}
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-1 group">
                    <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                      Your Name
                    </div>
                    <Input
                      placeholder="Your Name"
                      value={formData.name}
                      autoComplete="name"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="font-semibold border-2"
                    />
                  </div>
                  <div className="space-y-1 group">
                    <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                      Email Address <span className="text-red-600">*</span>
                    </div>
                    <Input
                      placeholder="Email Address *"
                      type="email"
                      value={formData.email}
                      autoComplete="email"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="font-semibold border-2"
                    />
                  </div>
                  <div className="space-y-1 group">
                    <div className="text-[11px] font-black text-gray-600 tracking-wider uppercase transition-colors group-focus-within:text-yellow-700">
                      Phone Number
                    </div>
                    <Input
                      placeholder="Phone Number"
                      type="tel"
                      value={formData.phone}
                      autoComplete="tel"
                      inputMode="tel"
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="font-semibold border-2"
                    />
                  </div>
                  <Button
                    onClick={proceedToCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-black text-lg py-7 shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <ShoppingCart className="w-6 h-6 mr-3" />
                    {isCheckingOut ? 'REDIRECTING…' : 'CONFIRM BOOKING & PAY'}
                  </Button>
                  <div className="flex gap-3">
                    <a href="tel:+64277777242" className="flex-1">
                      <Button variant="outline" className="w-full font-bold border-2 border-yellow-700 text-yellow-700 hover:bg-yellow-50 transition-all duration-300">
                        <Phone className="w-5 h-5 mr-2" />
                        CALL US
                      </Button>
                    </a>
                    <a href="https://wa.me/64277777242" target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" className="w-full font-bold border-2 border-green-600 text-green-600 hover:bg-green-50 transition-all duration-300">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        WHATSAPP
                      </Button>
                    </a>
                  </div>
                  <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-xs font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-600"></span>
                      Inclusive GST
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-600"></span>
                      No Hidden Charges
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '500+', label: 'HAPPY CUSTOMERS' },
              { number: '24/7', label: 'SERVICE AVAILABLE' },
              { number: '15+', label: 'AFFORDABLE VEHICLES' },
              { number: '10+', label: 'YEARS EXPERIENCE' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -10 }}
              >
                <div className="text-5xl font-black text-yellow-500 mb-2">{stat.number}</div>
                <div className="font-bold text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advertisement Banner */}
      <section className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-3xl font-black text-black mb-2">INSTANT 10% OFF ON PREPAY</h3>
              <p className="text-lg font-bold text-gray-900">Pay in advance to save instantly. Returning users get extra 5–10% off.</p>
            </div>
            <Button
              onClick={() => setShowBookingModal(true)}
              size="lg"
              className="bg-black hover:bg-gray-900 text-white font-black px-12 py-6"
            >
              PREPAY & SAVE
            </Button>
          </div>
        </div>
      </section>

      {/* Fixed Fare Pricing */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="FIXED FARE PRICING"
            subtitle="Transparent fixed fares for popular ride categories"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {fixedFareCategories.map((cat, idx) => (
              <Card key={idx} className="border-l-4 border-yellow-500 hover:shadow-2xl transition-all">
                <CardContent className="p-6">
                  <div className="text-xl font-black text-gray-900 mb-1">{cat.title}</div>
                  <div className="text-sm font-bold text-gray-600 mb-5">{cat.subtitle}</div>

                  <div className="space-y-3">
                    {cat.items.map((it) => (
                      <div key={it.label} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="font-black text-gray-800">{it.label}</div>
                        <div className="font-black text-yellow-700 text-lg">{it.value}</div>
                      </div>
                    ))}
                  </div>

                  {cat.notes?.length ? (
                    <div className="mt-5 rounded-lg bg-green-50 border border-green-200 p-3">
                      {cat.notes.map((n) => (
                        <div key={n} className="flex items-center gap-2 text-sm font-bold text-green-800">
                          <CheckCircle2 className="w-4 h-4" />
                          {n}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            <Card className="hover:shadow-2xl transition-all border-l-4 border-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xl font-black text-gray-900">Suburb ↔ Suburb (Intercity) – VAN</div>
                    <div className="text-sm font-bold text-gray-600">Fixed pricing by distance</div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 font-black text-gray-800">Distance</th>
                        <th className="p-3 font-black text-gray-800">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suburbIntercityVan.map((r) => (
                        <tr key={r.distance} className="border-b border-gray-200">
                          <td className="p-3 font-semibold text-gray-700">{r.distance}</td>
                          <td className="p-3 font-black text-yellow-700">{r.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 space-y-2 text-sm font-semibold text-gray-700">
                  <div className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-0.5" />After 30 km → <span className="font-black">$5/km</span> extra</div>
                  <div className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-0.5" />Above 100 km → <span className="font-black">15% OFF</span></div>
                  <div className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-0.5" />Prepay users → <span className="font-black">10% OFF</span></div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-2xl transition-all border-l-4 border-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xl font-black text-gray-900">Suburb ↔ Suburb (Intercity) – CAR</div>
                    <div className="text-sm font-bold text-gray-600">Fixed pricing by distance</div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-3 font-black text-gray-800">Distance</th>
                        <th className="p-3 font-black text-gray-800">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suburbIntercityCar.map((r) => (
                        <tr key={r.distance} className="border-b border-gray-200">
                          <td className="p-3 font-semibold text-gray-700">{r.distance}</td>
                          <td className="p-3 font-black text-yellow-700">{r.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 space-y-2 text-sm font-semibold text-gray-700">
                  <div className="flex items-start gap-2"><Check className="w-4 h-4 text-green-600 mt-0.5" />After 30 km → <span className="font-black">$3.50/km</span> extra</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-5">
            <div className="font-black text-gray-900 mb-2">Multiple Ride Benefits</div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-semibold text-gray-800">
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-700 mt-0.5" />Fixed fare available for short distance rides (including under 7 km, where applicable)</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-700 mt-0.5" />Additional per-km charges apply only after the fixed distance limit</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-700 mt-0.5" />Transparent pricing: Inclusive GST, no hidden charges</li>
              <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-700 mt-0.5" />Instant discount for prepay + extra savings for returning users</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Services in Major Cities */}
      <section id="cities" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader
              title="OUR SERVICES IN MAJOR CITIES"
              subtitle="Premium transportation across New Zealand's top destinations"
              showNavigation
              onPrev={() => {}}
              onNext={() => {}}
            />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {majorCities.map((city, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
              <Card className="overflow-hidden shadow-2xl transition-all group cursor-pointer h-full">
                <div className="h-64 overflow-hidden relative">
                  <ImageWithFallback
                    src={city.image}
                    alt={city.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-3xl font-black mb-1">{city.city}</h3>
                    <p className="font-semibold">{city.routes} Available Routes</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="font-semibold text-gray-600 mb-4">{city.description}</p>
                  <Button
                    onClick={() => focusBookingForm({ pickup: city.city, focus: 'dropoff' })}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-black transition-all duration-300 hover:scale-105"
                  >
                    VIEW ROUTES
                  </Button>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offers Section */}
      {/* <section id="tours" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="EXCLUSIVE OFFERS"
            subtitle="Limited time deals and special packages"
            showSeeMore
            onSeeMore={() => {}}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offers.map((offer, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all border-2 border-yellow-500">
                <div className="h-48 overflow-hidden relative">
                  <ImageWithFallback
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-500 text-black px-6 py-3 rounded-full font-black text-xl shadow-lg">
                    {offer.discount}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-2">{offer.title}</h3>
                  <p className="font-semibold text-gray-600 mb-4">{offer.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-gray-500">Valid until: {offer.validUntil}</span>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-black text-sm">
                      {offer.code}
                    </span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-black">
                    CLAIM OFFER
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* OUR PREMIUM SERVICES */}
      {/* <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader
              title="OUR PREMIUM SERVICES"
              subtitle="Comprehensive affordable transportation for every occasion"
              showNavigation
              onPrev={() => {}}
              onNext={() => {}}
            />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
              <Card className="overflow-hidden shadow-2xl transition-all group cursor-pointer h-full">
                <div className="h-72 overflow-hidden relative">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="text-2xl font-black mb-2">{service.title}</h3>
                    <p className="font-semibold text-sm mb-4">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, fIndex) => (
                        <span key={fIndex} className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <Button
                    onClick={() => focusBookingForm({ focus: 'pickup' })}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-black transition-all duration-300 hover:scale-105"
                  >
                    BOOK NOW <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* What Makes Us Unique */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="WHAT MAKES US UNIQUE"
            subtitle="Affordable features that set us apart from the rest"
            showSeeMore
            onSeeMore={() => {}}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {uniqueFeatures.map((feature, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all">
                <div className="h-48 overflow-hidden">
                  <ImageWithFallback
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <div className="bg-yellow-500 text-black px-6 py-2 rounded-full font-black text-2xl inline-block mb-4">
                    {feature.stat}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">{feature.title}</h3>
                  <p className="font-semibold text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Happy Recent Clients (Image Slider + Reviews) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="HAPPY RECENT CLIENTS"
            subtitle="Real customers, real experiences"
            showNavigation
            onPrev={() => setCurrentTestimonial(Math.max(0, currentTestimonial - 1))}
            onNext={() => setCurrentTestimonial(Math.min(testimonials.length - 1, currentTestimonial + 1))}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Client Images Grid */}
            <div className="grid grid-cols-2 gap-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="relative group cursor-pointer">
                  <div className="aspect-square overflow-hidden rounded-2xl">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur p-3 rounded-lg">
                    <p className="font-black text-white text-sm">{testimonial.name}</p>
                    <p className="text-yellow-400 text-xs font-bold">{testimonial.country}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Current Testimonial */}
            <div>
              <Card className="border-2 border-yellow-500">
                <CardContent className="p-8">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="w-12 h-12 text-yellow-500 mb-4" />
                  <p className="text-xl font-semibold text-gray-700 mb-6 italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div className="border-t-2 border-gray-200 pt-6">
                    <p className="font-black text-2xl text-gray-900">{testimonials[currentTestimonial].name}</p>
                    <p className="font-bold text-gray-600">{testimonials[currentTestimonial].country}</p>
                    <span className="inline-block mt-3 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-black text-sm">
                      {testimonials[currentTestimonial].service}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="POPULAR DESTINATIONS"
            subtitle="Top attractions and must-visit locations"
            showNavigation
            onPrev={() => {}}
            onNext={() => {}}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all group cursor-pointer">
                <div className="h-64 overflow-hidden relative">
                  <ImageWithFallback
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-black mb-1">{dest.name}</h3>
                    <p className="text-sm font-semibold mb-2">{dest.description}</p>
                    <div className="flex items-center gap-2 text-yellow-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-bold">{dest.distance}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Driver Reviews */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="MEET OUR PROFESSIONAL DRIVERS"
            subtitle="Experienced, licensed, and dedicated chauffeurs"
            showNavigation
            onPrev={() => {}}
            onNext={() => {}}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {driverReviews.map((driver, index) => (
              <Card key={index} className="text-center hover:shadow-2xl transition-all">
                <CardContent className="p-6">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-yellow-500">
                    <ImageWithFallback
                      src={driver.image}
                      alt={driver.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-1">{driver.name}</h3>
                      <p className="text-sm font-bold text-yellow-700 mb-3">{driver.specialty}</p>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-black text-lg">{driver.rating}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-black text-2xl text-gray-900">{driver.trips}</div>
                      <div className="text-xs font-bold text-gray-600">TRIPS</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-black text-2xl text-gray-900">{driver.experience}</div>
                      <div className="text-xs font-bold text-gray-600">EXPERIENCE</div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-600 italic">"{driver.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black mb-4 uppercase">HOW IT WORKS</h2>
            <p className="text-xl font-bold text-gray-300">Simple 4-step booking process</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: '1', title: 'CHOOSE SERVICE', desc: 'Select from our premium services' },
              { step: '2', title: 'BOOK ONLINE', desc: 'Fill details or call us instantly' },
              { step: '3', title: 'GET CONFIRMED', desc: 'Receive driver details immediately' },
              { step: '4', title: 'ENJOY RIDE', desc: 'Affordable transportation experience' }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform">
                    <span className="text-4xl font-black text-black">{item.step}</span>
                  </div>
                </div>
                <h3 className="font-black text-xl mb-2">{item.title}</h3>
                <p className="font-semibold text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Clients */}
      {/* <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="OUR TRUSTED CLIENTS"
            subtitle="Partnering with Auckland's leading brands"
            showNavigation
            onPrev={() => setCurrentClient(Math.max(0, currentClient - 1))}
            onNext={() => setCurrentClient(Math.min(clientLogos.length - 1, currentClient + 1))}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {clientLogos.map((client, index) => (
              <div key={index} className="aspect-square bg-gray-50 rounded-xl p-6 flex items-center justify-center hover:shadow-lg transition-all group cursor-pointer border-2 border-gray-200 hover:border-yellow-500">
                <ImageWithFallback
                  src={client.logo}
                  alt={client.name}
                  className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Press Release */}
      {/* <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="PRESS RELEASE & NEWS"
            subtitle="Latest updates and achievements"
            showSeeMore
            onSeeMore={() => {}}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pressReleases.map((press, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all">
                <div className="h-56 overflow-hidden">
                  <ImageWithFallback
                    src={press.image}
                    alt={press.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="text-sm font-bold text-yellow-700 mb-2">{press.date}</div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">{press.title}</h3>
                  <p className="font-semibold text-gray-600 mb-4">{press.excerpt}</p>
                  <Button variant="outline" className="font-bold border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
                    READ MORE <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section> */}

      {/* Popular Route Cabs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="POPULAR ROUTE CABS"
            subtitle="Most traveled routes with transparent pricing"
            showNavigation
            onPrev={() => {}}
            onNext={() => {}}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularRoutes.map((route, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all border-l-4 border-yellow-500">
                <div className="h-40 overflow-hidden">
                  <ImageWithFallback
                    src={route.image}
                    alt={`${route.from} to ${route.to}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-green-500 w-3 h-3 rounded-full"></div>
                        <p className="font-black text-gray-900">{route.from}</p>
                      </div>
                      <div className="border-l-2 border-dashed border-gray-300 h-4 ml-1.5"></div>
                      <div className="flex items-center gap-2">
                        <div className="bg-red-500 w-3 h-3 rounded-full"></div>
                        <p className="font-black text-gray-900">{route.to}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                    <div>
                      <p className="text-3xl font-black text-yellow-700">${route.price}</p>
                      <p className="text-sm font-bold text-gray-500">{route.time}</p>
                    </div>
                    <Button
                      onClick={() => focusBookingForm({ pickup: route.from, dropoff: route.to, focus: 'date' })}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-black"
                    >
                      BOOK
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="FREQUENTLY ASKED QUESTIONS"
            subtitle="Got questions? We have answers"
          />
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition border-l-4 border-yellow-500">
                <CardContent className="p-6">
                  <h3 className="font-black text-lg mb-3 text-gray-900 flex items-start gap-2">
                    <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      Q
                    </span>
                    {faq.question}
                  </h3>
                  <p className="font-semibold text-gray-700 ml-8">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-black py-24">
        <div className="absolute inset-0 opacity-30">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1558222209-134191edfe0d?w=1280&auto=format&fit=crop&q=70"
            alt="Affordable Car"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-black mb-6 text-white">READY FOR AFFORDABLE?</h2>
          <p className="text-2xl mb-10 text-yellow-400 font-bold max-w-3xl mx-auto">
            Book now with secure checkout and experience premium service
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <a href="tel:+64277777242">
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-black text-xl px-12 py-8">
                <Phone className="w-6 h-6 mr-3" />
                CALL NOW
              </Button>
            </a>
            <Button
              size="lg"
              onClick={() => focusBookingForm({ openModal: true, focus: 'pickup' })}
              className="bg-white hover:bg-gray-100 text-black font-black text-xl px-12 py-8"
            >
              <ShoppingCart className="w-6 h-6 mr-3" />
              BOOK ONLINE
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo-square.png"
                  alt="Affordable Cabs Ltd"
                  className="w-27 h-23  shadow-lg rounded-full p-2 object-cover"
                />
                <h3 className="font-black text-xl">AFFORDABLE CABS LTD</h3>
              </div>
              <p className="text-gray-400 font-semibold mb-4">
                Auckland's premier affordable taxi and tour service provider.
              </p>
            </div>
            <div>
              <h4 className="font-black mb-4 text-yellow-400 text-lg">QUICK LINKS</h4>
              <ul className="space-y-2 font-semibold text-gray-400">
                <li><a href="#services" className="hover:text-yellow-400 transition">Services</a></li>
                <li><a href="#fleet" className="hover:text-yellow-400 transition">Our Fleet</a></li>
                <li><a href="#tours" className="hover:text-yellow-400 transition">Tour Packages</a></li>
                <li><a href="#contact" className="hover:text-yellow-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-4 text-yellow-400 text-lg">SERVICES</h4>
              <ul className="space-y-2 font-semibold text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition">Airport Transfers</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">City Tours</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Intercity Travel</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Sedan Cars</a></li>
              </ul>
            </div>
            <div id="contact">
              <h4 className="font-black mb-4 text-yellow-400 text-lg">CONTACT</h4>
              <ul className="space-y-4 font-semibold text-gray-400">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-yellow-400 mt-1" />
                  <a href="tel:+64277777242" className="hover:text-yellow-400 transition font-black text-white">
                    +64 27 777 7242
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-yellow-400 mt-1" />
                  <a href="mailto:Luxurycabsltd@gmail.com" className="hover:text-yellow-400 transition break-all">
                    Luxurycabsltd@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 font-semibold">&copy; 2026 AFFORDABLE CABS LTD. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
