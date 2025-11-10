"use client"

import * as React from "react"
import { useBoolean } from "@/hooks/use-boolean"
import {
  Download,
  ImageIcon,
  Loader2,
  RotateCw,
  Wand2,
  Sparkles,
  Settings,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const AI_PROVIDERS = [
  { value: "openai", label: "OpenAI DALL-E" },
  { value: "stability", label: "Stability AI" },
  { value: "midjourney", label: "Midjourney" },
  { value: "google", label: "Google Imagen" },
  { value: "anthropic", label: "Anthropic" },
]

const IMAGE_SIZES = [
  { value: "21:9", label: "21:9 Ultra-wide" },
  { value: "16:9", label: "16:9 Widescreen" },
  { value: "3:2", label: "3:2 Classic" },
  { value: "1:1", label: "1:1 Square" },
  { value: "4:5", label: "4:5 Portrait" },
  { value: "2:3", label: "2:3 Vertical" },
  { value: "9:16", label: "9:16 Mobile" },
  { value: "9:21", label: "9:21 Ultra-tall" },
]

export default function AIImageGeneratorBlock() {
  const [provider, setProvider] = React.useState("openai")
  const [imageSize, setImageSize] = React.useState("1:1")
  const [prompt, setPrompt] = React.useState("")
  const [isGenerating, { setTrue: setGeneratingTrue, setFalse: setGeneratingFalse }] = useBoolean(false)
  const [generatedImage, setGeneratedImage] = React.useState<string | null>(
    null
  )
  const [error, setError] = React.useState<string | null>(null)

  const handleGenerate = async () => {
    setGeneratingTrue()

    // Simulate image generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Use a placeholder image service with default dimensions
    // In production, the aspect ratio (imageSize) would be sent to Stability AI API
    const seed = Math.floor(Math.random() * 1000)
    setGeneratedImage(`https://picsum.photos/seed/${seed}/1024/1024`)

    setGeneratingFalse()
  }

  const handleDownload = () => {
    if (!generatedImage) return
    const link = document.createElement("a")
    link.href = generatedImage
    link.download = "ai-generated-image.png"
    link.click()
  }



  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-[Akronim] text-white mb-4 teal-echo">
          AI TATTOO GENERATOR
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground font-[Roboto_Condensed] max-w-2xl mx-auto">
          Transform your vision into stunning tattoo designs with AI-powered creativity
        </p>
      </div>

      <Card className="bg-card/95 border-accent/20 backdrop-blur-sm">
        <CardHeader className="border-b border-accent/10">
          <CardTitle className="flex items-center justify-center gap-3 text-white font-[Orbitron] text-xl">
            <Sparkles className="h-6 w-6 text-accent" />
            TATTOO DESIGN STUDIO
            <Sparkles className="h-6 w-6 text-accent" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 sm:grid-cols-2 mb-8">
            <div className="space-y-3">
              <Label className="text-white font-[Orbitron] text-sm flex items-center gap-2">
                <Settings className="h-4 w-4 text-accent" />
                AI PROVIDER
              </Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger className="bg-input/50 border-accent/30 text-white font-[Roboto_Condensed]">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent className="bg-card border-accent/30">
                  {AI_PROVIDERS.map((p) => (
                    <SelectItem key={p.value} value={p.value} className="text-white hover:bg-accent/20">
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-white font-[Orbitron] text-sm flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-accent" />
                IMAGE SIZE
              </Label>
              <Select value={imageSize} onValueChange={setImageSize}>
                <SelectTrigger className="bg-input/50 border-accent/30 text-white font-[Roboto_Condensed]">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent className="bg-card border-accent/30">
                  {IMAGE_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value} className="text-white hover:bg-accent/20">
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-accent to-teal-400 hover:from-accent/80 hover:to-teal-400/80 text-background font-[Orbitron] text-lg py-6 shadow-lg shadow-accent/25"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    CREATING YOUR TATTOO...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-3 h-5 w-5" />
                    GENERATE TATTOO DESIGN
                  </>
                )}
              </Button>

              {generatedImage && (
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-teal-400/20 rounded-lg blur-xl"></div>
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-accent/50 bg-card/80 backdrop-blur-sm">
                      <img
                        src={generatedImage}
                        alt="Generated Tattoo"
                        className="h-full w-full object-contain"
                      />
                      <div className="absolute top-4 right-4">
                        <div className="bg-accent/90 text-background px-3 py-1 rounded-full text-xs font-[Orbitron] backdrop-blur-sm">
                          AI GENERATED
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleDownload}
                      className="flex-1 bg-accent hover:bg-accent/80 text-background font-[Orbitron] shadow-lg"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      DOWNLOAD
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex-1 border-accent/50 text-accent hover:bg-accent/10 font-[Orbitron]"
                    >
                      <RotateCw className="mr-2 h-4 w-4" />
                      REGENERATE
                    </Button>
                  </div>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
