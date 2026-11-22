BEGIN;
SET LOCAL lock_timeout = '5s';

-- All legacy posts were public. New posts start as drafts.
ALTER TABLE "BlogPost"
  ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "excerpt" TEXT,
  ADD COLUMN "seoTitle" TEXT,
  ADD COLUMN "seoDescription" TEXT,
  ADD COLUMN "titleRo" TEXT,
  ADD COLUMN "excerptRo" TEXT,
  ADD COLUMN "contentRo" TEXT,
  ADD COLUMN "seoTitleRo" TEXT,
  ADD COLUMN "seoDescriptionRo" TEXT,
  ADD CONSTRAINT "BlogPost_complete_ro" CHECK (
    num_nonnulls("titleRo", "excerptRo", "contentRo", "seoTitleRo", "seoDescriptionRo") IN (0, 5)
    AND '' <> ALL (ARRAY[btrim("titleRo"), btrim("excerptRo"), btrim("contentRo"), btrim("seoTitleRo"), btrim("seoDescriptionRo")])
  ),
  ADD COLUMN "titleUk" TEXT,
  ADD COLUMN "excerptUk" TEXT,
  ADD COLUMN "contentUk" TEXT,
  ADD COLUMN "seoTitleUk" TEXT,
  ADD COLUMN "seoDescriptionUk" TEXT,
  ADD CONSTRAINT "BlogPost_complete_uk" CHECK (
    num_nonnulls("titleUk", "excerptUk", "contentUk", "seoTitleUk", "seoDescriptionUk") IN (0, 5)
    AND '' <> ALL (ARRAY[btrim("titleUk"), btrim("excerptUk"), btrim("contentUk"), btrim("seoTitleUk"), btrim("seoDescriptionUk")])
  ),
  ADD COLUMN "titleIt" TEXT,
  ADD COLUMN "excerptIt" TEXT,
  ADD COLUMN "contentIt" TEXT,
  ADD COLUMN "seoTitleIt" TEXT,
  ADD COLUMN "seoDescriptionIt" TEXT,
  ADD CONSTRAINT "BlogPost_complete_it" CHECK (
    num_nonnulls("titleIt", "excerptIt", "contentIt", "seoTitleIt", "seoDescriptionIt") IN (0, 5)
    AND '' <> ALL (ARRAY[btrim("titleIt"), btrim("excerptIt"), btrim("contentIt"), btrim("seoTitleIt"), btrim("seoDescriptionIt")])
  ),
  ADD COLUMN "titleEn" TEXT,
  ADD COLUMN "excerptEn" TEXT,
  ADD COLUMN "contentEn" TEXT,
  ADD COLUMN "seoTitleEn" TEXT,
  ADD COLUMN "seoDescriptionEn" TEXT,
  ADD CONSTRAINT "BlogPost_complete_en" CHECK (
    num_nonnulls("titleEn", "excerptEn", "contentEn", "seoTitleEn", "seoDescriptionEn") IN (0, 5)
    AND '' <> ALL (ARRAY[btrim("titleEn"), btrim("excerptEn"), btrim("contentEn"), btrim("seoTitleEn"), btrim("seoDescriptionEn")])
  );

ALTER TABLE "BlogPost" ALTER COLUMN "isPublished" SET DEFAULT false;
COMMIT;
