![Header Image](/header-image.png)
<p align="center">
<img src="https://badgen.net/badge/license/MIT/422ad5" />
<img src="https://badgen.net/npm/v/@natoune/svelte-daisyui-toast" />
</p>
<p align="center">
<a href="https://natoune.github.io/svelte-daisyui-toast">Website</a> · <a href="https://npmjs.com/package/@natoune/svelte-daisyui-toast">NPM Package</a>
</p>

# Svelte DaisyUI Toast

A simple toaster component for Svelte with DaisyUI.  
Inspired by [Svelte French Toast](https://github.com/kbrgl/svelte-french-toast).

## Installation

```bash
npm install @natoune/svelte-daisyui-toast
```

```bash
pnpm install @natoune/svelte-daisyui-toast
```

```bash
yarn add @natoune/svelte-daisyui-toast
```

## Usage

Mount a `<Toaster />` at the top level of your app and use the `toast` API to display toasts.

```js
<script>
    import toast, { Toaster } from '@natoune/svelte-daisyui-toast'

    function handleClick() {
        toast.success('Hello, world!')
    }
</script>

<Toaster />
<button type="button" onclick={handleClick}>Toast</button>
```

For more usage examples, see [the website](https://natoune.github.io/svelte-daisyui-toast).

## Thanks

Thanks to the original author of Svelte French Toast and its contributors.
