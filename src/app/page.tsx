import SezioneVetrina from "@/components/home/vetrina/SezioneVetrina";
import SezioneProblema from "@/components/home/SezioneProblema";
import SezioneSoluzione from "@/components/home/SezioneSoluzione";
import SezioneTarget from "@/components/home/SezioneTarget";
import SezioneServizi from "@/components/home/SezioneServizi";
import SezioneRecensioni from "@/components/home/SezioneRecensioni";
import SezioneCtaFinale from "@/components/home/SezioneCtaFinale";

export default function HomePage() {
  return (
    <>
      {/* Scena a scroll che ingloba l'Hero: finisce dentro lo schermo del laptop. */}
      <SezioneVetrina />
      {/* Sovrapposta agli ultimi 100 lvh della scena: a fine scroll è già al suo posto.
          Contiene anche SezioneSoluzione, che al passaggio può essere già in vista. */}
      <div data-dopo-scena="" className="relative z-0 -mt-[100lvh] motion-reduce:mt-0">
        <SezioneProblema />
        <SezioneSoluzione />
      </div>
      <SezioneTarget />
      <SezioneServizi />
      <SezioneRecensioni />
      <SezioneCtaFinale />
    </>
  );
}
