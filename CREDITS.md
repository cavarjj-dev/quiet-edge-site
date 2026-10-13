# Photo credits

Every photograph on the site is real photography from **Pexels** (https://www.pexels.com). None of it is AI-generated. All eight were downloaded Oct 13, 2026 from the Pexels CDN, then cropped, color-graded toward the brand palette (lower saturation, pine shadows, ivory highlights; extra desaturation on the red walls in the court and mom-son shots) and exported to WebP at 800 and 1600 px with `_build/photos.py`. The originals are kept in `/workspace/quietedge/_build/photos_src/`.

**License:** Pexels License (https://www.pexels.com/license/, checked Oct 13, 2026). Free for commercial use, editing is allowed, and attribution isn't required, though it's appreciated. The footer has a short courtesy line: "Photographs courtesy of Pexels contributors." The rules that matter here: *identifiable people may not appear in a bad light or in a way that is offensive*, and no implied endorsement.
- Every photo is used in a positive or neutral context. The "usual" side of the home contrast is a typographic pine panel, with no photo and no person.
- No photo suggests that any of the people shown endorse The Quiet Edge, and the copy never names or describes them as clients.

| File (assets/img/photos/) | Used on | Pexels title | Photographer | Source page |
|---|---|---|---|---|
| `ride-builds-*.webp` | Home, "Two rides home" (right): *The ride home that builds it.* | Man in White and Black Striped Dress Shirt Driving Car | Ron Lach | https://www.pexels.com/photo/9518021/ |
| `baseball-*.webp` | Home, full-width band above the Parent Companion quote | Mother and Son Playing Baseball Outdoors | Joaquin Reyes Ramos | https://www.pexels.com/photo/mother-and-son-playing-baseball-outdoors-39612963/ |
| `coach-*.webp` | Clubs, "What a license includes" | A Man in Black Long Sleeve Shirt Coaching a Team | cottonbro studio | https://www.pexels.com/photo/a-man-in-black-long-sleeve-shirt-coaching-a-team-6767338/ |
| `football-*.webp` | Clubs, full-width band above Licenses | (untitled) Youth football game | Sean P. Twomey | https://www.pexels.com/photo/9935395/ |
| `court-*.webp` | Parents, "Where to begin" | Mother and Daughter Talking While Sitting on Ground | Liliana Drew | https://www.pexels.com/photo/mother-and-daughter-talking-while-sitting-on-ground-8497859/ |
| `grandmother-*.webp` | Parents, "Whoever drives" | Elderly Woman Hugging Her Granddaughter | cottonbro studio | https://www.pexels.com/photo/7086010/ |
| `mom-son-*.webp` | About, "Principles" | Man and Woman Standing Near a Red Wall (mother and son) | Liliana Drew | https://www.pexels.com/photo/8497851/ |
| `bench-*.webp` | About, full-width band between Founder and Principles | (untitled) High school basketball players on the bench | Lesli Whitecotton | https://www.pexels.com/photo/30287920/ |

Notes:
- The football and bench photos show real teams at real events (jerseys "ELITE" and "VIKES" are visible), and Pexels doesn't guarantee model releases. Both are used only as wide, neutral bands with neutral captions ("Every sport. Every roster. The same ride home." and "Every player on this bench rides home with someone."). If you'd rather not show a real program's jerseys, replace them or crop tighter.
- Retired from the site (files deleted): ride-ends (Ron Lach 9518014), dusk (Nesrin Öztürk 18320066), athlete (maina shot 33004557).
- To replace an image, put the new original in `_build/photos_src/`, edit `JOBS` in `_build/photos.py`, run it, and update `PHOTO_DIMS` in `_build/site_build.py` if the crop size changes.
