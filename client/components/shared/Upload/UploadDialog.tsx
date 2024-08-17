"use client";

import { useState, useEffect } from "react";
import { X, Send, Crop, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadDialogProps {
  images: File[];
  onUpdate: (images: File[]) => void;
  onSubmit: (images: File[]) => void;
}

export default function UploadDialog({
  images,
  onUpdate,
  onSubmit,
}: UploadDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [localImages, setLocalImages] = useState<File[]>(images);

  useEffect(() => {
    setLocalImages(images);
  }, [images]);

  const handleRemoveImage = (index: number) => {
    const newImages = localImages.filter((_, i) => i !== index);
    setLocalImages(newImages);
    setCurrentImageIndex(Math.min(currentImageIndex, newImages.length - 1));
    onUpdate(newImages);
  };

  const handleSubmit = () => {
    onSubmit(localImages);
  };
  if (localImages.length === 0) {
    return <div>No images selected</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className="relative w-full"
        style={{ height: "calc(100vh - 200px)" }}
      >
        <div className="absolute top-2 right-2 z-10 flex space-x-2">
          <Button
            onClick={() => handleRemoveImage(currentImageIndex)}
            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
          >
            <X size={20} />
          </Button>
        </div>
        <div className="absolute top-2 left-2 z-10 flex space-x-2">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2">
            <Crop size={20} />
          </Button>
          <Button className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2">
            <Edit size={20} />
          </Button>
          <Button className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2">
            <Trash size={20} />
          </Button>
        </div>
        <img
          src={URL.createObjectURL(localImages[currentImageIndex])}
          alt={`Selected image ${currentImageIndex + 1}`}
          className="w-full h-full object-contain"
        />
      </div>
      {localImages.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2 overflow-x-auto">
          {localImages.map((image, index) => (
            <img
              key={index}
              src={URL.createObjectURL(image)}
              alt={`Thumbnail ${index + 1}`}
              className={`w-16 h-16 object-cover cursor-pointer ${
                index === currentImageIndex ? "border-2 border-blue-500" : ""
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      )}
      <Button
        onClick={handleSubmit}
        className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center"
      >
        <Send className="mr-2" size={20} />
        Send Images
      </Button>
    </div>
  );
}
