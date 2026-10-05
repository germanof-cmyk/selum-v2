"use client";

import { useState } from "react";
import type { ProductPageCopy, ProductPageData, ProductPageLocale } from "@/lib/product-page-data";
import ProductHero from "./ProductHero";
import ProductInformation from "./ProductInformation";

export default function ProductInteractiveSections({
  data,
  copy,
  locale,
}: {
  data: ProductPageData;
  copy: ProductPageCopy;
  locale: ProductPageLocale;
}) {
  const galleryImages = data.gallery;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <>
      <ProductHero
        data={data}
        copy={copy}
        locale={locale}
        images={galleryImages}
        selectedImageIndex={selectedImageIndex}
        onSelectImage={setSelectedImageIndex}
      />
      <ProductInformation data={data} copy={copy} locale={locale} />
    </>
  );
}
