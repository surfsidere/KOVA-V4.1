import { EtherealDepth } from "@/components/ui/ethereal-depth"
import KovaPage from "@/components/ui/kova-hero"

export default function Home() {
  return (
    <main className="relative bg-[#020010]">
      <EtherealDepth />
      <div className="relative z-10">
        <KovaPage />
      </div>
    </main>
  )
}
