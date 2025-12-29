import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import FloatingMenu from "../components/FloatingMenu";
import ImageCard from "../components/ImageCard";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6f3ee] via-[#f2efe9] to-[#ebe6dc] text-gray-800">
      <Navbar />
      <Hero />
      {/* Image preview card — place your image at public/card-sample.jpg */}
      <ImageCard title="Pinboard preview" description="Drop your image at public/card-sample.jpg to preview." />
      <Features />
      <FloatingMenu />
    </div>
  );
}
