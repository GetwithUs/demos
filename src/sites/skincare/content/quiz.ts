import type { ConcernId, SkinType } from "@/sites/skincare/data/types";

export type Sensitivity = "low" | "some" | "high";
export type AgeRange = "under-20" | "20s" | "30s" | "40s" | "50-plus";
export type Climate = "humid" | "hot-dry" | "cold" | "city";
export type RoutineLength = "minimal" | "balanced" | "full";
export type ActivesUse = "never" | "sometimes" | "regular";

export type QuizAnswers = {
  skinType: SkinType;
  concerns: ConcernId[];
  sensitivity: Sensitivity;
  age: AgeRange;
  climate: Climate;
  routine: RoutineLength;
  actives: ActivesUse;
};

type Option<T extends string> = { value: T; label: string; hint?: string };

export type QuizQuestion =
  | { id: "skinType"; kind: "single"; title: string; help: string; options: Option<SkinType>[] }
  | {
      id: "concerns";
      kind: "multi";
      max: number;
      title: string;
      help: string;
      options: Option<ConcernId>[];
    }
  | {
      id: "sensitivity";
      kind: "single";
      title: string;
      help: string;
      options: Option<Sensitivity>[];
    }
  | { id: "age"; kind: "single"; title: string; help: string; options: Option<AgeRange>[] }
  | { id: "climate"; kind: "single"; title: string; help: string; options: Option<Climate>[] }
  | { id: "routine"; kind: "single"; title: string; help: string; options: Option<RoutineLength>[] }
  | { id: "actives"; kind: "single"; title: string; help: string; options: Option<ActivesUse>[] };

export const QUIZ: QuizQuestion[] = [
  {
    id: "skinType",
    kind: "single",
    title: "How does your skin feel by midday?",
    help: "Think of a normal day, a few hours after washing your face.",
    options: [
      { value: "oily", label: "Shiny all over", hint: "Oily" },
      { value: "combination", label: "Shiny T-zone, normal or dry cheeks", hint: "Combination" },
      { value: "dry", label: "Tight, rough or flaky", hint: "Dry" },
      { value: "normal", label: "Comfortable, neither oily nor dry", hint: "Normal" },
      { value: "sensitive", label: "Easily red, itchy or stinging", hint: "Sensitive" },
    ],
  },
  {
    id: "concerns",
    kind: "multi",
    max: 3,
    title: "What would you most like to work on?",
    help: "Pick up to three. Put your biggest concern first.",
    options: [
      { value: "acne", label: "Acne and breakouts" },
      { value: "pigmentation", label: "Dark spots, tan and marks" },
      { value: "dullness", label: "Dullness and uneven tone" },
      { value: "oiliness", label: "Oiliness and large pores" },
      { value: "dryness", label: "Dryness and dehydration" },
      { value: "ageing", label: "Fine lines and firmness" },
      { value: "sensitivity", label: "Redness and sensitivity" },
      { value: "sun-protection", label: "Sun protection and tanning" },
    ],
  },
  {
    id: "sensitivity",
    kind: "single",
    title: "How does your skin react to new products?",
    help: "This decides how strong your actives should be.",
    options: [
      { value: "low", label: "Rarely reacts", hint: "I can try most things" },
      { value: "some", label: "Sometimes stings or turns red", hint: "Mostly fine" },
      { value: "high", label: "Often reacts", hint: "I am careful with everything" },
    ],
  },
  {
    id: "age",
    kind: "single",
    title: "Your age range",
    help: "Skin needs change with time. This helps us pick the right actives.",
    options: [
      { value: "under-20", label: "Under 20" },
      { value: "20s", label: "20 to 29" },
      { value: "30s", label: "30 to 39" },
      { value: "40s", label: "40 to 49" },
      { value: "50-plus", label: "50 and above" },
    ],
  },
  {
    id: "climate",
    kind: "single",
    title: "What is the weather like where you live?",
    help: "Indian weather changes what your skin needs.",
    options: [
      { value: "humid", label: "Hot and humid", hint: "Mumbai, Chennai, Kolkata, Kochi" },
      { value: "hot-dry", label: "Hot and dry", hint: "Jaipur, Ahmedabad, Hyderabad" },
      { value: "cold", label: "Cool or hilly", hint: "Dehradun, Shimla, Shillong" },
      { value: "city", label: "Big city with pollution", hint: "Delhi NCR, Bengaluru, Pune" },
    ],
  },
  {
    id: "routine",
    kind: "single",
    title: "How much time do you want to spend?",
    help: "Be honest. The best routine is the one you actually follow.",
    options: [
      { value: "minimal", label: "Minimal", hint: "3 steps, in and out" },
      { value: "balanced", label: "Balanced", hint: "4 steps morning and night" },
      { value: "full", label: "The full ritual", hint: "I enjoy my skincare" },
    ],
  },
  {
    id: "actives",
    kind: "single",
    title: "Have you used retinol or exfoliating acids before?",
    help: "For example retinol, glycolic or salicylic acid.",
    options: [
      { value: "never", label: "Never" },
      { value: "sometimes", label: "A few times" },
      { value: "regular", label: "Yes, regularly" },
    ],
  },
];
