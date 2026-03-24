import type { CoreSupplement } from '@/infrastructure/db/models/core-supplement.types';

type SeedSupplement = Omit<CoreSupplement, '_id' | 'createdAt' | 'updatedAt' | 'variants'> & {
  variants: Array<Omit<CoreSupplement['variants'][number], '_id'>>;
};

export const supplementAtlasSupplements: SeedSupplement[] = [
  {
    name: 'Creatine',
    slug: 'creatine',
    aliases: ['Creatine base'],
    category: 'performance',
    evidenceLevel: 'strong',
    description:
      'One of the best-supported sports supplements for increasing high-intensity training capacity and supporting strength-focused adaptation.',
    goals: ['strength', 'power', 'body_composition', 'recovery'],
    benefits: [
      'Supports repeated high-intensity efforts and strength progression.',
      'Can improve lean-mass gains when paired with resistance training.',
    ],
    cautions: [
      'Transient water-weight changes are common and usually reflect intracellular water storage.',
      'Consistency matters more than precise workout timing.',
    ],
    tags: ['foundational', 'gym', 'strength'],
    variants: [
      {
        name: 'Creatine Monohydrate',
        slug: 'creatine-monohydrate',
        form: 'powder',
        compoundType: 'monohydrate',
        typicalDose: '3-5 g daily',
        timing: ['daily', 'flexible'],
        notes: ['Best-supported form for most athletes.', 'Loading is optional.'],
        isDefault: true,
      },
      {
        name: 'Creatine Malate',
        slug: 'creatine-malate',
        form: 'powder',
        compoundType: 'malate',
        typicalDose: '5-8 g daily depending on product ratio',
        timing: ['daily', 'flexible'],
        notes: ['Often marketed for solubility and taste.', 'Evidence base is smaller than monohydrate.'],
      },
      {
        name: 'Creatine HCl',
        slug: 'creatine-hcl',
        form: 'capsule',
        compoundType: 'hcl',
        typicalDose: '1.5-3 g daily depending on product',
        timing: ['daily', 'flexible'],
        notes: ['Practical when someone prefers smaller servings.', 'Evidence base is smaller than monohydrate.'],
      },
    ],
    isActive: true,
  },
  {
    name: 'Caffeine',
    slug: 'caffeine',
    category: 'performance',
    evidenceLevel: 'strong',
    description:
      'A widely used ergogenic aid that can increase alertness, perceived readiness, and performance output when dosing is individualized.',
    goals: ['power', 'endurance', 'cognition'],
    benefits: [
      'Can improve vigilance, focus, and acute training performance.',
      'Useful for early sessions or competition settings when tolerated well.',
    ],
    cautions: [
      'Tolerance, anxiety, sleep disruption, and GI issues vary widely between users.',
      'Late-day use can meaningfully worsen sleep quality and recovery.',
    ],
    tags: ['pre-workout', 'stimulant'],
    variants: [
      {
        name: 'Anhydrous Caffeine',
        slug: 'caffeine-anhydrous',
        form: 'capsule',
        compoundType: 'other',
        typicalDose: '1.5-6 mg/kg 30-60 min before training',
        timing: ['pre_workout'],
        notes: ['Dose should be individualized based on tolerance.'],
        isDefault: true,
      },
      {
        name: 'Liquid Caffeine',
        slug: 'liquid-caffeine',
        form: 'liquid',
        compoundType: 'other',
        typicalDose: 'Label-based dose 15-45 min before training',
        timing: ['pre_workout'],
        notes: ['Fast and practical, but easy to overconsume if not measured carefully.'],
      },
    ],
    isActive: true,
  },
  {
    name: 'Protein Powder',
    slug: 'protein-powder',
    aliases: ['Whey protein'],
    category: 'recovery',
    evidenceLevel: 'strong',
    description:
      'A convenient way to help meet daily protein targets and support muscle recovery when whole-food intake is insufficient or impractical.',
    goals: ['recovery', 'body_composition', 'strength'],
    benefits: [
      'Convenient support for total daily protein intake.',
      'Useful after training or around busy schedules.',
    ],
    cautions: [
      'A supplement for convenience, not a replacement for a generally solid diet.',
      'Product quality, digestibility, and sweeteners vary a lot between brands.',
    ],
    tags: ['recovery', 'convenience'],
    variants: [
      {
        name: 'Whey Isolate',
        slug: 'whey-isolate',
        form: 'powder',
        compoundType: 'isolate',
        typicalDose: '20-35 g per serving',
        timing: ['post_workout', 'daily', 'flexible'],
        notes: ['Typically lower in lactose and very easy to use around training.'],
        isDefault: true,
      },
      {
        name: 'Whey Concentrate',
        slug: 'whey-concentrate',
        form: 'powder',
        compoundType: 'concentrate',
        typicalDose: '20-35 g per serving',
        timing: ['post_workout', 'daily', 'flexible'],
        notes: ['Usually cheaper and often fine when digestibility is good.'],
      },
    ],
    isActive: true,
  },
  {
    name: 'Citrulline',
    slug: 'citrulline',
    category: 'performance',
    evidenceLevel: 'moderate',
    description:
      'Commonly used to support training volume and subjective pump, especially in higher-rep or mixed-modality sessions.',
    goals: ['endurance', 'power'],
    benefits: [
      'May support session quality in high-volume training.',
      'Often included in pre-workout stacks for subjective performance support.',
    ],
    cautions: [
      'Product labels vary a lot, especially when malate ratios are unclear.',
    ],
    tags: ['pre-workout', 'pump'],
    variants: [
      {
        name: 'L-Citrulline',
        slug: 'l-citrulline',
        form: 'powder',
        compoundType: 'other',
        typicalDose: '6-8 g 30-60 min before training',
        timing: ['pre_workout'],
        notes: ['Straight citrulline is easier to dose precisely.'],
        isDefault: true,
      },
      {
        name: 'Citrulline Malate',
        slug: 'citrulline-malate',
        form: 'powder',
        compoundType: 'malate',
        typicalDose: '6-10 g 30-60 min before training depending on ratio',
        timing: ['pre_workout'],
        notes: ['Check actual citrulline content because product ratios differ.'],
      },
    ],
    isActive: true,
  },
  {
    name: 'Beta-Alanine',
    slug: 'beta-alanine',
    category: 'performance',
    evidenceLevel: 'moderate',
    description:
      'A saturation-based supplement more relevant for repeated high-intensity efforts than for single maximal lifts.',
    goals: ['endurance', 'power'],
    benefits: [
      'Most relevant for efforts with a meaningful glycolytic component.',
    ],
    cautions: [
      'Tingling is a common benign side effect and can be reduced by splitting doses.',
      'Works through saturation, so daily consistency matters more than workout timing.',
    ],
    tags: ['performance', 'saturation'],
    variants: [
      {
        name: 'Beta-Alanine Powder',
        slug: 'beta-alanine-powder',
        form: 'powder',
        compoundType: 'other',
        typicalDose: '3.2-6.4 g daily split into smaller servings',
        timing: ['daily', 'flexible'],
        notes: ['Split doses often improve tolerability.'],
        isDefault: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Omega-3',
    slug: 'omega-3',
    category: 'health',
    evidenceLevel: 'moderate',
    description:
      'Often used for general health support and to fill dietary gaps when oily-fish intake is low.',
    goals: ['general_health', 'recovery'],
    benefits: [
      'Can help cover low intake of EPA and DHA from food.',
    ],
    cautions: [
      'Useful to think in EPA+DHA content rather than capsule count alone.',
    ],
    tags: ['general health'],
    variants: [
      {
        name: 'Fish Oil Softgel',
        slug: 'fish-oil-softgel',
        form: 'softgel',
        compoundType: 'other',
        typicalDose: 'Product-specific serving to reach target EPA+DHA intake',
        timing: ['with_meal', 'daily'],
        notes: ['Check the label for actual EPA+DHA, not just total oil.'],
        isDefault: true,
      },
    ],
    isActive: true,
  },
  {
    name: 'Electrolytes',
    slug: 'electrolytes',
    category: 'hydration',
    evidenceLevel: 'moderate',
    description:
      'A practical category for longer sessions, hot environments, and athletes who lose substantial fluid and sodium through sweat.',
    goals: ['hydration', 'endurance'],
    benefits: [
      'Can make hydration strategies more practical during long or sweaty sessions.',
    ],
    cautions: [
      'Needs vary substantially with climate, duration, and individual sweat loss.',
    ],
    tags: ['hydration', 'endurance'],
    variants: [
      {
        name: 'Electrolyte Powder',
        slug: 'electrolyte-powder',
        form: 'powder',
        compoundType: 'other',
        typicalDose: 'Use product-specific serving based on sweat loss and session duration',
        timing: ['intra_workout', 'daily'],
        notes: ['Useful to evaluate sodium content, not just branding.'],
        isDefault: true,
      },
      {
        name: 'Electrolyte Tablets',
        slug: 'electrolyte-tablets',
        form: 'tablet',
        compoundType: 'other',
        typicalDose: 'Use product-specific serving based on sweat loss and session duration',
        timing: ['intra_workout'],
        notes: ['Convenient for travel and endurance sessions.'],
      },
    ],
    isActive: true,
  },
  {
    name: 'Magnesium',
    slug: 'magnesium',
    category: 'health',
    evidenceLevel: 'moderate',
    description:
      'More relevant as a general health and dietary-gap supplement than as a direct acute ergogenic aid.',
    goals: ['sleep', 'general_health', 'recovery'],
    benefits: [
      'Can be useful when intake is low or when nighttime routines benefit from a consistent supplement habit.',
    ],
    cautions: [
      'Different forms vary in elemental magnesium content and GI tolerance.',
    ],
    tags: ['sleep', 'health'],
    variants: [
      {
        name: 'Magnesium Glycinate',
        slug: 'magnesium-glycinate',
        form: 'capsule',
        compoundType: 'glycinate',
        typicalDose: 'Product-specific dose, often taken in the evening',
        timing: ['evening', 'daily'],
        notes: ['Often chosen for tolerance and simple evening use.'],
        isDefault: true,
      },
      {
        name: 'Magnesium Citrate',
        slug: 'magnesium-citrate',
        form: 'capsule',
        compoundType: 'citrate',
        typicalDose: 'Product-specific dose',
        timing: ['daily', 'with_meal'],
        notes: ['Useful to dose carefully if GI tolerance is inconsistent.'],
      },
    ],
    isActive: true,
  },
];
