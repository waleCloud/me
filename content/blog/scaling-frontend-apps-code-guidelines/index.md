---
title: Scaling Frontend Applications - Coding Guidelines
date: "2022-02-20T15:00:00.169Z"
featuredImage: ./img/building.png
description: Structuring your frontend application can become tricky as your product and codebase grows, In this post, I will be sharing what I have found to a working solution for almost any kind of Frontend project size.
---

Structuring your frontend application can become tricky as your product and codebase grows, In this post, I will be sharing what I have found to a working solution for almost any kind of Frontend project size. This guideline is strongly inspired by a pattern termed as the [duck pattern](https://www.freecodecamp.org/news/scaling-your-redux-app-with-ducks-6115955638be).

The entire idea of ducks is to group seemingly related files together in a way that makes it modular, modification easier, scalable, and easy to deconstruct whenever a need arises and move technologies around like state libraries etc.

The saying if it walks like a duck, quack like a duck, its probably a duck. Duck pattern at its core is about colocating small files that work together as a unit. Lets see guideline  below;

* [Files and Folder Convention](#file-and-folder-convention)
* [Components](#components)
  * [Presentational Components](#presentational-components)
  * [Connected Components](#connected-components)
  * [Styling Components](#styling-components)
* [Interacting with Backend](#interacting-with-backend)
* [State sharing](#state-sharing)

### File and Folder Convention

Using the feature pattern to colocate feature related files rather than by functions, lets take a look at a login example

#### Feature-first ✅

```md
Login/
  Login.tsx
  index.ts
  store/
    reducers.ts
    actions.ts
```

"Feature-first" refers to naming your top-level folders after the primary feature your app contains, Login in this case.

Because each new feature comes with its own folder, this technique scales considerably better.

You can have files that aren't associated with any functionality and call them common/shared/core etc because you want to reuse code across several functionalities in your product.

___

#### Function-first ❌

```md
Components/
  Login.tsx
  Signup.tsx
Containers/
  Login.tsx
store/
  reducers.ts
  actions.ts
```

"Function-first" refers to naming your top-level folders after the purpose of the files they contain.
So far, you've got containers, components, actions, reducers, and so on.

This isn't going to scale at all.
Files are added to the same directories as your programme evolves and additional features are added.

The issue also involves tying the folders together.
A single flow in your programme will almost certainly necessitate editing files from all directories.

Using the "Feature-first" approach, we can generate a general Project struture like so;

```md
src/
  pages/ ---> Contains top level files rendering as a page
    login {feature-folder}/ ---> Would contains components, api|hooks|actions files & folders related to login pages, if these components are going to be reused elsewhere aside login, move it into the core/components directory.
  core/ ---> Globally shared, reusable, components and files JSX related.
    components/ ---> Globally Shared React components, mostly dumb/presentational components
      {ComponentName}/
        ComponentName.tsx ---> Using named exports e.g `export const ComponentName = () => {}` Always keep this file as simple as possible
        Styles.tsx ---> A case for using styledComponents, all created elements will be stored here, exported using named exports
        index.ts ---> exports { ComponentName } from './Componentname'
        utils.ts ---> Optional when you need to move some functions out of the component file to keep things clean.
  utils/ ---> JS files that are globally needed, helper functions, etc.
```

### Components

Your Frontend Components will most likely be group into 2 kinds, presentational and connected components.

#### Worthy to Remember

* Endeavor to use functional components all through because why not?
* Try making sure all components be named exported and have their own folder.

### Presentational Components

* Have no dependencies on the rest of the application.
* Values and callbacks are passed into these via props.

Example:

```md
ComponentName/
  ComponentName.tsx ---> Using named exports e.g `export const ComponentName = () => {}` Always keep this file as simple as possible
  Styles.tsx ---> A case for using styledComponents, all created elements will be stored here, exported using named exports
  index.ts ---> exports { ComponentName } from './Componentname'
  utils.ts ---> Optional when you need to move some functions out of the component file to keep things clean.
```

```tsx
export const PresentationComponent = ({ prop1, props2 ...propN }) => (
  <div>Show something</div>
);
```

### Connected Components

* are responsible for retrieving data.
* are aware of the store and be connected to it.
* provide data to other components.
* are responsible for dispatching actions.
* grab data from store and then passes that data down to its children as props.

Example:

```md
ComponentName/
  ComponentName.tsx ---> Using named exports e.g `export const ComponentName = () => {}` Always keep this file as simple as possible
  Styles.jsx ---> A case for styledComponents, all created elements will be stored here, exported using named exports
  actions/ ---> handles all Async events, and certain Events that needs to be seperated from the components.
    store/ reducers/ etc
    api|hooks/
  index.js ---> exports { ComponentName } from './Componentname'
  utils.js ---> Optional when you need to move some functions out of the component file to keep things clean.
```

### Styling Components

Because I've been a making a case for using styled components, we will like to keep these clean and away from jsx logic. All created styled components will be inside an Styles.js file inside the component folder.

Example:

```JSX
// Styles.js
import styled from "styled-components";

export const Header = styled("div")`
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 200px;
`;

export const Footer = styled("div")`
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 200px;
`;
export const LeftMenu = styled("div")`
  display: flex;
  flex-direction: column;
  width: 500px;
  height: 200px;
`;
```

### Interacting with Backend

All backend related actions should be in the `actions` folder within each components directory. see [Connected Components](#connected-components) above.

### State sharing

There's a couple of options for this and I see most teams now are leaning towards React Context for React applications,
other worthy mentions include:
Redux, VueX, Mobx.

Same philosophy applies regardless of the state library employed.

```md
Actions/
  reducers/
```

---

This writeup is highly opinionated on my experience but a lot of teams` small and large have similar approach to handling their frontend applications.

Let me know if you find this useful or have questions or share how you've been able to structure your frontend application at work.

Photo by <a href="https://unsplash.com/@heysupersimi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Simone Hutsch</a> on <a href="https://unsplash.com/s/photos/folder-structure?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  