// app/our-story/page.tsx  (ya pages/our-story.tsx)
// Complete Our Story page — import all components

import AchievementsSection from "@/components/Our-story/AchievementsSection";
import OurJourney from "@/components/Our-story/OurJourney";
import OurValues from "@/components/Our-story/OurValues";
import OwnerSection from "@/components/Our-story/OwnerSection";
import StoryHero from "@/components/Our-story/StoryHero";
import TeamSection from "@/components/Our-story/TeamSection";



export default function OurStoryPage() {
  return (
    <main>
      <StoryHero />          {/* Page opening — bold headline + founding info */}
      <OwnerSection />       {/* Owner photo + bio + personal quote */}
      <OurJourney />         {/* Timeline — 2001 to 2024 */}
      <OurValues />          {/* 4 core values */}
      <TeamSection />        {/* Owner + 3 key staff members */}
      <AchievementsSection />{/* Awards, certifications, milestones */}
         {/* Personal closing message + visit CTA */}
    </main>
  );
}
