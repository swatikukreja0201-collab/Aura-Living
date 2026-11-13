import heroLivingImg from '../assets/images/hero_living_sanctuary_1794549939136.jpg';
import atelierCraftImg from '../assets/images/atelier_mineral_craft_1794549939740.jpg';
import ceramicVesselImg from '../assets/images/ceramic_travertine_vessel_1794549939182.jpg';
import ceramicBowlImg from '../assets/images/ceramic_charcoal_bowl_1794549939702.jpg';
import ceramicCarafeImg from '../assets/images/ceramic_terracotta_carafe_1794549940728.jpg';
import lightingPendantImg from '../assets/images/lighting_alabaster_pendant_1794549941053.jpg';
import lightingTableLampImg from '../assets/images/lighting_brass_table_lamp_1794549941139.jpg';
import textileThrowImg from '../assets/images/textile_boucle_throw_1794549941088.jpg';
import textileCushionImg from '../assets/images/textile_oatmeal_cushion_1794549941757.jpg';
import furnitureChairImg from '../assets/images/furniture_oak_lounge_chair_1794549942421.jpg';
import furniturePlinthImg from '../assets/images/furniture_travertine_plinth_1794549942960.jpg';

import { ProductItem } from '../types';
import {
  ATELIER_CHAPTERS,
  FREE_SHIPPING_THRESHOLD,
  PRODUCT_METADATA,
  STANDARD_SHIPPING_FEE,
} from './catalogMeta';

export { ATELIER_CHAPTERS, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE };

export const EDITORIAL_MEDIA = {
  hero: {
    src: heroLivingImg,
    alt: 'Minimalist Scandinavian living sanctuary with white oak lounge seating, travertine plinth, and morning daylight across ecru plaster',
  },
  atelier: {
    src: atelierCraftImg,
    alt: 'Scandinavian ceramic and textile atelier workbench with raw stoneware vessels, mineral clay pigments, and unbleached linen',
  },
};

const IMAGE_BY_PRODUCT_ID: Record<string, string> = {
  'solis-ribbed-vessel': ceramicVesselImg,
  'kuro-centerpiece-bowl': ceramicBowlImg,
  'terra-carafe-set': ceramicCarafeImg,
  'alba-dome-pendant': lightingPendantImg,
  'monolith-table-lamp': lightingTableLampImg,
  'fleece-boucle-throw': textileThrowImg,
  'tactile-linen-cushions': textileCushionImg,
  'nord-oak-lounge-chair': furnitureChairImg,
  'roma-travertine-plinth': furniturePlinthImg,
};

export const PRODUCTS: ProductItem[] = PRODUCT_METADATA.map((meta) => ({
  ...meta,
  image: IMAGE_BY_PRODUCT_ID[meta.id] ?? heroLivingImg,
}));
