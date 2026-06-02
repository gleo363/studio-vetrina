import Hero from "@/components/home/Hero";
import SezioneProblema from "@/components/home/SezioneProblema";
import SezioneSoluzione from "@/components/home/SezioneSoluzione";
import SezioneTarget from "@/components/home/SezioneTarget";
import SezioneServizi from "@/components/home/SezioneServizi";
import SezioneCtaFinale from "@/components/home/SezioneCtaFinale";
import TransizioneScroll from "@/components/home/TransizioneScroll";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TransizioneScroll />
      <SezioneProblema />
      <SezioneSoluzione />
      <SezioneTarget />
      <SezioneServizi />
      <SezioneCtaFinale />
    </>
  );
}
