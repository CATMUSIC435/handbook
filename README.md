# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

```
[out:json][timeout:25];
area["name"="Thành phố Hồ Chí Minh"]->.searchArea;
(
  // 1. Lấy tất cả các tuyến (Relations) bao gồm hiện tại, đang xây và quy hoạch
  relation["route"="subway"](area.searchArea);
  
  // 2. Lấy tất cả đường ray (Ways): subway (hiện hữu), construction (đang xây), proposed (quy hoạch)
  way["railway"~"subway|construction|proposed"](area.searchArea);
  
  // 3. Lấy tất cả nhà ga (Nodes): station (hiện hữu), construction (đang xây), proposed_station (quy hoạch)
  node["railway"~"station|construction|proposed_station"](area.searchArea);
);
out body;
>;
out skel qt;
```
