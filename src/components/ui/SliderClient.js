import Image from "next/image";

const ClientLogos = [
  { src: "/assets/airbush.png", alt: "Airbush" },
  { src: "/assets/Amazon.png", alt: "Amazon" },
  { src: "/assets/apple.png", alt: "Apple" },
  { src: "/assets/Boeing.svg", alt: "Boeing" },
  { src: "/assets/Booking.com_logo.png", alt: "Booking" },
  { src: "/assets/bosch.png", alt: "Bosch" },
  { src: "/assets/EA-Logo.svg", alt: "EA" },
  { src: "/assets/fox.svg", alt: "FOX" },
  { src: "/assets/Gameloft-Logo.png", alt: "Gameloft" },
  { src: "/assets/hp.png", alt: "HP" },
  { src: "/assets/intel.png", alt: "Intel" },
  { src: "/assets/LG.png", alt: "LG" },
  { src: "/assets/Microsoft.png", alt: "Microsoft" },
  { src: "/assets/nasa.png", alt: "NASA" },
  { src: "/assets/navy.png", alt: "Navy" },
  { src: "/assets/netflix.png", alt: "Netflix" },
  { src: "/assets/Nvidia-Logo.png", alt: "Nvidia" },
  { src: "/assets/Sony.png", alt: "Sony" },
  { src: "/assets/Tesla.svg.png", alt: "Tesla" },
  { src: "/assets/Warner_Bros_logo.svg.png", alt: "Warner Bros" },
];

export default function ClientSlide() {
  return (
    <>
      <section className="w-full px-20 mb-10">
        <h1 className="text-white text-4xl text-center mt-10 md:mt-15 font-bold">
          Our Clients
        </h1>
        <p className="text-gray-400 text-center mt-2 max-w-2xl mx-auto">
          We are proud to have collaborated with some of the world’s leading
          brands and organizations. Our commitment to quality and innovation has
          earned the trust of industry giants across various sectors.
        </p>
        <div className="logos">
          <div className="logos-slide">
            {/* First set of logos */}
            {ClientLogos.map((logo, index) => (
              <Image
                key={`first-${index}`}
                src={logo.src}
                alt={logo.alt}
                className="filter grayscale invert hover:opacity-100 transition duration-300"
                width={150}
                height={50}
              />
            ))}
            {/* Duplicate set for seamless loop */}
            {ClientLogos.map((logo, index) => (
              <Image
                key={`second-${index}`}
                src={logo.src}
                alt={logo.alt}
                className="filter grayscale invert hover:opacity-100 transition duration-300"
                width={150}
                height={50}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
