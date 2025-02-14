import { useEffect, useState } from "react";
import { getToken } from "../../../utils/auth.ts";
import { ChevronLeft, ChevronRight } from "npm:lucide-react";
import { AllOtherImageResponse, ErrorResponse } from "../../../types/api.ts";

import "./AllOtherImage.css";

interface AllOtherImageProps {
  username: string;
}

const AllOtherImage = ({ username }: AllOtherImageProps) => {
  const [allImage, setAllImage] = useState<string[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImage = async () => {
      const token = getToken();
      try {
        const response = await fetch(
          `/api/other-users/get/all-image/${username}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          },
        );
        if (!response.ok) {
          const errorData: ErrorResponse = await response.json();
          throw new Error(
            errorData.error || "プロフィールの取得に失敗しました",
          );
        }
        const data: AllOtherImageResponse = await response.json();

        setAllImage(data.all_image);
      } catch (error) {
        console.error("Error Other Image:", error);
      }
    };
    fetchImage();
  }, []);
  const nextSlide = () => {
    if (allImage) {
      setCurrentIndex((prevIndex) =>
        prevIndex === allImage.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevSlide = () => {
    if (allImage) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? allImage.length - 1 : prevIndex - 1
      );
    }
  };
  if (!allImage || allImage.length === 0) {
    return <div className="no-images">画像が見つかりません</div>;
  }

  return (
    <div className="slider-container">
      <div className="slider-content">
        <img
          src={allImage[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="slide-image"
        />

        <button
          onClick={prevSlide}
          className="nav-button nav-button-prev"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="nav-button nav-button-next"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        <div className="dots-container" role="tablist">
          {allImage.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`dot ${
                index === currentIndex ? "dot-active" : "dot-inactive"
              }`}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllOtherImage;
