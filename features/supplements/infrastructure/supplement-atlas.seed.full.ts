import type { CoreSupplement } from '@/infrastructure/db/models/core-supplement.types';

type SeedSupplement = Omit<
  CoreSupplement,
  '_id' | 'createdAt' | 'updatedAt' | 'variants' | 'isActive'
> & {
  variants: Array<Omit<CoreSupplement['variants'][number], '_id'>>;
  isActive?: boolean;
};

export const supplementAtlasSupplements: SeedSupplement[] = [
{
    name: 'Creatine',
    slug: 'creatine',
    aliases: ['Creatine base'],
    category: 'performance',
    evidenceLevel: 'strong',
    description: 'One of the best-supported sports supplements for increasing high-intensity training capacity and supporting strength-focused adaptation.',
    goals: ['strength', 'power', 'body_composition', 'recovery'],
    benefits: ['Supports repeated high-intensity efforts and strength progression.', 'Can improve lean-mass gains when paired with resistance training.'],
    cautions: ['Transient water-weight changes are common and usually reflect intracellular water storage.', 'Consistency matters more than precise workout timing.'],
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
        isDefault: true
      },
      {
        name: 'Creatine Malate',
        slug: 'creatine-malate',
        form: 'powder',
        compoundType: 'malate',
        typicalDose: '5-8 g daily depending on product ratio',
        timing: ['daily', 'flexible'],
        notes: ['Often marketed for solubility and taste.', 'Evidence base is smaller than monohydrate.']
      },
      {
        name: 'Creatine HCl',
        slug: 'creatine-hcl',
        form: 'capsule',
        compoundType: 'hcl',
        typicalDose: '1.5-3 g daily depending on product',
        timing: ['daily', 'flexible'],
        notes: ['Practical when someone prefers smaller servings.', 'Evidence base is smaller than monohydrate.']
      }
    ]
  },
{
    name: 'Caffeine',
    slug: 'caffeine',
    category: 'performance',
    evidenceLevel: 'strong',
    description: 'A widely used ergogenic aid that can increase alertness, perceived readiness, and performance output when dosing is individualized.',
    goals: ['power', 'endurance', 'cognition'],
    benefits: ['Can improve vigilance, focus, and acute training performance.', 'Useful for early sessions or competition settings when tolerated well.'],
    cautions: ['Tolerance, anxiety, sleep disruption, and GI issues vary widely between users.', 'Late-day use can meaningfully worsen sleep quality and recovery.'],
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
        isDefault: true
      },
      {
        name: 'Liquid Caffeine',
        slug: 'liquid-caffeine',
        form: 'liquid',
        compoundType: 'other',
        typicalDose: 'Label-based dose 15-45 min before training',
        timing: ['pre_workout'],
        notes: ['Fast and practical, but easy to overconsume if not measured carefully.']
      },
      {
        name: 'Caffeinated Gum',
        slug: 'caffeinated-gum',
        form: 'other',
        compoundType: 'other',
        typicalDose: 'Product-specific serving shortly before training or competition',
        timing: ['pre_workout'],
        notes: ['Useful when a fast practical format is preferred.']
      }
    ]
  },
{
    name: 'Protein Powder',
    slug: 'protein-powder',
    aliases: ['Whey protein'],
    category: 'recovery',
    evidenceLevel: 'strong',
    description: 'A convenient way to help meet daily protein targets and support muscle recovery when whole-food intake is insufficient or impractical.',
    goals: ['recovery', 'body_composition', 'strength'],
    benefits: ['Convenient support for total daily protein intake.', 'Useful after training or around busy schedules.'],
    cautions: ['A supplement for convenience, not a replacement for a generally solid diet.', 'Product quality, digestibility, and sweeteners vary a lot between brands.'],
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
        isDefault: true
      },
      {
        name: 'Whey Concentrate',
        slug: 'whey-concentrate',
        form: 'powder',
        compoundType: 'concentrate',
        typicalDose: '20-35 g per serving',
        timing: ['post_workout', 'daily', 'flexible'],
        notes: ['Usually cheaper and often fine when digestibility is good.']
      }
    ]
  },
{
    name: 'Casein Protein',
    slug: 'casein-protein',
    category: 'recovery',
    evidenceLevel: 'moderate',
    description: 'A slower-digesting milk protein often used when someone wants a more filling shake or a pre-sleep protein option.',
    goals: ['recovery', 'body_composition'],
    benefits: ['Can help increase total daily protein intake.', 'Useful when a slower-digesting protein format is preferred.'],
    cautions: ['Not essential if total daily protein is already covered.', 'Digestive tolerance varies.'],
    tags: ['protein', 'evening'],
    variants: [
      {
        name: 'Micellar Casein',
        slug: 'micellar-casein',
        form: 'powder',
        compoundType: 'other',
        typicalDose: '20-40 g per serving',
        timing: ['evening', 'daily', 'flexible'],
        notes: ['Often used before bed for convenience.'],
        isDefault: true
      }
    ]
  },
{
    name: 'Soy Protein',
    slug: 'soy-protein',
    category: 'recovery',
    evidenceLevel: 'moderate',
    description: 'A practical plant-protein option for people who avoid dairy or want more variety in protein sources.',
    goals: ['recovery', 'body_composition'],
    benefits: ['Convenient non-dairy protein source.', 'Useful for vegetarian and dairy-free diets.'],
    cautions: ['Taste and texture vary a lot by product.', 'Total daily protein intake matters more than the brand story.'],
    tags: ['protein', 'plant-based'],
    variants: [
      {
        name: 'Soy Protein Isolate',
        slug: 'soy-protein-isolate',
        form: 'powder',
        compoundType: 'isolate',
        typicalDose: '20-35 g per serving',
        timing: ['post_workout', 'daily', 'flexible'],
        notes: ['A practical higher-protein plant option.'],
        isDefault: true
      }
    ]
  },
{
    name: 'Carbohydrate Powder',
    slug: 'carbohydrate-powder',
    category: 'performance',
    evidenceLevel: 'strong',
    description: 'A sports-food style option used to support fueling before, during, or after demanding training when normal food is not practical.',
    goals: ['endurance', 'recovery', 'power'],
    benefits: ['Can support session quality when training duration or volume is high.', 'Useful when appetite, logistics, or GI comfort make food less practical.'],
    cautions: ['Usually unnecessary for short easy sessions.', 'Total carbohydrate intake should still fit the broader diet.'],
    tags: ['sports-food', 'fueling'],
    variants: [
      {
        name: 'Maltodextrin Powder',
        slug: 'maltodextrin-powder',
        form: 'powder',
        compoundType: 'other',
        typicalDose: '20-60 g depending on session demands',
        timing: ['pre_workout', 'intra_workout', 'post_workout'],
        notes: ['Simple and common option for adding training carbohydrate.'],
        isDefault: true
      },
      {
        name: 'Cyclic Dextrin Powder',
        slug: 'cyclic-dextrin-powder',
        form: 'powder',
        compoundType: 'other',
        typicalDose: '20-50 g depending on session demands',
        timing: ['pre_workout', 'intra_workout'],
        notes: ['Often chosen for mixability and subjective GI comfort.']
      }
    ]
  },
{
    name: 'Sports Drink',
    slug: 'sports-drink',
    category: 'hydration',
    evidenceLevel: 'strong',
    description: 'A combined hydration and carbohydrate option that can be practical for longer sessions, hot environments, and competition settings.',
    goals: ['hydration', 'endurance', 'recovery'],
    benefits: ['Provides fluid plus carbohydrate in one practical format.', 'Useful when drinking plain water alone is not enough for the session context.'],
    cautions: ['Sugar content should match training demands rather than marketing claims.', 'Not automatically useful for every short gym session.'],
    tags: ['hydration', 'sports-food'],
    variants: [
      {
        name: 'Ready-to-Drink Sports Beverage',
        slug: 'ready-to-drink-sports-beverage',
        form: 'liquid',
        compoundType: 'other',
        typicalDose: 'Sip according to thirst and session demands',
        timing: ['intra_workout'],
        notes: ['Practical when access and convenience matter most.'],
        isDefault: true
      },
      {
        name: 'Sports Drink Powder',
        slug: 'sports-drink-powder',
        form: 'powder',
        compoundType: 'other',
        typicalDose: 'Mix product-specific serving in water',
        timing: ['intra_workout'],
        notes: ['Lets the user adjust concentration more easily.']
      }
    ]
  },
{
    name: 'Electrolytes',
    slug: 'electrolytes',
    category: 'hydration',
    evidenceLevel: 'moderate',
    description: 'A practical category for longer sessions, hot environments, and athletes who lose substantial fluid and sodium through sweat.',
    goals: ['hydration', 'endurance'],
    benefits: ['Can make hydration strategies more practical during long or sweaty sessions.'],
    cautions: ['Needs vary substantially with climate, duration, and individual sweat loss.'],
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
        isDefault: true
      },
      {
        name: 'Electrolyte Tablets',
        slug: 'electrolyte-tablets',
        form: 'tablet',
        compoundType: 'other',
        typicalDose: 'Use product-specific serving based on sweat loss and session duration',
        timing: ['intra_workout'],
        notes: ['Convenient for travel and endurance sessions.']
      }
    ]
  },
{
    name: 'Citrulline',
    slug: 'citrulline',
    category: 'performance',
    evidenceLevel: 'moderate',
    description: 'Commonly used to support training volume and subjective pump, especially in higher-rep or mixed-modality sessions.',
    goals: ['endurance', 'power'],
    benefits: ['May support session quality in high-volume training.', 'Often included in pre-workout stacks for subjective performance support.'],
    cautions: ['Product labels vary a lot, especially when malate ratios are unclear.'],
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
        isDefault: true
      },
      {
        name: 'Citrulline Malate',
        slug: 'citrulline-malate',
        form: 'powder',
        compoundType: 'malate',
        typicalDose: '6-10 g 30-60 min before training depending on ratio',
        timing: ['pre_workout'],
        notes: ['Check actual citrulline content because product ratios differ.']
      }
    ]
  },
{
    name: 'Beta-Alanine',
    slug: 'beta-alanine',
    category: 'performance',
    evidenceLevel: 'moderate',
    description: 'A saturation-based supplement more relevant for repeated high-intensity efforts than for single maximal lifts.',
    goals: ['endurance', 'power'],
    benefits: ['Most relevant for efforts with a meaningful glycolytic component.'],
    cautions: ['Tingling is a common benign side effect and can be reduced by splitting doses.', 'Works through saturation, so daily consistency matters more than workout timing.'],
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
        isDefault: true
      },
      {
        name: 'Beta-Alanine Capsules',
        slug: 'beta-alanine-capsules',
        form: 'capsule',
        compoundType: 'other',
        typicalDose: '3.2-6.4 g daily in divided servings',
        timing: ['daily', 'flexible'],
        notes: ['Capsules can make divided dosing more practical.']
      }
    ]
  },
{
    name: 'Sodium Bicarbonate',
    slug: 'sodium-bicarbonate',
    category: 'performance',
    evidenceLevel: 'strong',
    description: 'An evidence-based buffering aid most relevant for repeated high-intensity efforts where acidosis meaningfully limits performance.',
    goals: ['power', 'endurance'],
    benefits: ['Can improve performance in repeated high-intensity work.', 'Most relevant when sessions or events have a large glycolytic demand.'],
    cautions: ['GI distress is common if dosing and timing are not individualized.', 'Often best tested well before competition or important sessions.'],
    tags: ['buffering', 'competition'],
    variants: [
      {
        name: 'Sodium Bicarbonate Powder',
        slug: 'sodium-bicarbonate-powder',
        form: 'powder',
        compoundType: 'carbonate',
        typicalDose: '0.2-0.3 g/kg before demanding sessions',
        timing: ['pre_workout'],
        notes: ['Smaller split doses and food may improve tolerability.'],
        isDefault: true
      },
      {
        name: 'Sodium Bicarbonate Capsules',
        slug: 'sodium-bicarbonate-capsules',
        form: 'capsule',
        compoundType: 'carbonate',
        typicalDose: '0.2-0.3 g/kg before demanding sessions',
        timing: ['pre_workout'],
        notes: ['Capsules are often used to improve practicality and tolerability.']
      }
    ]
  },
{
    name: 'Dietary Nitrate',
    slug: 'dietary-nitrate',
    category: 'performance',
    evidenceLevel: 'strong',
    description: 'Commonly used through beetroot products to support nitric oxide availability and exercise economy in selected settings.',
    goals: ['endurance', 'power'],
    benefits: ['May be useful for endurance-oriented or mixed-modality performance contexts.', 'Often chosen when the athlete wants an alternative non-stimulant performance option.'],
    cautions: ['Response is individual and product nitrate content matters.', 'Less obviously relevant for every pure strength workout.'],
    tags: ['beetroot', 'non-stimulant'],
    variants: [
      {
        name: 'Beetroot Juice Shot',
        slug: 'beetroot-juice-shot',
        form: 'liquid',
        compoundType: 'other',
        typicalDose: 'Product-specific nitrate serving before training or competition',
        timing: ['pre_workout'],
        notes: ['Standardized sports shots are easier to dose consistently.'],
        isDefault: true
      },
      {
        name: 'Nitrate Capsules',
        slug: 'nitrate-capsules',
        form: 'capsule',
        compoundType: 'other',
        typicalDose: 'Product-specific nitrate serving before training or competition',
        timing: ['pre_workout'],
        notes: ['Check whether the product is standardized for nitrate content.']
      }
    ]
  },
{
    name: 'Glycerol',
    slug: 'glycerol',
    category: 'hydration',
    evidenceLevel: 'moderate',
    description: 'A more situational hydration support tool sometimes used where better fluid retention is desirable.',
    goals: ['hydration', 'endurance'],
    benefits: ['May support hydration strategies in selected hot or long-duration scenarios.'],
    cautions: ['Very context dependent and not necessary for most general gym users.', 'Test tolerance in training rather than first using it on an important day.'],
    tags: ['hydration', 'situational'],
    variants: [
      {
        name: 'Glycerol Liquid',
        slug: 'glycerol-liquid',
        form: 'liquid',
        compoundType: 'other',
        typicalDose: 'Use product-specific protocol with adequate fluid',
        timing: ['pre_workout'],
        notes: ['Most relevant when hydration logistics are unusually challenging.'],
        isDefault: true
      }
    ]
  },
{
    name: 'Omega-3',
    slug: 'omega-3',
    category: 'health',
    evidenceLevel: 'moderate',
    description: 'Often used for general health support and to fill dietary gaps when oily-fish intake is low.',
    goals: ['general_health', 'recovery'],
    benefits: ['Can help cover low intake of EPA and DHA from food.'],
    cautions: ['Useful to think in EPA+DHA content rather than capsule count alone.'],
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
        isDefault: true
      },
      {
        name: 'Liquid Fish Oil',
        slug: 'liquid-fish-oil',
        form: 'liquid',
        compoundType: 'other',
        typicalDose: 'Product-specific serving with a meal',
        timing: ['with_meal', 'daily'],
        notes: ['Useful when someone wants fewer capsules.']
      }
    ]
  },
{
    name: 'Vitamin D',
    slug: 'vitamin-d',
    category: 'health',
    evidenceLevel: 'moderate',
    description: 'More relevant as a deficiency-correction or gap-filling supplement than as a direct performance enhancer.',
    goals: ['general_health', 'recovery'],
    benefits: ['Useful when sun exposure or dietary intake is low.', 'Can support correction of low vitamin D status under appropriate guidance.'],
    cautions: ['Best framed around actual intake and status rather than assuming everyone needs it.', 'High-dose use should be more deliberate than casual daily stacking.'],
    tags: ['micronutrient', 'health'],
    variants: [
      {
        name: 'Vitamin D Softgel',
        slug: 'vitamin-d-softgel',
        form: 'softgel',
        compoundType: 'other',
        typicalDose: 'Product-specific daily dose, often with a meal',
        timing: ['with_meal', 'daily'],
        notes: ['A practical way to cover a common dietary gap.'],
        isDefault: true
      },
      {
        name: 'Vitamin D Liquid Drops',
        slug: 'vitamin-d-liquid-drops',
        form: 'liquid',
        compoundType: 'other',
        typicalDose: 'Product-specific daily dose, often with a meal',
        timing: ['with_meal', 'daily'],
        notes: ['Useful when flexible dosing is preferred.']
      }
    ]
  },
{
    name: 'Magnesium',
    slug: 'magnesium',
    category: 'health',
    evidenceLevel: 'moderate',
    description: 'More relevant as a general health and dietary-gap supplement than as a direct acute ergogenic aid.',
    goals: ['sleep', 'general_health', 'recovery'],
    benefits: ['Can be useful when intake is low or when nighttime routines benefit from a consistent supplement habit.'],
    cautions: ['Different forms vary in elemental magnesium content and GI tolerance.'],
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
        isDefault: true
      },
      {
        name: 'Magnesium Bisglycinate',
        slug: 'magnesium-bisglycinate',
        form: 'capsule',
        compoundType: 'bisglycinate',
        typicalDose: 'Product-specific dose, often taken in the evening',
        timing: ['evening', 'daily'],
        notes: ['Another common label format for chelated magnesium.']
      },
      {
        name: 'Magnesium Citrate',
        slug: 'magnesium-citrate',
        form: 'capsule',
        compoundType: 'citrate',
        typicalDose: 'Product-specific dose',
        timing: ['daily', 'with_meal'],
        notes: ['Useful to dose carefully if GI tolerance is inconsistent.']
      }
    ]
  },
{
    name: 'Multivitamin',
    slug: 'multivitamin',
    category: 'health',
    evidenceLevel: 'limited',
    description: 'A convenience product that can help cover obvious dietary gaps, but it is not a direct substitute for diet quality.',
    goals: ['general_health'],
    benefits: ['Can provide broad micronutrient coverage when diet variety is low.'],
    cautions: ['Not a shortcut around overall nutrition habits.', 'Formulas vary widely and can duplicate nutrients already taken elsewhere.'],
    tags: ['micronutrients', 'convenience'],
    variants: [
      {
        name: 'Daily Multivitamin Tablet',
        slug: 'daily-multivitamin-tablet',
        form: 'tablet',
        compoundType: 'other',
        typicalDose: 'Use product-specific daily serving',
        timing: ['morning', 'with_meal', 'daily'],
        notes: ['A practical option for people who prefer one broad-coverage product.'],
        isDefault: true
      },
      {
        name: 'Daily Multivitamin Capsules',
        slug: 'daily-multivitamin-capsules',
        form: 'capsule',
        compoundType: 'other',
        typicalDose: 'Use product-specific daily serving',
        timing: ['with_meal', 'daily'],
        notes: ['Capsules may be preferred when tablets are hard to tolerate.']
      }
    ]
  },
{
    name: 'Zinc',
    slug: 'zinc',
    category: 'health',
    evidenceLevel: 'limited',
    description: 'Mostly relevant as a dietary-gap supplement rather than a general performance enhancer.',
    goals: ['general_health', 'recovery'],
    benefits: ['Can help cover low zinc intake in restrictive or low-variety diets.'],
    cautions: ['High-dose long-term use is not a casual habit.', 'Makes more sense when intake is low or need is identified.'],
    tags: ['micronutrient'],
    variants: [
      {
        name: 'Zinc Capsules',
        slug: 'zinc-capsules',
        form: 'capsule',
        compoundType: 'other',
        typicalDose: 'Use product-specific daily serving with food if needed',
        timing: ['with_meal', 'daily'],
        notes: ['Commonly used in simple health-support stacks.'],
        isDefault: true
      }
    ]
  },
{
    name: 'Collagen',
    slug: 'collagen',
    category: 'recovery',
    evidenceLevel: 'emerging',
    description: 'Often used in tendon, ligament, or connective-tissue support routines rather than as a primary muscle-building protein.',
    goals: ['recovery', 'general_health'],
    benefits: ['Sometimes used to complement rehab-oriented or connective-tissue-focused routines.'],
    cautions: ['Not a replacement for high-quality complete dietary protein.', 'Use cases are more specific than generic muscle gain marketing suggests.'],
    tags: ['connective-tissue', 'rehab'],
    variants: [
      {
        name: 'Collagen Peptides Powder',
        slug: 'collagen-peptides-powder',
        form: 'powder',
        compoundType: 'other',
        typicalDose: '10-20 g daily or around rehab-focused work',
        timing: ['daily', 'flexible'],
        notes: ['Often paired with a vitamin-C-containing food or drink.'],
        isDefault: true
      }
    ]
  },
{
    name: 'Curcumin',
    slug: 'curcumin',
    category: 'recovery',
    evidenceLevel: 'emerging',
    description: 'Used by some athletes as part of a soreness or recovery strategy, though responses and products vary.',
    goals: ['recovery', 'general_health'],
    benefits: ['May be considered in selected recovery routines.'],
    cautions: ['Standardization and bioavailability support vary widely between products.', 'It should not be treated like a direct training-performance staple.'],
    tags: ['recovery', 'botanical'],
    variants: [
      {
        name: 'Standardized Curcumin Capsules',
        slug: 'standardized-curcumin-capsules',
        form: 'capsule',
        compoundType: 'standardized_extract',
        typicalDose: 'Use product-specific serving with food if appropriate',
        timing: ['with_meal', 'daily'],
        notes: ['Look for standardized products rather than vague turmeric branding.'],
        isDefault: true
      }
    ]
  },
{
    name: 'Tart Cherry',
    slug: 'tart-cherry',
    category: 'recovery',
    evidenceLevel: 'emerging',
    description: 'A recovery-oriented option often used around dense training or competition periods.',
    goals: ['recovery', 'sleep'],
    benefits: ['May fit short-term recovery-focused phases when training density is high.'],
    cautions: ['More relevant as a targeted strategy than a year-round default supplement.'],
    tags: ['recovery', 'competition'],
    variants: [
      {
        name: 'Tart Cherry Concentrate',
        slug: 'tart-cherry-concentrate',
        form: 'liquid',
        compoundType: 'other',
        typicalDose: 'Use product-specific serving around hard blocks or events',
        timing: ['post_workout', 'evening'],
        notes: ['Usually used in concentrated form for practicality.'],
        isDefault: true
      },
      {
        name: 'Tart Cherry Capsules',
        slug: 'tart-cherry-capsules',
        form: 'capsule',
        compoundType: 'standardized_extract',
        typicalDose: 'Use product-specific serving around hard blocks or events',
        timing: ['post_workout', 'evening'],
        notes: ['Check whether the product is standardized for active compounds.']
      }
    ]
  },
{
    name: 'Melatonin',
    slug: 'melatonin',
    category: 'health',
    evidenceLevel: 'moderate',
    description: 'A sleep-support supplement more relevant to travel, schedule disruption, and selected sleep routines than to direct gym performance.',
    goals: ['sleep', 'recovery'],
    benefits: ['Can be useful when sleep timing is disrupted or travel schedules are challenging.'],
    cautions: ['Not a replacement for good sleep hygiene.', 'Dose response and next-day grogginess vary a lot.'],
    tags: ['sleep', 'travel'],
    variants: [
      {
        name: 'Melatonin Tablets',
        slug: 'melatonin-tablets',
        form: 'tablet',
        compoundType: 'other',
        typicalDose: 'Use a low product-specific dose before intended sleep if needed',
        timing: ['evening'],
        notes: ['Often best used deliberately rather than casually every night.'],
        isDefault: true
      },
      {
        name: 'Melatonin Capsules',
        slug: 'melatonin-capsules',
        form: 'capsule',
        compoundType: 'other',
        typicalDose: 'Use a low product-specific dose before intended sleep if needed',
        timing: ['evening'],
        notes: ['Useful when a capsule format is preferred.']
      }
    ]
  },
{
    name: 'Ashwagandha',
    slug: 'ashwagandha',
    category: 'health',
    evidenceLevel: 'emerging',
    description: 'A botanical supplement sometimes used for stress-management or wellness goals, with product quality and standardization being especially important.',
    goals: ['general_health', 'sleep', 'recovery'],
    benefits: ['Sometimes included in routines focused on stress management and general wellness.'],
    cautions: ['Products differ a lot in extract standardization and actual content.', 'It should not be treated like a guaranteed performance aid.'],
    tags: ['botanical', 'stress'],
    variants: [
      {
        name: 'Ashwagandha Extract Capsules',
        slug: 'ashwagandha-extract-capsules',
        form: 'capsule',
        compoundType: 'standardized_extract',
        typicalDose: 'Use product-specific daily serving',
        timing: ['daily', 'with_meal'],
        notes: ['Standardized extracts are preferable to vague herb blends.'],
        isDefault: true
      }
    ]
  },
{
    name: 'Probiotics',
    slug: 'probiotics',
    category: 'health',
    evidenceLevel: 'emerging',
    description: 'A broad category where strain selection matters more than the generic word on the front label.',
    goals: ['general_health', 'recovery'],
    benefits: ['Can fit selected gut-health or tolerance-focused routines.'],
    cautions: ['Benefits are strain-specific and not interchangeable across products.', 'Storage and product quality matter.'],
    tags: ['gut-health'],
    variants: [
      {
        name: 'Multi-Strain Probiotic Capsules',
        slug: 'multi-strain-probiotic-capsules',
        form: 'capsule',
        compoundType: 'other',
        typicalDose: 'Use product-specific daily serving',
        timing: ['daily', 'with_meal'],
        notes: ['Choose products with clearly labeled strains and storage guidance.'],
        isDefault: true
      }
    ]
  },
{
    name: 'Glutamine',
    slug: 'glutamine',
    category: 'recovery',
    evidenceLevel: 'limited',
    description: 'Often marketed heavily in sports nutrition, but usually less central than protein, carbohydrate, or creatine for most gym users.',
    goals: ['recovery', 'general_health'],
    benefits: ['May fit selected situations, especially when intake or tolerance considerations are unusual.'],
    cautions: ['Usually lower priority than meeting broader protein and fueling basics.', 'Claims often exceed practical evidence for strength and hypertrophy users.'],
    tags: ['recovery'],
    variants: [
      {
        name: 'L-Glutamine Powder',
        slug: 'l-glutamine-powder',
        form: 'powder',
        compoundType: 'other',
        typicalDose: '5-10 g daily depending on context',
        timing: ['post_workout', 'daily', 'flexible'],
        notes: ['Often stacked for convenience rather than because it is foundational.'],
        isDefault: true
      }
    ]
  },
{
    name: 'BCAA',
    slug: 'bcaa',
    category: 'body_composition',
    evidenceLevel: 'limited',
    description: 'A niche amino-acid supplement that is usually less valuable when total daily protein intake is already sufficient.',
    goals: ['body_composition', 'recovery'],
    benefits: ['May be considered when training fasted or when total protein intake is unusually constrained.'],
    cautions: ['Usually low priority if overall protein intake is already adequate.', 'Marketing often oversells its importance relative to complete protein.'],
    tags: ['amino-acids'],
    variants: [
      {
        name: 'BCAA Powder',
        slug: 'bcaa-powder',
        form: 'powder',
        compoundType: 'other',
        typicalDose: 'Use product-specific serving around training if chosen',
        timing: ['pre_workout', 'intra_workout', 'post_workout'],
        notes: ['A situational option rather than a default recommendation.'],
        isDefault: true
      }
    ]
  },
{
    name: 'EAA',
    slug: 'eaa',
    category: 'recovery',
    evidenceLevel: 'limited',
    description: 'A more complete amino-acid category than BCAA, but still generally secondary to meeting protein targets with complete protein sources.',
    goals: ['recovery', 'body_composition'],
    benefits: ['May be used in selected settings where complete protein is not practical close to training.'],
    cautions: ['Still usually lower priority than total daily protein from complete sources.', 'Product formulas and dosing logic vary a lot.'],
    tags: ['amino-acids'],
    variants: [
      {
        name: 'EAA Powder',
        slug: 'eaa-powder',
        form: 'powder',
        compoundType: 'other',
        typicalDose: 'Use product-specific serving around training if chosen',
        timing: ['pre_workout', 'intra_workout', 'post_workout'],
        notes: ['More complete than BCAA, but not a replacement for real protein intake.'],
        isDefault: true
      }
    ]
  },
{
    name: 'L-Carnitine',
    slug: 'l-carnitine',
    category: 'body_composition',
    evidenceLevel: 'limited',
    description: 'Commonly marketed for fat loss and recovery, though practical outcomes for general gym users are often less impressive than the marketing suggests.',
    goals: ['body_composition', 'recovery'],
    benefits: ['May fit selected body-composition stacks when expectations are realistic.'],
    cautions: ['Not a shortcut for fat loss or training consistency.', 'Best kept low-priority unless there is a clear reason to use it.'],
    tags: ['fat-loss'],
    variants: [
      {
        name: 'L-Carnitine Liquid',
        slug: 'l-carnitine-liquid',
        form: 'liquid',
        compoundType: 'other',
        typicalDose: 'Use product-specific daily serving',
        timing: ['daily', 'morning'],
        notes: ['Popular in commercial fat-loss products.'],
        isDefault: true
      },
      {
        name: 'L-Carnitine Capsules',
        slug: 'l-carnitine-capsules',
        form: 'capsule',
        compoundType: 'other',
        typicalDose: 'Use product-specific daily serving',
        timing: ['daily', 'morning'],
        notes: ['Capsule format is simpler for routine use.']
      }
    ]
  },
{
    name: 'Green Tea Extract',
    slug: 'green-tea-extract',
    category: 'body_composition',
    evidenceLevel: 'limited',
    description: 'Sometimes included in body-composition products, but its role is supplementary at best.',
    goals: ['body_composition', 'general_health'],
    benefits: ['Often included in lower-stimulant wellness or body-composition stacks.'],
    cautions: ['Not a substitute for calorie control or activity.', 'Standardization and caffeine content vary by product.'],
    tags: ['fat-loss', 'botanical'],
    variants: [
      {
        name: 'Green Tea Extract Capsules',
        slug: 'green-tea-extract-capsules',
        form: 'capsule',
        compoundType: 'standardized_extract',
        typicalDose: 'Use product-specific serving',
        timing: ['morning', 'daily'],
        notes: ['Check whether caffeine is present and standardized.'],
        isDefault: true
      }
    ]
  },
{
    name: 'Pre-Workout Blend',
    slug: 'pre-workout-blend',
    category: 'performance',
    evidenceLevel: 'limited',
    description: 'A convenience category that can combine useful ingredients, but label transparency and dosing quality vary dramatically.',
    goals: ['power', 'endurance', 'cognition'],
    benefits: ['Convenient all-in-one format for users who value simplicity.'],
    cautions: ['Proprietary blends can hide underdosed ingredients or unnecessary extras.', 'Better evaluated ingredient by ingredient than by marketing name.'],
    tags: ['pre-workout', 'stack'],
    variants: [
      {
        name: 'Powdered Pre-Workout Blend',
        slug: 'powdered-pre-workout-blend',
        form: 'powder',
        compoundType: 'other',
        typicalDose: 'Use product-specific serving before training',
        timing: ['pre_workout'],
        notes: ['Most useful when the label clearly discloses doses.'],
        isDefault: true
      },
      {
        name: 'Capsule Pre-Workout Blend',
        slug: 'capsule-pre-workout-blend',
        form: 'capsule',
        compoundType: 'other',
        typicalDose: 'Use product-specific serving before training',
        timing: ['pre_workout'],
        notes: ['Capsules can be practical but may underdeliver on meaningful doses.']
      }
    ]
  },
{
    name: 'Sleep Formula',
    slug: 'sleep-formula',
    category: 'health',
    evidenceLevel: 'limited',
    description: 'A mixed category of sleep-support products that often bundles several ingredients into one routine-focused formula.',
    goals: ['sleep', 'recovery'],
    benefits: ['Can be a simple all-in-one option for users who strongly prefer a single evening product.'],
    cautions: ['Blend quality varies and ingredients may overlap with other supplements already used.', 'The formula should be assessed ingredient by ingredient.'],
    tags: ['sleep', 'stack'],
    variants: [
      {
        name: 'Capsule Sleep Formula',
        slug: 'capsule-sleep-formula',
        form: 'capsule',
        compoundType: 'other',
        typicalDose: 'Use product-specific serving before bed if chosen',
        timing: ['evening'],
        notes: ['Often includes magnesium, melatonin, botanicals, or amino acids.'],
        isDefault: true
      }
    ]
  },
{
    name: 'Vitamin C',
    slug: 'vitamin-c',
    category: 'health',
    evidenceLevel: 'limited',
    description: 'Mainly a basic micronutrient supplement rather than a dedicated gym-performance product.',
    goals: ['general_health', 'recovery'],
    benefits: ['Can help cover low intake when fruit and vegetable consumption is poor.'],
    cautions: ['Usually a low priority when diet quality is decent.', 'More is not automatically better.'],
    tags: ['micronutrient'],
    variants: [
      {
        name: 'Vitamin C Tablets',
        slug: 'vitamin-c-tablets',
        form: 'tablet',
        compoundType: 'other',
        typicalDose: 'Use product-specific daily serving if needed',
        timing: ['daily', 'with_meal'],
        notes: ['A simple option when dietary intake is low.'],
        isDefault: true
      }
    ]
  },
{
    name: 'Beetroot Powder',
    slug: 'beetroot-powder',
    category: 'performance',
    evidenceLevel: 'moderate',
    description: 'A practical alternative nitrate format for users who dislike juice shots and still want a beetroot-based pre-event option.',
    goals: ['endurance', 'power'],
    benefits: ['Useful when someone wants a powder format rather than liquid shots.'],
    cautions: ['Only meaningful if nitrate content is actually standardized or disclosed.'],
    tags: ['beetroot', 'powder'],
    variants: [
      {
        name: 'Standardized Beetroot Powder',
        slug: 'standardized-beetroot-powder',
        form: 'powder',
        compoundType: 'standardized_extract',
        typicalDose: 'Use product-specific nitrate serving before training or competition',
        timing: ['pre_workout'],
        notes: ['A solid option when nitrate content is clearly labeled.'],
        isDefault: true
      }
    ]
  },
];
