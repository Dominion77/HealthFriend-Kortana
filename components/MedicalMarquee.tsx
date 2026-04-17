"use client";

import Image from "next/image";

const medicalImages = [
  {
    src: "https://images.unsplash.com/photo-1576671081837-49000212a370?q=80&w=1098&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Modern medical equipment"
  },
  {
    src: "https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Doctor consultation"
  },
  {
    src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Medical stethoscope"
  },
  {
    src: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=1152&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Healthcare technology"
  },
  {
    src: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Medical research"
  },
  {
    src: "https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Hospital corridor"
  },
  {
    src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&crop=center",
    alt: "Medical team"
  },
  {
    src: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1130&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Digital health"
  }
];

interface MarqueeRowProps {
  images: typeof medicalImages;
  direction: "left" | "right";
  speed: number;
}

function MarqueeRow({ images, direction, speed }: MarqueeRowProps) {
  return (
    <div className="flex overflow-hidden">
      <div 
        className={`flex gap-6 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {/* First set */}
        {images.map((image, index) => (
          <div key={`first-${index}`} className="flex-shrink-0">
            <div className="w-80 h-48 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <Image
                src={image.src}
                alt={image.alt}
                width={320}
                height={192}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {images.map((image, index) => (
          <div key={`second-${index}`} className="flex-shrink-0">
            <div className="w-80 h-48 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <Image
                src={image.src}
                alt={image.alt}
                width={320}
                height={192}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MedicalMarquee() {
  const firstRow = medicalImages.slice(0, 4);
  const secondRow = medicalImages.slice(4, 8);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black tracking-tighter text-gray-900 mb-4">
          Trusted by Healthcare Professionals
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience the future of telemedicine with cutting-edge technology and world-class medical expertise
        </p>
      </div>
      
      <div className="space-y-6">
        <MarqueeRow images={firstRow} direction="left" speed={30} />
        <MarqueeRow images={secondRow} direction="right" speed={25} />
      </div>
    </section>
  );
}