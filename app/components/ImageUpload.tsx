import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Upload, Trash2 } from "lucide-react"

interface ImageUploadProps {
  currentImageUrl: string
  onImageUpload: (imageUrl: string) => void
  onImageDelete: () => void
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImageUrl, onImageUpload, onImageDelete }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = () => {
    if (previewUrl) {
      onImageUpload(previewUrl)
      setPreviewUrl(null)
    }
  }

  const handleDelete = () => {
    onImageDelete()
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {(currentImageUrl || previewUrl) && (
        <img src={previewUrl || currentImageUrl} alt="תמונת צוער" className="w-48 h-48 object-cover rounded-full" />
      )}
      <div className="flex space-x-2">
        <Button onClick={() => fileInputRef.current?.click()} variant="outline">
          <Camera className="mr-2 h-4 w-4" /> העלה תמונה
        </Button>
        {previewUrl && (
          <Button onClick={handleUpload} variant="default">
            <Upload className="mr-2 h-4 w-4" /> שמור תמונה
          </Button>
        )}
        {(currentImageUrl || previewUrl) && (
          <Button onClick={handleDelete} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" /> מחק תמונה
          </Button>
        )}
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  )
}

export default ImageUpload

