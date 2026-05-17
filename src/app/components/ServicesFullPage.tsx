import { SectionHeader } from './SectionHeader';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Check, Phone, Star, Clock, Shield, Award, Users } from 'lucide-react';

interface ServicesFullPageProps {
  onBookNow: (service: any) => void;
}

export function ServicesFullPage({ onBookNow }: ServicesFullPageProps) {
  const services = [
    {
      title: 'AIRPORT TRANSFERS',
      tagline: 'Premium 24/7 Auckland Airport Service',
      description: 'Experience hassle-free airport transportation with our professional meet & greet service, flight tracking, and affordable vehicles.',
      image: 'https://images.unsplash.com/photo-1616804947838-6646ae0e423d?w=800',
      price: 65,
      features: ['Flight Tracking', 'Meet & Greet', 'Luggage Assistance', 'Free Wait Time', 'All Terminals Coverage']
    },
    {
      title: 'WEDDING SERVICES',
      tagline: 'Make Your Special Day Perfect',
      description: 'Elegant wedding transportation with decorated vehicles, red carpet service, and professional chauffeurs for your dream wedding.',
      image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
      price: 799,
      features: ['Decorated Vehicles', 'Red Carpet Service', 'Champagne Included', 'Photography Time', 'Bridal Packages']
    },
    {
      title: 'CITY TOURS',
      tagline: 'Explore Auckland in Affordable',
      description: 'Discover Auckland\'s best attractions with our guided tours, professional drivers, and customizable itineraries.',
      image: 'https://images.unsplash.com/photo-1595125989588-36d745a2a828?w=800',
      price: 499,
      features: ['Professional Guide', 'All Major Attractions', 'Photo Stops', 'Flexible Duration', 'Custom Routes']
    },
    {
      title: 'INTERCITY TRAVEL',
      tagline: 'Comfortable Long Distance Journeys',
      description: 'Travel between cities in comfort and style with our spacious vans and experienced drivers.',
      image: 'https://images.unsplash.com/photo-1602847189686-6bb361a3066d?w=800',
      price: 180,
      features: ['Long Distance Comfort', 'Spacious Vehicles', 'Rest Stops', 'Luggage Space', 'Direct Routes']
    },
    {
      title: 'CORPORATE EVENTS',
      tagline: 'Professional Business Transportation',
      description: 'Impress clients and executives with our premium corporate transportation services for meetings and events.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      price: 120,
      features: ['Executive Vehicles', 'Punctual Service', 'Professional Drivers', 'Invoicing Available', 'Account Management']
    },
    {
      title: 'SPECIAL OCCASIONS',
      tagline: 'Celebrate in Style',
      description: 'Perfect transportation for birthdays, anniversaries, and special celebrations with customizable packages.',
      image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800',
      price: 299,
      features: ['Customizable Packages', 'Vehicle Decorations', 'VIP Treatment', 'Group Friendly', 'Special Requests']
    }
  ];

  const pricing = [
    { service: 'Airport Transfer', sedan: '$65', van: '$120', description: 'One-way to city center' },
    { service: 'Hourly Hire', sedan: '$75/hr', van: '$125/hr', description: 'Minimum 2 hours' },
    { service: 'City Tour (3hrs)', sedan: '$499', van: '$990', description: 'All attractions included' },
    { service: 'Intercity Hamilton', sedan: '$180', van: '$320', description: 'One-way transfer' },
    { service: 'Wedding Package', sedan: '$799', van: '$1,499', description: 'Full day service' }
  ];

  const whyChoose = [
    {
      icon: Shield,
      title: 'LICENSED & INSURED',
      description: 'All vehicles fully insured and drivers are licensed professionals'
    },
    {
      icon: Clock,
      title: '24/7 AVAILABILITY',
      description: 'Round-the-clock service with instant booking confirmation'
    },
    {
      icon: Award,
      title: 'TOP RATED',
      description: '500+ five-star reviews from satisfied customers'
    },
    {
      icon: Users,
      title: 'EXPERIENCED DRIVERS',
      description: '10+ years average driving experience'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      service: 'Airport Transfer',
      rating: 5,
      text: 'Punctual, professional, and the vehicle was spotless. Best airport transfer service in Auckland!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
    },
    {
      name: 'Michael Chen',
      service: 'Wedding Service',
      rating: 5,
      text: 'Made our wedding day perfect! The decorated vehicle was stunning and the driver was amazing.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
    },
    {
      name: 'Emma Wilson',
      service: 'City Tour',
      rating: 5,
      text: 'Excellent city tour! Our guide knew everything about Auckland. Highly recommend!',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-black">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1616804947838-6646ae0e423d?w=1920"
            alt="Services"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-6xl font-black mb-6">OUR PREMIUM SERVICES</h1>
            <p className="text-2xl font-bold text-yellow-400 mb-8">
              Comprehensive affordable transportation solutions for every need
            </p>
          </div>
        </div>
      </section>

      {/* Section 1: All Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="EXPLORE OUR SERVICES"
            subtitle="Professional transportation for every occasion"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all group">
                <div className="h-64 overflow-hidden relative">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl font-black mb-1">{service.title}</h3>
                    <p className="text-sm font-semibold">{service.tagline}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="font-semibold text-gray-600 mb-4">{service.description}</p>
                  <div className="mb-4">
                    <div className="text-3xl font-black text-yellow-600 mb-1">
                      ${service.price}
                    </div>
                    <div className="text-sm font-bold text-gray-500">Starting from</div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => onBookNow(service)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-black"
                  >
                    BOOK NOW
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Pricing Table */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="TRANSPARENT PRICING"
            subtitle="Clear rates with no hidden charges"
          />
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black">
                    <tr>
                      <th className="text-left p-6 font-black text-lg">SERVICE</th>
                      <th className="text-center p-6 font-black text-lg">SEDAN</th>
                      <th className="text-center p-6 font-black text-lg">VAN</th>
                      <th className="text-left p-6 font-black text-lg">DETAILS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricing.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 transition">
                        <td className="p-6 font-bold text-gray-900">{item.service}</td>
                        <td className="p-6 text-center font-black text-2xl text-yellow-600">{item.sedan}</td>
                        <td className="p-6 text-center font-black text-2xl text-yellow-600">{item.van}</td>
                        <td className="p-6 font-semibold text-gray-600">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
            <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-500 rounded-lg text-center">
              <p className="font-black text-gray-900 text-lg">
                💰 All prices in NZD | Free quote available | Special discounts for regular customers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="WHY CHOOSE OUR SERVICES"
            subtitle="Excellence in every journey"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChoose.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-2xl transition-all p-8">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <item.icon className="w-10 h-10 text-black" />
                </div>
                <h3 className="font-black text-xl mb-3 text-gray-900">{item.title}</h3>
                <p className="font-semibold text-gray-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Service Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="HOW IT WORKS"
            subtitle="Simple booking process in 4 easy steps"
          />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: '1', title: 'SELECT SERVICE', desc: 'Choose your required service type' },
              { step: '2', title: 'BOOK ONLINE', desc: 'Fill details or call us directly' },
              { step: '3', title: 'GET CONFIRMED', desc: 'Instant confirmation with driver info' },
              { step: '4', title: 'ENJOY RIDE', desc: 'Premium affordable transportation' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-4xl font-black text-black">{item.step}</span>
                </div>
                <h3 className="font-black text-lg mb-2 text-gray-900">{item.title}</h3>
                <p className="font-semibold text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Customer Reviews */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="CUSTOMER REVIEWS"
            subtitle="What our clients say about our services"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-500">
                      <ImageWithFallback
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-gray-900">{testimonial.name}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700 mb-3 italic">"{testimonial.text}"</p>
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold inline-block">
                    {testimonial.service}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="FREQUENTLY ASKED QUESTIONS"
            subtitle="Common questions about our services"
          />
          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                q: 'What services do you offer?',
                a: 'We offer airport transfers, city tours, intercity travel, wedding services, corporate transportation, and special occasion packages.'
              },
              {
                q: 'How do I book a service?',
                a: 'You can book online through our website, call +64 27 777 7242, or WhatsApp us. We provide instant confirmation.'
              },
              {
                q: 'Are your prices fixed or negotiable?',
                a: 'Our prices are transparent and fixed. We offer special discounts for regular customers and group bookings.'
              },
              {
                q: 'Do you provide 24/7 service?',
                a: 'Yes, we operate 24/7 including weekends and public holidays for all our services.'
              }
            ].map((faq, index) => (
              <Card key={index} className="border-l-4 border-yellow-500 hover:shadow-lg transition">
                <CardContent className="p-6">
                  <h3 className="font-black text-lg mb-3 text-gray-900">{faq.q}</h3>
                  <p className="font-semibold text-gray-700">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: CTA */}
      <section className="py-20 bg-gradient-to-r from-yellow-500 to-yellow-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-black text-black mb-6">READY TO BOOK?</h2>
          <p className="text-2xl font-bold text-gray-900 mb-10">
            Get instant quotes and professional service now
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <a href="tel:+64277777242">
              <Button size="lg" className="bg-black hover:bg-gray-900 text-white font-black text-xl px-12 py-8">
                <Phone className="w-6 h-6 mr-3" />
                CALL +64 27 777 7242
              </Button>
            </a>
            <Button
              size="lg"
              onClick={() => onBookNow(services[0])}
              className="bg-white hover:bg-gray-100 text-black font-black text-xl px-12 py-8"
            >
              BOOK ONLINE NOW
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
