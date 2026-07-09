import SEO from '../components/SEO';
import { SobreHero } from '../components/sections/sobre/SobreHero';
import { SobreTrajetoria } from '../components/sections/sobre/SobreTrajetoria';
import { SobreAntesDepois } from '../components/sections/sobre/SobreAntesDepois';
import { SobreHistoria } from '../components/sections/sobre/SobreHistoria';

// ============================================================
// Sobre — página na direção "Editorial Orgânico".
// Composição fina: cada seção vive em components/sections/sobre.
// ============================================================

export default function Sobre() {
  return (
    <div className="relative bg-background dark:bg-stone-950 overflow-x-hidden transition-colors duration-500">
      <SEO
        title="Sobre Mariana Bermudes | Nutricionista"
        description="Conheça a trajetória de Mariana Bermudes, nutricionista formada pelo Centro Universitário São Camilo, especializada em nutrição comportamental."
      />
      <SobreHero />
      <SobreTrajetoria />
      <SobreAntesDepois />
      <SobreHistoria />
    </div>
  );
}
