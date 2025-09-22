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
    id: "video-1",
    title: "",
    url: "/videos/1.mp4",
    description: "",
  },
  {
    id: "video-2",
    title: "",
    url: "/videos/2.mp4",
    description: "",
  },
  {
    id: "video-3",
    title: "",
    url: "/videos/3.mp4",
    description: "",
  },
  {
    id: "video-4",
    title: "",
    url: "/videos/4.mp4",
    description: "",
  },
  {
    id: "video-5",
    title: "",
    url: "/videos/5.mp4",
    description: "",
  },
  {
    id: "video-6",
    title: "",
    url: "/videos/6.mp4",
    description: "",
  },
  {
    id: "video-7",
    title: "",
    url: "/videos/7.mp4",
    description: "",
  },
  {
    id: "video-8",
    title: "",
    url: "/videos/8.mp4",
    description: "",
  },
  {
    id: "video-9",
    title: "",
    url: "/videos/9.mp4",
    description: "",
  },
  {
    id: "video-10",
    title: "",
    url: "/videos/10.mp4",
    description: "",
  },
  {
    id: "video-11",
    title: "",
    url: "/videos/11.mp4",
    description: "",
  },
  {
    id: "video-12",
    title: "",
    url: "/videos/12.mp4",
    description: "",
  },
  {
    id: "video-13",
    title: "",
    url: "/videos/13.mp4",
    description: "",
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

                {/* Controls overlay */}
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
              </div>


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
                  <video
                    className="w-full h-full object-contain bg-black"
                    autoPlay
                    controls
                    playsInline
                  >
                    <source src={selectedVideo.url} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture vidéo.
                  </video>
                  

                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
