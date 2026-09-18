# Arikaran Portfolio

Live site: https://arikaran-ai-portfolio.garden-mochi-0455.chatgpt.site

A responsive static portfolio with light/dark themes, project filters, scroll reveals, hover and tap feedback, and resume preview/download.

## Run locally

Open `dist/index.html` in a browser, or serve the folder with Python:

```sh
python -m http.server 8000 --directory dist
```

Then open http://localhost:8000. No package installation or build is needed. Google Fonts requires internet access; system fonts are the fallback.

## Files

- `dist/index.html`: portfolio content and project cards
- `dist/style.css`: responsive styles and animation effects
- `dist/motion.js`: entrances, card tilt, magnetic labels, navigation and scroll progress
- `dist/carousel.js`: horizontal scroll snapping, active-card glow, arrow navigation and filter integration
- `dist/interactive.js`: project filtering and rotating title
- `dist/theme.js`: theme selection and persistence
- `dist/Arikaran_Resume.pdf`: original resume
- `.openai/hosting.json`: existing Sites project configuration

## Featured additions

Fetal Health Classification and Employee Attrition Prediction were chosen from four supplied repositories based on their documented modelling workflows and evaluation decisions. Descriptions are based on their READMEs; model results were not independently rerun.

- https://github.com/ARIKARAN06/Fetal_health_end_to_end_project
- https://github.com/ARIKARAN06/employee-attrition-prediction

Their repositories are linked from the portfolio; their datasets and model code are not bundled in this website project.

The ZIP includes the complete website source and resume, without Git history, credentials or temporary deployment files.
