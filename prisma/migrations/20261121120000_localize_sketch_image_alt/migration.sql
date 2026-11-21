BEGIN;

ALTER TABLE "Image"
  ADD COLUMN "altRo" TEXT,
  ADD COLUMN "altUk" TEXT,
  ADD COLUMN "altIt" TEXT,
  ADD COLUMN "altEn" TEXT;

-- Match the original Russian descriptions and fill only missing translations.
UPDATE "Image" AS image
SET
  "altRo" = COALESCE(image."altRo", translation.ro),
  "altUk" = COALESCE(image."altUk", translation.uk),
  "altIt" = COALESCE(image."altIt", translation.it),
  "altEn" = COALESCE(image."altEn", translation.en)
FROM (VALUES
  (
    'тату катана и цветы на предплечье',
    'Tatuaj cu o katana și flori pe antebraț',
    'Татуювання з катаною та квітами на передпліччі',
    'Tatuaggio con una katana e fiori sull’avambraccio',
    'Katana and flower tattoo on the forearm'
  ),
  (
    'тату роза пустыни на предплечье',
    'Tatuaj cu trandafirul deșertului pe antebraț',
    'Татуювання з трояндою пустелі на передпліччі',
    'Tatuaggio con una rosa del deserto sull’avambraccio',
    'Desert rose tattoo on the forearm'
  ),
  (
    'тату память о детях на груди',
    'Tatuaj pe piept în amintirea copiilor',
    'Татуювання на грудях на згадку про дітей',
    'Tatuaggio sul petto in ricordo dei figli',
    'Chest tattoo in memory of the children'
  ),
  (
    'тату цветка лилии на плече',
    'Tatuaj cu o floare de crin pe umăr',
    'Татуювання з квіткою лілії на плечі',
    'Tatuaggio con un giglio sulla spalla',
    'Lily tattoo on the shoulder'
  ),
  (
    'тату рукав графика',
    'Tatuaj tip mânecă în stil grafic',
    'Татуювання-рукав у графічному стилі',
    'Tatuaggio a manica in stile grafico',
    'Graphic-style sleeve tattoo'
  ),
  (
    'тату на предплечье рукав графика',
    'Tatuaj tip mânecă pe antebraț, în stil grafic',
    'Татуювання-рукав на передпліччі в графічному стилі',
    'Tatuaggio a manica sull’avambraccio in stile grafico',
    'Graphic-style forearm sleeve tattoo'
  )
) AS translation(ru, ro, uk, it, en)
WHERE image.type = 'SKETCH'
  AND image.alt = translation.ru
  AND (image."altRo" IS NULL OR image."altUk" IS NULL OR image."altIt" IS NULL OR image."altEn" IS NULL);

COMMIT;
