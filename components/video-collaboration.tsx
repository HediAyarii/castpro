"use client"

import { useState } from "react"
import { Volume2, VolumeX, Play, Pause, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface VideoData {
  id: string
  title: string
  url: string
  description: string
}

const videos: VideoData[] = [
  {
    id: "ourika-amazon-prime",
    title: "OURIKA - Bande Annonce (2024) - Amazon Prime",
    url: "https://sf075abb7cmwvhuh.public.blob.vercel-storage.com/OURIKA%20Bande%20Annonce%20%282024%29%20Booba%20-%20FilmsActu%20%28720p%2C%20h264%29.mp4",
    description: "Collaboration Internationale - Bande Annonce OURIKA (2024) avec Booba - Amazon Prime",
  },
  {
    id: "red-prod",
    title: "Red Prod",
    url: "https://sf075abb7cmwvhuh.public.blob.vercel-storage.com/Video%20by%20red_prodtn.mp4",
    description: "Red Prod - Collaboration vidéo",
  },
  {
    id: "samsung-casting",
    title: "Samsung Tunisia Casting",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BTS%20%F0%9F%8E%AC%20%40samsungtunisie%20Casting%20by%20%40dancelabstudiotn%20because%20the%20vision%20starts%20here%20%F0%9F%A7%AA%F0%9F%8C%9FSuch%20a%20pl-sWAV3Fevi31Infmgvo6REsebZJVIvl.mp4",
    description: "BTS 🎬 @samsungtunisie Casting by @dancelabstudiotn because the vision starts here 🧪🌟",
  },
  {
    id: "customer-relations",
    title: "Centre de Relations Clients",
    url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%D9%85%D8%B1%D9%83%D8%B2%20%D8%A7%D9%84%D8%B9%D9%84%D8%A7%D9%82%D8%A7%D8%AA%20%D9%85%D8%B9%20%D8%A7%D9%84%D8%AD%D8%B1%D9%81%D8%A7%D8%A1%20%21%20%D9%85%D8%B9%D8%A7%D9%83%D8%8C%20%D9%83%D9%84%20%D9%85%D8%A7%20%D8%AA%D8%B3%D8%AA%D8%AD%D9%82%D9%91%D9%86%D8%A7%F0%9F%93%9E%20%F0%9D%9F%91%F0%9D%9F%8F.%F0%9D%9F%91%F0%9D%9F%8F.%F0%9D%9F%8F%F0%9D%9F%96.%F0%9D%9F%8F%F0%9D%9F%96%20%F0%9D%90%82%F0%9D%90%9E%F0%9D%90%A7%F0%9D%90%AD%F0%9D%90%AB%F0%9D%90%9E%20%F0%9D%90%9D%F0%9D%90%9E%20%F0%9D%90%91%F0%9D%90%9E%F0%9D%90%9A%F0%9D%90%AD-Nw4vj8I5gXplWWmMr4p4W2QG7Wk0f6.mp4",
    description: "مركز العلاقات مع الحرفاء ! معاك، كل ما تستحقّنا📞 𝟑𝟏.𝟑𝟏.𝟏𝟖.𝟏𝟖",
  },
  {
    id: "ooredoo-5g",
    title: "Ooredoo 5G TVC",
    url: "https://sf075abb7cmwvhuh.public.blob.vercel-storage.com/5G_TVC_Ooredoo.mp4",
    description: "Spot Ooredoo 5G",
  },
  {
    id: "ooredoo-tar",
    title: "Ooredoo TAR TVC",
    url: "https://sf075abb7cmwvhuh.public.blob.vercel-storage.com/TAR_TVC_Ooredoo.mp4",
    description: "Spot Ooredoo TAR",
  },
  {
    id: "orange-nini",
    title: "Orange - Nini Nini TVC",
    url: "https://sf075abb7cmwvhuh.public.blob.vercel-storage.com/Orange%20-%20Nini%20Nini%20-%20TVC.mp4",
    description: "Spot Orange - Nini Nini",
  },
  {
    id: "ice-vegas",
    title: "ICE VEGAS TVC",
    url: "https://sf075abb7cmwvhuh.public.blob.vercel-storage.com/ICE%20VEGAS_TVC.mp4",
    description: "Spot ICE VEGAS",
  },
  {
    id: "danette-delice",
    title: "Danette TVC - Délice",
    url: "https://sf075abb7cmwvhuh.public.blob.vercel-storage.com/Danette_TVC_D%C3%A9lice.mp4",
    description: "Spot Danette - Délice",
  },
  {
    id: "tt-summer-cut",
    title: "Tunisie Telecom - Summer Cut",
    url: "https://sf075abb7cmwvhuh.public.blob.vercel-storage.com/The%20summer%20cut%20for%20%40tunisietelecom%20%20X%20JWT%20TunisiaDirector%20-%20%40moncefhenaien%20DP%20-%20%40aissaamine%20Post.mp4",
    description: "Tunisie Telecom - Summer Cut",
  },
  {
    id: "biat-groom-trouble",
    title: "BIAT - Groom Trouble",
    url: "https://sf075abb7cmwvhuh.public.blob.vercel-storage.com/Groom%20trouble%20-%20Biat%20Director%20Farouk%20FayalaDO%20Bechir%20Mahbouli.mp4",
    description: "BIAT - Groom Trouble",
  },
  {
    id: "biat-latest",
    title: "BIAT - Latest",
    url: "https://sf075abb7cmwvhuh.public.blob.vercel-storage.com/One%20of%20our%20latest%20for%20%40biattunisie%20Directed%20by%20%40faroukfayala%20DP%20%40bechirmahbouli%20%281%29.mp4",
    description: "BIAT - Latest",
  },
  {
    id: "samsung-awesome-mission",
    title: "SAMSUNG - Awesome Mission",
    url: "https://sf075abb7cmwvhuh.public.blob.vercel-storage.com/AWESOME%20MISSION%20-%20SAMSUNG%20-%20DCDirector%20%40faroukfayala%20DP%20%40aissaamine.mp4",
    description: "Collaboration Internationale - SAMSUNG - Awesome Mission",
  },
]

const collaboratorLogos = [
  {
    name: "Access Content Agency",
    logo: "/images/access-logo.png",
    alt: "Access Content Agency Logo",
  },
  {
    name: "SVP Production",
    logo: "/images/svp-production-logo.png",
    alt: "SVP Production Logo",
  },
  {
    name: "Amazon Prime",
    logo: "/images/amazon-prime-logo.png",
    alt: "Amazon Prime Logo",
  },
  {
    name: "Banni Banni",
    logo: "/images/banni-banni-logo.png",
    alt: "Banni Banni Logo",
  },
  {
    name: "Urban Dance Academy",
    logo: "/images/urban-dance-logo.jpeg",
    alt: "Ala Zrafi's Urban Dance Academy Logo",
  },
  {
    name: "Red Prod",
    logo: "/images/red-prod-logo.png",
    alt: "Red Prod Logo",
  },
]

export function VideoCollaboration() {
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>(
    videos.reduce((acc, video) => ({ ...acc, [video.id]: true }), {}),
  )

  const [playingStates, setPlayingStates] = useState<Record<string, boolean>>(
    videos.reduce((acc, video) => ({ ...acc, [video.id]: true }), {}),
  )

  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const toggleMute = (videoId: string) => {
    setMutedStates((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }))
  }

  const togglePlay = (videoId: string) => {
    setPlayingStates((prev) => ({
      ...prev,
      [videoId]: !prev[videoId],
    }))
  }

  const openVideoDialog = (video: VideoData) => {
    setSelectedVideo(video)
    setIsDialogOpen(true)
  }

  const closeVideoDialog = () => {
    setIsDialogOpen(false)
    setSelectedVideo(null)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-space-grotesk mb-4">Nos Collaborations</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos projets récents et nos collaborations avec les plus grandes marques, incluant des collaborations internationales
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <Card
              key={video.id}
              className={`group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer ${
                index === 0 ? "md:col-span-3" : ""
              }`}
              onClick={() => openVideoDialog(video)}
            >
              <div className="relative">
                {video.url.includes("vimeo.com") ? (
                  <iframe
                    src={`${video.url}?badge=0&autopause=0&player_id=0&app_id=58479`}
                    className="w-full h-64"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  />
                ) : (
                  <video
                    className="w-full h-64 object-cover"
                    autoPlay
                    loop
                    muted={mutedStates[video.id]}
                    playsInline
                    onLoadedData={(e) => {
                      if (playingStates[video.id]) {
                        e.currentTarget.play()
                      } else {
                        e.currentTarget.pause()
                      }
                    }}
                  >
                    <source src={video.url} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                )}

                {/* Controls overlay only for native videos */}
                {!video.url.includes("vimeo.com") && (
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white text-black"
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePlay(video.id)
                        }}
                      >
                        {playingStates[video.id] ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 hover:bg-white text-black"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleMute(video.id)
                        }}
                      >
                        {mutedStates[video.id] ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                )}

                {!video.url.includes("vimeo.com") && (
                  <div className="absolute top-4 right-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70 text-white border-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleMute(video.id)
                      }}
                    >
                      {mutedStates[video.id] ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                  </div>
                )}
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold font-space-grotesk mb-2">{video.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{video.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Video Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0">
            <div className="relative w-full h-full">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-0"
                onClick={closeVideoDialog}
              >
                <X className="w-6 h-6" />
              </Button>
              
              {selectedVideo && (
                <div className="w-full h-full flex flex-col">
                  {selectedVideo.url.includes("vimeo.com") ? (
                    <iframe
                      src={`${selectedVideo.url}?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={selectedVideo.title}
                    />
                  ) : (
                    <video
                      className="w-full h-full object-contain bg-black"
                      autoPlay
                      controls
                      playsInline
                    >
                      <source src={selectedVideo.url} type="video/mp4" />
                      Votre navigateur ne supporte pas la lecture vidéo.
                    </video>
                  )}
                  
                  <div className="p-6 bg-white">
                    <h3 className="text-2xl font-bold font-space-grotesk mb-2">{selectedVideo.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">{selectedVideo.description}</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
