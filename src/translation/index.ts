import fs from "fs";
import path from "path";
import i18next, { i18n } from "i18next";

const loadResources = () => {
  const enRaw = fs.readFileSync(
    path.join(process.cwd(), `src/translation/locales/en/translation.json`)
  );
  const esRaw = fs.readFileSync(
    path.join(process.cwd(), `src/translation/locales/es/translation.json`)
  );

  const en = JSON.parse(enRaw.toString());
  const es = JSON.parse(esRaw.toString());

  return { en: { translation: en }, es: { translation: es } };
};

i18next.init({ resources: loadResources(), fallbackLng: "es" });
