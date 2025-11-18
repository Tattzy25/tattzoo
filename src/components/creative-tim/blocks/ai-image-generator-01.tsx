"use client"
import {
  Download,
  ImageIcon,
  Loader2,
  RotateCw,
  Wand2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useGeneratorState } from "../../generator-page/hooks/use-generator-state"
import { useGeneration } from "../../generator-page/hooks/use-generation"


const ASPECT_OPTIONS = ["1:1", "16:9", "9:16"] as const

// Aspect ratio options drive backend sizing; UI doesn’t compute dims here

export default function AIImageGeneratorBlock() {
  const {
    generating,
    generatedImage,
    validationError,
    selectedAspectRatio,
    setSelectedAspectRatio,
    setGenerating,
    setGenerated,
    setGeneratedImage,
    setValidationError,
    license,
    generator,
  } = useGeneratorState()

  const { handleGenerate } = useGeneration({
    license,
    selectedStyle: generator.getSelections().style || 'Traditional',
    selectedColorPreference: generator.getSelections().color || 'Black & Grey',
    selectedMood: generator.getSelections().mood || 'happy',
    selectedPlacement: generator.getSelections().placement || null,
    selectedSize: generator.getSelections().size || null,
    selectedAspectRatio,
    generator,
    setGenerating,
    setGenerated,
    setGeneratedImage,
    setValidationError,
  })

  const handleDownload = () => {
    if (!generatedImage) return
    const link = document.createElement("a")
    link.href = generatedImage
    link.download = "ai-generated-image.png"
    link.click()
  }



  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <Card className="bg-card/95 border-accent/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="mb-8">
            <Label className="text-white font-[Orbitron] text-xl md:text-2xl tracking-wider flex items-center gap-3 mb-4 justify-center text-center">
              <ImageIcon className="h-4 w-4 text-accent" />
              IMAGE SIZE
            </Label>
            <div className="flex justify-center gap-4">
              {ASPECT_OPTIONS.map((ratio) => (
                <Button
                  key={ratio}
                  data-testid={`aspect-${ratio.replace(":","-")}`}
                  type="button"
                  onClick={() => setSelectedAspectRatio(ratio)}
                  className={`w-28 h-28 rounded-xl font-[Orbitron] text-lg transition-all duration-200 ${
                    selectedAspectRatio === ratio
                      ? "text-accent border border-accent/60 bg-accent/10 shadow-lg shadow-accent/25 ring-1 ring-accent"
                      : "text-white/80 border border-white/20 bg-white/5 hover:border-accent/50 hover:bg-accent/10 hover:text-accent hover:shadow-lg hover:shadow-accent/15"
                  }`}
                  style={{
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  {ratio}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full brand-gradient text-background font-[Orbitron] text-lg py-6 shadow-lg shadow-accent/25"
              >
                {generating ? (
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
              {validationError && (
                <div className="mt-2 text-center">
                  <span className="text-sm text-red-500 font-[Orbitron]" style={{ textShadow: '0 0 4px rgba(255,0,0,0.6)' }}>
                    {validationError}
                  </span>
                </div>
              )}

              {generatedImage && (
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-r from-accent/20 to-teal-400/20 rounded-lg blur-xl"></div>
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-accent/50 bg-card/80 backdrop-blur-sm">
                      <img
                        data-testid="generated-image"
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
                      disabled={generating}
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
