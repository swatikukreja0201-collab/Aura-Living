import { ProductMetadata } from '../types';

export const FREE_SHIPPING_THRESHOLD = 600;
export const STANDARD_SHIPPING_FEE = 35;

export const PRODUCT_METADATA: ProductMetadata[] = [
  {
    id: 'solis-ribbed-vessel',
    sku: 'CER-014',
    title: 'Solis Ribbed Vessel',
    category: 'Ceramics',
    price: 240,
    availability: 'In Stock',
    imageAlt: 'Hand-thrown matte alabaster stoneware vessel with subtle horizontal ribbing on raw limestone',
    shortNote: 'Wheel-thrown Danish stoneware, unglazed exterior',
    description:
      'Turned slowly on a manual wheel in Bornholm, the Solis Vessel leaves its iron-flecked chamotte clay unglazed on the exterior to preserve a tactile mineral tooth, while a clear interior glaze holds fresh branches and water.',
    dimensions: 'H 32 cm × Ø 19 cm',
    materials: 'High-fired Bornholm stoneware, clear mineral interior glaze',
    origin: 'Bornholm, Denmark',
    care: 'Rinse with lukewarm water; wipe exterior gently with a dry linen cloth.',
    finishes: [
      { name: 'Raw Alabaster', swatch: '#EAE3D5' },
      { name: 'Limestone Clay', swatch: '#D6CEBE' },
      { name: 'Warm Charcoal', swatch: '#2D2C29' },
    ],
  },
  {
    id: 'kuro-centerpiece-bowl',
    sku: 'CER-029',
    title: 'Kuro Centerpiece Bowl',
    category: 'Ceramics',
    price: 195,
    availability: 'In Stock',
    imageAlt: 'Low-profile matte charcoal glazed stoneware bowl resting on a travertine plinth',
    shortNote: 'Matte manganese glaze, wide architectural profile',
    description:
      'Fired in a reduction kiln for deep mineral density, the Kuro Bowl pairs an organic hand-trimmed rim with a broad, grounded silhouette designed to anchor dining tables or travertine consoles.',
    dimensions: 'H 9 cm × Ø 31 cm',
    materials: 'Reduction-fired black stoneware, satin manganese glaze',
    origin: 'Shigaraki, Japan',
    care: 'Hand wash only with mild soap; avoid thermal shock.',
    finishes: [
      { name: 'Deep Charcoal', swatch: '#252422' },
      { name: 'Smoked Umber', swatch: '#4B443E' },
    ],
  },
  {
    id: 'terra-carafe-set',
    sku: 'CER-037',
    title: 'Terra Carafe & Tumbler',
    category: 'Ceramics',
    price: 165,
    availability: 'Limited Run',
    imageAlt: 'Faded terracotta unglazed stoneware pitcher and matching cup on unbleached linen and travertine',
    shortNote: 'Porous terracotta slip, hand-pulled handle',
    description:
      'Crafted from iron-rich red clay washed in raw ochre slip, the Terra Carafe naturally cools water at the table while developing a quiet patina over years of daily ritual.',
    dimensions: 'Carafe 1.1 L · Tumbler 220 ml',
    materials: 'Natural red terracotta clay, interior lead-free seal',
    origin: 'Alentejo, Portugal',
    care: 'Hand wash and air dry completely before storing.',
    finishes: [
      { name: 'Faded Terracotta', swatch: '#C47B5E' },
      { name: 'Burnt Ochre', swatch: '#9E5B40' },
    ],
  },
  {
    id: 'alba-dome-pendant',
    sku: 'LGT-108',
    title: 'Alba Alabaster Pendant',
    category: 'Lighting',
    price: 680,
    availability: 'In Stock',
    imageAlt: 'Translucent carved Spanish alabaster dome pendant lamp with blackened brass drop stem',
    shortNote: 'Carved Spanish alabaster, blackened brass stem',
    description:
      'Turned from a single block of translucent Aragon alabaster, each shade reveals singular mineral veining when illuminated. Suspended from a hand-patinated blackened brass rod for warm, glare-free dining illumination.',
    dimensions: 'Ø 34 cm × Drop 65–120 cm',
    materials: 'Honed Spanish alabaster, solid blackened brass hardware',
    origin: 'Zaragoza & Copenhagen',
    care: 'Dust with a dry microfiber cloth; avoid moisture on stone.',
    finishes: [
      { name: 'Veined Alabaster / Blackened Brass', swatch: '#E7DDD0' },
      { name: 'Veined Alabaster / Aged Bronze', swatch: '#8E735B' },
    ],
  },
  {
    id: 'monolith-table-lamp',
    sku: 'LGT-115',
    title: 'Monolith Linen Lamp',
    category: 'Lighting',
    price: 490,
    availability: 'In Stock',
    imageAlt: 'Cylindrical brushed gunmetal table lamp with natural Belgian linen shade on travertine block',
    shortNote: 'Spun gunmetal cylinder, raw Belgian linen shade',
    description:
      'Balancing architectural rigor with soft diffused warmth, the Monolith Lamp pairs a weighted brushed-steel base and woven cloth cord with an unbleached Belgian linen drum diffuser.',
    dimensions: 'H 48 cm × Ø 26 cm',
    materials: 'Brushed gunmetal steel, unbleached Belgian linen, braided cord',
    origin: 'Aarhus, Denmark',
    care: 'Use E27 2700K warm LED bulb (included); brush linen shade softly.',
    finishes: [
      { name: 'Gunmetal / Natural Linen', swatch: '#353431' },
      { name: 'Burnished Brass / Natural Linen', swatch: '#B39368' },
    ],
  },
  {
    id: 'fleece-boucle-throw',
    sku: 'TXT-204',
    title: 'Vela Alpaca Bouclé Throw',
    category: 'Textiles',
    price: 310,
    availability: 'In Stock',
    imageAlt: 'Heavyweight unbleached ecru alpaca boucle throw blanket with hand-knotted fringe on travertine bench',
    shortNote: 'Unbleached Peruvian alpaca & Belgian linen',
    description:
      'Loomed from undyed fleece in dense, lofty loops, the Vela Throw delivers sculptural drape and breathable warmth without synthetic finishes or chemical bleaches.',
    dimensions: '145 cm × 210 cm',
    materials: '70% Undyed Baby Alpaca, 30% Belgian Flax Linen',
    origin: 'Antwerp, Belgium',
    care: 'Air outdoors periodically; dry clean gently when required.',
    finishes: [
      { name: 'Unbleached Ecru', swatch: '#EDE6D8' },
      { name: 'Raw Oat', swatch: '#D6CCB9' },
    ],
  },
  {
    id: 'tactile-linen-cushions',
    sku: 'TXT-219',
    title: 'Klint Woven Cushion Pair',
    category: 'Textiles',
    price: 220,
    availability: 'In Stock',
    imageAlt: 'Pair of textured raw oat and warm stone woven linen cushions with fringed edges on white oak bench',
    shortNote: 'Slub-woven flax pair, feather-down inserts',
    description:
      'Sold as a tonal pair in Raw Oat and Mineral Taupe, these heavy slub-linen cushions feature hand-frayed flanged seams and concealed brass zippers over ethically sourced down inserts.',
    dimensions: '55 cm × 55 cm (Set of 2)',
    materials: '100% Heavyweight Lithuanian Linen, European down insert',
    origin: 'Vilnius, Lithuania',
    care: 'Remove cover and machine wash cold on gentle cycle; line dry.',
    finishes: [
      { name: 'Oat & Mineral Taupe', swatch: '#B8AFA1' },
      { name: 'Ecru & Warm Limestone', swatch: '#DCD4C6' },
    ],
  },
  {
    id: 'nord-oak-lounge-chair',
    sku: 'FRN-302',
    title: 'Nord Low Lounge Chair',
    category: 'Furniture',
    price: 1850,
    availability: 'Limited Run',
    imageAlt: 'Sculptural solid white oak Scandinavian lounge chair with unbleached linen cushions',
    shortNote: 'FSC white oak joinery, tailored linen cushions',
    description:
      'Constructed with exposed mortise-and-tenon joinery and sculpted armrests shaped for quiet resting posture. Deep cushions upholstered in Belgian flax soften the crisp timber frame.',
    dimensions: 'W 74 cm × D 81 cm × H 76 cm',
    materials: 'Soap-treated European white oak, Belgian linen upholstery',
    origin: 'Gothenburg, Sweden',
    care: 'Refresh wood annually with natural white wood soap; spot clean linen.',
    finishes: [
      { name: 'Soap White Oak / Ecru Linen', swatch: '#D8C7AE' },
      { name: 'Smoked Oak / Charcoal Wool', swatch: '#5E5144' },
    ],
  },
  {
    id: 'roma-travertine-plinth',
    sku: 'FRN-318',
    title: 'Roma Chamfered Plinth',
    category: 'Furniture',
    price: 1420,
    availability: 'In Stock',
    imageAlt: 'Monolithic honed Roman travertine low coffee table with chamfered top edge',
    shortNote: 'Open-pore Roman travertine, 45° chamfered edge',
    description:
      'Quarried outside Tivoli and honed to a velvety matte sheen, the Roma Plinth celebrates raw sedimentary cavities beneath a cantilevered chamfered top that catches shifting daylight.',
    dimensions: 'W 120 cm × D 75 cm × H 32 cm',
    materials: 'Solid open-pore Roman travertine, breathable matte sealer',
    origin: 'Tivoli, Italy',
    care: 'Wipe spills promptly with damp cloth; use coasters for acidic liquids.',
    finishes: [
      { name: 'Honed Ivory Travertine', swatch: '#E2D8C8' },
      { name: 'Silver Vein Travertine', swatch: '#B6AEA2' },
    ],
  },
];

export const ATELIER_CHAPTERS = [
  {
    index: '01',
    title: 'Raw Mineral Clay & Kiln Patience',
    summary:
      'Every vessel begins with unrefined Bornholm and Shigaraki clays rich in iron and silica. Rather than masking imperfections under glossy lacquer, our potters fire to vitrification and leave outer walls tactile to the hand.',
  },
  {
    index: '02',
    title: 'Unbleached Belgian & Baltic Flax',
    summary:
      'We reject optical brighteners and synthetic softeners. Our textiles retain the warm ecru hue of dew-retted flax stalks and undyed alpaca fleece, softening naturally with decades of domestic light and laundering.',
  },
  {
    index: '03',
    title: 'Architectural Timber & Honed Stone',
    summary:
      'Solid European white oak is finished solely with botanical wood soap, while open-pore Roman travertine and Spanish alabaster are honed matte so daylight grazes across grain and stone cavities without glare.',
  },
];
