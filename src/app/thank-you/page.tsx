'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

type Booking = {
  pickup?: string;
  dropoff?: string;
  date?: string;
  time?: string;
  passengers?: string;
  vehicle?: string;
  name?: string;
  phone?: string;
};

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full shadow-2xl border-2 border-yellow-200">
        <CardHeader className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-t-lg">
          <CardTitle className="text-3xl font-black flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8" />
            THANK YOU!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="font-bold text-gray-800">
            If your payment was successful, Shopify will show the official order confirmation on the checkout thank-you
            page.
          </div>

          {booking ? (
            <div className="bg-white rounded-lg border p-4">
              <div className="font-black text-gray-900 mb-2">Your Booking Details</div>
              <div className="text-sm font-semibold text-gray-700 space-y-1">
                <div>Pickup: {booking.pickup || '-'}</div>
                <div>Drop-off: {booking.dropoff || '-'}</div>
                <div>Date/Time: {booking.date || '-'} {booking.time || ''}</div>
                <div>Passengers: {booking.passengers || '-'}</div>
                <div>Vehicle/Product: {booking.vehicle || '-'}</div>
                <div>Name: {booking.name || '-'}</div>
                <div>Phone: {booking.phone || '-'}</div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link className="flex-1" href="/">
              <Button className="w-full bg-black text-white font-black">BACK TO HOME</Button>
            </Link>
            <a className="flex-1" href="tel:+64277777242">
              <Button variant="outline" className="w-full font-black border-2 border-yellow-500 text-yellow-700">
                CALL SUPPORT
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
