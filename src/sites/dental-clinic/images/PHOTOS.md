# Ivorine Dental Studio: photo slots

Every file here is a labelled placeholder at the exact size the design uses. Replace each one with
a real photo under the same file name and size (JPG, sRGB, about 80% quality). Pages import them
statically, so nothing else needs to change.

Style for all photos: warm daylight, calm and uncluttered, soft natural tones (ivory, wood, sage
green), real people with natural expressions. Avoid harsh blue clinical light and staged
thumbs-up poses. Indian patients and staff where people are shown.

| File                  | Size (w x h) | What the photo should show                                                                                                                                                                                   | Unsplash search phrase                      |
| --------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| `hero.jpg`            | 1080 x 1320  | Home hero, framed in an arch. A smiling woman (30s) in a dental chair chatting with her dentist, bright window light, both relaxed. Keep faces in the upper middle; the top corners are cropped by the arch. | indian dentist patient smiling consultation |
| `studio-lounge.jpg`   | 1000 x 1250  | Reception lounge, portrait: warm wood, linen sofa, plants, soft daylight. No people needed. Shown in an arch frame on the home page.                                                                         | modern clinic reception lounge plants wood  |
| `studio-room.jpg`     | 1200 x 900   | Treatment room: modern dental chair beside a large window, tidy and bright.                                                                                                                                  | modern dental treatment room window         |
| `sterilisation.jpg`   | 1200 x 900   | Sterilisation room: autoclave and rows of sealed instrument pouches.                                                                                                                                         | dental autoclave sterilization pouches      |
| `digital-scan.jpg`    | 1200 x 900   | A dentist scanning a patient's teeth with an intraoral scanner, a 3D tooth model visible on a monitor. Used on the root canal and implants pages.                                                            | intraoral scanner dentist 3d scan           |
| `consultation.jpg`    | 1200 x 900   | A dentist explaining a digital X-ray on a screen to a seated patient.                                                                                                                                        | dentist showing x-ray to patient            |
| `kids.jpg`            | 1200 x 900   | A happy child (about 6) in the dental chair, the dentist showing a toothbrush, parent nearby.                                                                                                                | child dentist visit smiling                 |
| `doctor-aditi.jpg`    | 800 x 1000   | Portrait of Dr. Aditi Rawat: woman, early 40s, white coat, warm smile, plain light background. Head and shoulders, face in the upper third (arch crop).                                                      | indian woman dentist portrait               |
| `doctor-kunal.jpg`    | 800 x 1000   | Portrait of Dr. Kunal Bhandari: man, late 30s, navy scrubs, friendly, plain light background. Same framing as above.                                                                                         | indian male doctor portrait scrubs          |
| `doctor-sana.jpg`     | 800 x 1000   | Portrait of Dr. Sana Qureshi: woman, mid 30s, white coat, confident, plain light background. Same framing.                                                                                                   | indian woman doctor portrait white coat     |
| `doctor-rohan.jpg`    | 800 x 1000   | Portrait of Dr. Rohan Negi: man, early 30s, sage or light green scrubs, kind smile. Same framing.                                                                                                            | young indian dentist portrait               |
| `smile-whitening.jpg` | 1200 x 800   | Close-up of a smile (lips and teeth only) after professional whitening. Used for the before/after slider.                                                                                                    | close up smile white teeth                  |
| `smile-aligners.jpg`  | 1200 x 800   | Close-up of a smile with straight, even teeth after clear aligners.                                                                                                                                          | close up straight teeth smile               |
| `smile-veneers.jpg`   | 1200 x 800   | Close-up of a natural-looking smile after veneers.                                                                                                                                                           | close up perfect smile veneers              |

## Before and after

The "before" side of each slider is the same photo with a warm, dull CSS filter
(`.dental-before-filter` in `theme.css`). That is convincing for whitening, but not for aligners or
veneers, where the shape of the teeth changes. When real case photos (with written patient
consent) are available, add them as `smile-aligners-before.jpg` and `smile-veneers-before.jpg`
(1200 x 800, same framing as the "after") and pass them as `before` in
`content/gallery.ts`; the slider then shows the real photo without the filter.

The Visiting consultant (Dr. Vikram Thapliyal) and patient reviews use initials, so they need no
photo.
