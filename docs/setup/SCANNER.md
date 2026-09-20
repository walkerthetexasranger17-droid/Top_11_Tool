# Scanner setup — v0.4.18

Scanner v12 uses the ORIGINAL uploaded screenshot resolution for the entire recognition pipeline. The scanner baseline is the native 2688×1216 Top Eleven layout. A 2688×1216 upload is cropped 1:1; matching-layout screenshots at another resolution use proportional ROI coordinates before cropping. Name, OVR, age, roles, skills, playstyle and coloured Special Ability evidence therefore all come from source pixels.

Playstyle level recognition still uses exact PlaystyleSmallAtlas references, context-matched rasterisation, a Ready/max-XP-arrow mask, two Gemini confirmation passes and the deterministic pixel-level guard. Gold Special Ability references remain disabled.
