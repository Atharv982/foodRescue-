'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ImpactMetrics from '@/components/ImpactMetrics';
import ImpactCalculator from '@/components/ImpactCalculator';
import HowItWorks from '@/components/HowItWorks';
import FoodBoxExplorer from '@/components/FoodBoxExplorer';
import PartnerSpotlight from '@/components/PartnerSpotlight';
import CommunityStories from '@/components/CommunityStories';
import FaqSection from '@/components/FaqSection';
import EventDonationSection from '@/components/EventDonationSection';
import Footer from '@/components/Footer';
import FoodBoxDetailModal from '@/components/FoodBoxDetailModal';
import ReservationModal from '@/components/ReservationModal';
import ScrollReveal from '@/components/ScrollReveal';

import { foodBoxes as initialFoodBoxes } from '@/lib/food-data';
import type { FoodBox } from '@/types/food';

export default function Home() {
  const [boxes, setBoxes] = useState<FoodBox[]>(initialFoodBoxes);
  const [selectedBox, setSelectedBox] = useState<FoodBox | null>(null);
  const [reservationBox, setReservationBox] = useState<FoodBox | null>(null);
  const [filteredPartner, setFilteredPartner] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState('All Zones');

  // Handle successful reservation by decrementing local quantity
  const handleReservationSuccess = (foodBoxId: string, quantity: number) => {
    setBoxes((current) =>
      current.map((box) =>
        box.id === foodBoxId
          ? { ...box, quantityAvailable: Math.max(0, box.quantityAvailable - quantity) }
          : box
      )
    );
  };

  const openReservation = (box: FoodBox) => {
    setSelectedBox(null);
    setReservationBox(box);
  };

  const handleSelectPartner = (partnerName: string) => {
    setFilteredPartner(partnerName);
    const el = document.getElementById('batches');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickFilter = (filters: { zone: string; category: string; minServings: number }) => {
    if (filters.zone) {
      setSelectedZone(filters.zone);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ec] text-[#1c241f]">
      {/* 1. Global Navigation with All 7 Dropdown Menus + Zone & Rescue Hub */}
      <Navbar
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
      />

      {/* 2. Section 1: Hero with Gentle Floating Animation & Interactive Parallax Photo */}
      <HeroSection
        featuredBox={boxes[0]}
        onReserve={openReservation}
        onOpen={(box) => setSelectedBox(box)}
        onQuickFilter={handleQuickFilter}
      />

      {/* 3. Section 2: Live Impact Metrics (Scroll-Reveal Animated) */}
      <ScrollReveal delay={100}>
        <ImpactMetrics />
      </ScrollReveal>

      {/* 4. Section 3: Interactive Event Waste & Hunger Calculator (Scroll-Reveal Animated) */}
      <ScrollReveal delay={120}>
        <ImpactCalculator />
      </ScrollReveal>

      {/* 5. Section 4: How Wedding & Party Food Rescue Works (Scroll-Reveal Animated) */}
      <ScrollReveal delay={120}>
        <HowItWorks />
      </ScrollReveal>

      {/* 6. Section 5: Available Food Batches with 10 Dropdowns & Radar View (Scroll-Reveal Animated) */}
      <ScrollReveal delay={120}>
        <FoodBoxExplorer
          boxes={boxes}
          onOpen={(box) => setSelectedBox(box)}
          onReserve={openReservation}
          selectedPartner={filteredPartner}
          onClearPartnerFilter={() => setFilteredPartner(null)}
          selectedZoneFilter={selectedZone}
          onZoneChange={setSelectedZone}
        />
      </ScrollReveal>

      {/* 7. Section 6: Partner Venues & Recipient Shelter Homes (Scroll-Reveal Animated) */}
      <ScrollReveal delay={120}>
        <PartnerSpotlight
          foodBoxes={boxes}
          onSelectPartner={handleSelectPartner}
        />
      </ScrollReveal>

      {/* 8. Section 7: Community Voices & Stories (Scroll-Reveal Animated) */}
      <ScrollReveal delay={120}>
        <CommunityStories />
      </ScrollReveal>

      {/* 9. Section 8: Interactive FAQ Accordion (Scroll-Reveal Animated) */}
      <ScrollReveal delay={120}>
        <FaqSection />
      </ScrollReveal>

      {/* 10. Section 9: Working Event Food Rescue Scheduling Form (Scroll-Reveal Animated) */}
      <ScrollReveal delay={120}>
        <EventDonationSection />
      </ScrollReveal>

      {/* 11. Global Footer */}
      <Footer />

      {/* Detail Modal */}
      {selectedBox && (
        <FoodBoxDetailModal
          box={selectedBox}
          onClose={() => setSelectedBox(null)}
          onReserve={openReservation}
        />
      )}

      {/* Relief Allocation Modal */}
      {reservationBox && (
        <ReservationModal
          box={reservationBox}
          onClose={() => setReservationBox(null)}
          onSuccess={handleReservationSuccess}
        />
      )}
    </main>
  );
}
