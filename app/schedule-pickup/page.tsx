'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubpageHeader from '@/components/SubpageHeader';
import FoodDonationRegistrationForm from '@/components/FoodDonationRegistrationForm';

function SchedulePickupContent() {
  const searchParams = useSearchParams();
  const prefillVenue = searchParams?.get('venue') || '';
  const prefillCaterer = searchParams?.get('caterer') || '';
  const prefillServings = searchParams?.get('servings') || '100';
  const prefillType = searchParams?.get('type') || 'Wedding';

  return (
    <div className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      <Navbar />

      <SubpageHeader
        theme="food"
        breadcrumbs={[{ label: 'Schedule Pickup' }]}
        eyebrow="100% Free · Insulated Van Transport"
        title="Schedule a Wedding or Banquet Food Rescue"
        badge="Zero Cost"
        description="Book certified volunteer food rescue handlers and insulated thermal vans for your upcoming wedding, party, or celebration anywhere across Greater Mumbai."
      />

      <div className="section-shell py-10 lg:py-16">
        <div className="max-w-3xl mx-auto">
          <FoodDonationRegistrationForm
            initialValues={{
              venue: prefillVenue,
              caterer: prefillCaterer,
              servings: prefillServings,
              type: prefillType,
            }}
            standalone={true}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function SchedulePickupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f7f4ec] flex items-center justify-center p-12 text-xs font-bold text-ink/50">
          Loading Food Donation Registration...
        </div>
      }
    >
      <SchedulePickupContent />
    </Suspense>
  );
}
