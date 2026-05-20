'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { Calendar, Car, CheckCircle2, Clock, Home, MailCheck, MapPin, Phone, Users } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

type Booking = {
  pickup?: string;
  dropoff?: string;
  date?: string;
  time?: string;
  passengers?: string;
  vehicleType?: string;
  vehicle?: string;
  name?: string;
  phone?: string;
};

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-800">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-black uppercase tracking-wide text-gray-500">{label}</div>
        <div className="break-words text-sm font-bold text-gray-900">{value || '-'}</div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('latest_booking');
      if (raw) setBooking(JSON.parse(raw));
    } catch {
      setBooking(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-8 text-gray-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="rounded-2xl border border-yellow-400/30 bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 text-black shadow-2xl">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black text-yellow-400 shadow-lg">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-wide text-gray-900/70">Payment received</div>
                <h1 className="mt-1 text-3xl font-black leading-tight sm:text-4xl">Booking Confirmed</h1>
                <p className="mt-2 max-w-2xl text-base font-bold text-gray-900">
                  Your confirmation email is on its way. Our team will review the trip details and contact you shortly.
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-white/80 px-4 py-3 text-sm font-black shadow">
              <div className="text-gray-600">Support</div>
              <a href="tel:+64277777242" className="text-gray-950">
                +64 27 777 7242
              </a>
            </div>
          </div>
        </div>

        <Card className="w-full overflow-hidden border-0 bg-white shadow-2xl">
          <CardHeader className="border-b bg-white">
            <CardTitle className="flex items-center gap-3 text-2xl font-black text-gray-950">
              <MailCheck className="h-7 w-7 text-yellow-600" />
              Your Booking Details
            </CardTitle>
        </CardHeader>
          <CardContent className="space-y-6 p-5 sm:p-6">
          {booking ? (
              <div className="grid gap-3 md:grid-cols-2">
                <DetailRow icon={<MapPin className="h-5 w-5" />} label="Pickup" value={booking.pickup} />
                <DetailRow icon={<MapPin className="h-5 w-5" />} label="Drop-off" value={booking.dropoff} />
                <DetailRow icon={<Calendar className="h-5 w-5" />} label="Pickup Date" value={booking.date} />
                <DetailRow icon={<Clock className="h-5 w-5" />} label="Pickup Time" value={booking.time} />
                <DetailRow icon={<Users className="h-5 w-5" />} label="Passengers" value={booking.passengers} />
                <DetailRow icon={<Car className="h-5 w-5" />} label="Vehicle" value={booking.vehicle} />
                <DetailRow icon={<Car className="h-5 w-5" />} label="Vehicle Type" value={booking.vehicleType} />
                <DetailRow icon={<Phone className="h-5 w-5" />} label="Phone" value={booking.phone} />
              </div>
            ) : (
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 font-bold text-yellow-900">
                Your payment was received. Booking details are being processed.
              </div>
            )}

            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="font-black text-green-900">What happens next?</div>
              <div className="mt-1 text-sm font-semibold text-green-800">
                We will verify your booking, confirm driver availability, and contact you using the phone number provided.
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link className="flex-1" href="/">
                <Button className="h-12 w-full bg-black font-black text-white hover:bg-gray-900">
                  <Home className="mr-2 h-5 w-5" />
                  BACK TO HOME
                </Button>
            </Link>
              <a className="flex-1" href="tel:+64277777242">
                <Button variant="outline" className="h-12 w-full border-2 border-yellow-500 font-black text-yellow-700 hover:bg-yellow-50">
                  <Phone className="mr-2 h-5 w-5" />
                  CALL SUPPORT
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
