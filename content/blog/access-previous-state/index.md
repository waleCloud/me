---
title: Using React useRef Hook to access immediate past props or state.
date: "2022-02-06T19:00:00.169Z"
description: Accessing previous value of props or State with useRef hook in React.
featuredImage: ./img/reacthook-img.jpeg
---

## Using React useRef Hook to access immediate past props or state

Do you want to know what the previous state of a value is before it got updated in React?
You can easily leverage useRef to track the previous value of state or props in React.

Recently, while working on a project built with React and Firebase, we had a use-case for knowing what the previous state of a value was. This need came to be when a state item needed to be reset if an ID from firebase changes.

The useRef hook in react is ideal for things like this, you probably thought its sole purpose is for DOM manipulation but it can be more and almost anything you want it to be.

TL;DR

`// usePrevious hook` [React official documentation](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state)

```js
import { useEffect, useRef } from 'react';

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
```

`// use returned value like so;`

```js
  const prevModuleId = usePrevious(moduleId);
```

Hopefully Reacts make the `usePrevious` into an official hook soon as it seems like a no-brainer.

### How does the usePrevious hook works?

Short answer:

- `useRef`: A container that is useful to keep a mutable (changeable) value in its `.current` property
- `useEffect`: Allows for monitoring changes and performing side effects in functional components.

You can read more about both hooks on the [React official site](https://reactjs.com)

First, we create an instance of `Ref` whenever the hook is called.
The `useEffect` only runs when the `value` parameter changes and then assign that to the ref's `.current` property
Finally, we return the `ref.current`.

The first time the hook is called, ref.current will be `undefined` until a state or props value changes untl then before the useEffect hook is executed to reflect the latest previous value of the parameter.

---------------

Find this helpful? Kindly share so others can too.
cheers 🥂
