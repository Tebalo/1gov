1. Multistep form: https://www.youtube.com/watch?v=lW_0InDuejU - https://github1s.com/HamedBahram/next-multistep-form/blob/main/components/form.tsx
2. Regions: https://botswana.places-in-the-world.com/regions.html
3. Shadcn UI: https://ui.shadcn.com/
4. NextJS 14 Folder Structure: https://github1s.com/mertthesamael/lalasia/blob/master/app/auth/callback/route.ts - https://medium.com/@mertenercan/nextjs-13-folder-structure-c3453d780366  - https://www.youtube.com/watch?v=gLFT1wYd7G0

Libraries and Components
1. npm i zod (https://www.npmjs.com/package/zod)
2. npm i framer-motion (https://www.npmjs.com/package/framer-motion)
3. npm i @hookform/resolvers (https://www.npmjs.com/package/@hookform/resolvers?activeTab=readme)
4. npm i react-hook-form (https://www.npmjs.com/package/react-hook-form)
5. npm i @tailwindcss/forms (https://www.npmjs.com/package/@tailwindcss/forms)
6. npm i react-chartjs-2 (https://www.npmjs.com/package/react-chartjs-2)
7. npm i @faker-js/faker (https://www.npmjs.com/package/@faker-js/faker)
8. npm install tailwind-scrollbar-hide https://github.com/reslear/tailwind-scrollbar-hide https://stackoverflow.com/questions/69400560/how-to-change-scrollbar-when-using-tailwind-next-js-react
16. https://react-icons.github.io/react-icons/icons/fa/

TODO:
1. Setup Themes: https://www.youtube.com/watch?v=l93uukpAoxE
2. State transition using useTransition Hook: https://www.youtube.com/watch?v=SFZrHMZQon8
3. Global State Management using Zustand: https://www.youtube.com/watch?v=BxohoXjbhKc&t=1036s
4. Data Display: https://tailwindui.com/components/application-ui/data-display/description-lists
5. Shadcn & Next UI: https://www.youtube.com/watch?v=zj0i2lkAbG8&t=87s
6. React Hooks: https://react.dev/reference/react/hooks
7. Scaling Up with Reducer and Context: https://react.dev/learn/scaling-up-with-reducer-and-context
8. Reusing Logic with Custom Hooks: https://react.dev/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component
9. Promise: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
10. Using promises: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
11. Next UI: https://nextui.org/docs/guide/introduction
12. Zustand: https://docs.pmnd.rs/zustand/getting-started/introduction
13. Material UI: https://mui.com/material-ui/getting-started/

Erros and Resolutions
1. https://github.com/shadcn-ui/ui/issues/800: My mistake was that my editor auto imported Form component from react-hook-form when it should have been imported from @/components/ui/form. Hope this helps somebody.
2. Hydration error is a result of local storage, because the render tree between pre-render(SSR/SSG) and the first render in browser is different: https://nextjs.org/docs/messages/react-hydration-error