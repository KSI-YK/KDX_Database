// 例: app/page/images.tsx
"use client"

import { useEffect, useState } from 'react';

const ImagesPage = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const response = await fetch('/api/images');
      const data = await response.json();
      setImages(data);
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h1>画像一覧</h1>
      <ul>
        {images.map((image, index) => (
          <li key={index}>
            <img src={`/images/user/${image}`} alt={image} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImagesPage;
