# Terminals, Footers, and Navigation Semantics

## Desktop

Each branch contains:

```text
last content chapter → musical cadence → final barline → branch terminal
```

Branch terminals visually provide footer-like content. They use one shared configuration/data source and unique accessible labels. They do not maintain independent legal/contact data.

## Mobile/vertical mode

- Professional branch ends with a visual musical conclusion and transition.
- It is not a duplicate global `<footer>`.
- The final Application terminal integrates the one semantic footer/navigation
  close after its final barline.
- The immersive route does not append a second visual global-footer block.
- Standalone/internal pages and nonimmersive review surfaces retain their
  existing shared footer behavior.

## Footer content

- W_Flyer brand/portfolio description;
- About, Services, Projects, Contact;
- W_Flyer Application;
- legal/accessibility links;
- approved email/GitHub/Instagram;
- copyright.

## Navigation semantics

- Score is decorative by default (`aria-hidden`).
- Real navigation uses links/buttons.
- Detailed routes remain accessible without the immersive story.
- Final barline is narrative geometry, not a link or landmark.
