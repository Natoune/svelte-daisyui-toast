<script lang="ts">
	import toast, { Toaster } from "$lib";
	import type { ToastOptions } from "$lib/types";
	import Prism from "prismjs";
	import { author, name, repository, version } from "../../package.json";

	import "prism-svelte";
	import "prismjs/components/prism-bash";
	import "prismjs/components/prism-javascript";
	import RichContent from "./RichContent.svelte";

	repository.url = repository.url.replace(/\.git$/, "").replace("git+", "");

	let pkg_manager = $state("npm");
	let install_cmd = $derived.by(() => {
		switch (pkg_manager) {
			case "pnpm":
				return `pnpm install ${name}`;
			case "yarn":
				return `yarn add ${name}`;
			case "bun":
				return `bun add ${name}`;
			default:
				return `npm install ${name}`;
		}
	});
	let position: ToastOptions["position"] = $state("bottom-end");
	let duration = $state(3000);
	let dismissOnClick = $state(true);
	let example = $state("default");
	let exampleMessage = $state("Hello, world!");
	let exampleCode = $derived.by(() => {
		switch (example) {
			case "default":
				return (
					`toast("${exampleMessage}", {\r\n` +
					`\tposition: "${position}",\r\n` +
					`\tduration: ${duration},\r\n` +
					(dismissOnClick ? "" : "\tdismissOnClick: false,\r\n") +
					"});"
				);
			case "promise":
				return (
					"toast.promise(\r\n" +
					"\tsaveSettings(settings),\r\n" +
					"\t{\r\n" +
					'\t\tloading: "Saving...",\r\n' +
					'\t\tsuccess: "Settings saved!",\r\n' +
					'\t\terror: "Could not save.",\r\n' +
					"\t},\r\n" +
					"\t{\r\n" +
					`\t\tposition: "${position}",\r\n` +
					`\t\tduration: ${duration},\r\n` +
					(dismissOnClick ? "" : "\t\tdismissOnClick: false,\r\n") +
					"});"
				);
			case "svelte":
				return (
					`toast(RichContent, {\r\n` +
					"\tprops: { someProp: '⭐' },\r\n" +
					"\tduration: 0,\r\n" +
					"\tdismissOnClick: false,\r\n" +
					"});" +
					"\r\n" +
					"\r\n" +
					"// RichContent.svelte\r\n" +
					'<script lang="ts">\r\n' +
					`\timport type { Toast } from '${name}';\r\n` +
					`\timport _toast from '${name}';\r\n` +
					"\r\n" +
					"\texport let toast: Toast;\r\n" +
					"\texport let someProp: string;\r\n" +
					`</${"script"}>\r\n` +
					"<span>\r\n" +
					"\tCustom and <b>bold</b> with props like {someProp}!\r\n" +
					"\t<button\r\n" +
					'\t\tclass="btn btn-xs btn-neutral btn-outline ml-2"\r\n' +
					"\t\tonclick={() => _toast.dismiss(toast.id)}\r\n" +
					"\t>\r\n" +
					"\t\tDismiss\r\n" +
					"\t</button>\r\n" +
					"</span>"
				);
			default:
				return (
					`toast.${example}("${exampleMessage}", {\r\n` +
					(example === "icon" ? `\ticon: "👏",\r\n` : "") +
					`\tposition: "${position}",\r\n` +
					`\tduration: ${duration},\r\n` +
					(dismissOnClick ? "" : "\tdismissOnClick: false,\r\n") +
					"});"
				);
		}
	});

	function copy(text: string) {
		navigator.clipboard.writeText(text);
		toast.success("Copied to clipboard!");
	}
</script>

<div
	class="flex flex-col items-center justify-center h-screen bg-primary/10 p-10 shadow-lg"
>
	<img
		src="favicon.png"
		alt="Svelte DaisyUI Toast"
		class="w-24 h-24 rounded-full bg-primary/20 p-2"
	/>
	<h1 class="text-4xl text-center font-bold mt-5">Svelte DaisyUI Toast</h1>
	<p class="text-lg text-center text-base-content my-10">
		A simple toaster component for Svelte with DaisyUI.
		<br />
		Inspired by
		<a
			href="https://svelte-french-toast.com/"
			class="link decoration-dotted font-semibold">Svelte French Toast</a
		>.
	</p>

	<div class="flex flex-wrap items-center justify-center mt-4">
		<button
			class="btn btn-primary btn-lg m-2"
			onclick={() =>
				toast.promise(
					new Promise((resolve) => {
						setTimeout(() => {
							resolve("Promise resolved!");
						}, 2000);
					}),
					{
						loading: "Toasting bread...",
						success: "Here's your toast!",
						error: "Could not toast.",
					}
				)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
				fill="currentColor"
				class="w-6 h-6 mr-2"
			>
				<path
					d="M208 512a24.84 24.84 0 01-23.34-16l-39.84-103.6a16.06 16.06 0 00-9.19-9.19L32 343.34a25 25 0 010-46.68l103.6-39.84a16.06 16.06 0 009.19-9.19L184.66 144a25 25 0 0146.68 0l39.84 103.6a16.06 16.06 0 009.19 9.19l103 39.63a25.49 25.49 0 0116.63 24.1 24.82 24.82 0 01-16 22.82l-103.6 39.84a16.06 16.06 0 00-9.19 9.19L231.34 496A24.84 24.84 0 01208 512zm66.85-254.84zM88 176a14.67 14.67 0 01-13.69-9.4l-16.86-43.84a7.28 7.28 0 00-4.21-4.21L9.4 101.69a14.67 14.67 0 010-27.38l43.84-16.86a7.31 7.31 0 004.21-4.21L74.16 9.79A15 15 0 0186.23.11a14.67 14.67 0 0115.46 9.29l16.86 43.84a7.31 7.31 0 004.21 4.21l43.84 16.86a14.67 14.67 0 010 27.38l-43.84 16.86a7.28 7.28 0 00-4.21 4.21l-16.86 43.84A14.67 14.67 0 0188 176zM400 256a16 16 0 01-14.93-10.26l-22.84-59.37a8 8 0 00-4.6-4.6l-59.37-22.84a16 16 0 010-29.86l59.37-22.84a8 8 0 004.6-4.6l22.67-58.95a16.45 16.45 0 0113.17-10.57 16 16 0 0116.86 10.15l22.84 59.37a8 8 0 004.6 4.6l59.37 22.84a16 16 0 010 29.86l-59.37 22.84a8 8 0 00-4.6 4.6l-22.84 59.37A16 16 0 01400 256z"
				/>
			</svg>
			Launch Toast
		</button>
		<a class="btn btn-neutral btn-outline m-2" href={repository.url}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
				fill="currentColor"
				class="w-6 h-6 mr-2"
			>
				<path
					d="M256 32C132.3 32 32 134.9 32 261.7c0 101.5 64.2 187.5 153.2 217.9a17.56 17.56 0 003.8.4c8.3 0 11.5-6.1 11.5-11.4 0-5.5-.2-19.9-.3-39.1a102.4 102.4 0 01-22.6 2.7c-43.1 0-52.9-33.5-52.9-33.5-10.2-26.5-24.9-33.6-24.9-33.6-19.5-13.7-.1-14.1 1.4-14.1h.1c22.5 2 34.3 23.8 34.3 23.8 11.2 19.6 26.2 25.1 39.6 25.1a63 63 0 0025.6-6c2-14.8 7.8-24.9 14.2-30.7-49.7-5.8-102-25.5-102-113.5 0-25.1 8.7-45.6 23-61.6-2.3-5.8-10-29.2 2.2-60.8a18.64 18.64 0 015-.5c8.1 0 26.4 3.1 56.6 24.1a208.21 208.21 0 01112.2 0c30.2-21 48.5-24.1 56.6-24.1a18.64 18.64 0 015 .5c12.2 31.6 4.5 55 2.2 60.8 14.3 16.1 23 36.6 23 61.6 0 88.2-52.4 107.6-102.3 113.3 8 7.1 15.2 21.1 15.2 42.5 0 30.7-.3 55.5-.3 63 0 5.4 3.1 11.5 11.4 11.5a19.35 19.35 0 004-.4C415.9 449.2 480 363.1 480 261.7 480 134.9 379.7 32 256 32z"
				/>
			</svg>
			Source
		</a>
	</div>

	<a
		href="https://www.npmjs.com/package/{name}"
		class="badge border-base-content/60 text-base-content/60 rounded-xl py-3 mt-5"
	>
		Version {version}
	</a>

	<a
		href="#docs"
		aria-label="Documentation"
		class="absolute sm:bottom-28 bottom-10"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 512 512"
			fill="currentColor"
			class="w-8 h-8"
		>
			<path
				fill="none"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="48"
				d="M112 184l144 144 144-144"
			/>
		</svg>
	</a>

	<Toaster />
</div>
<div class="flex flex-col mx-auto max-w-2xl px-5 py-10 space-y-10" id="docs">
	<div>
		<div class="flex justify-between">
			<h3 class="text-xl font-bold">1. Install</h3>
			<div class="flex space-x-2">
				<button
					class="btn btn-sm rounded-xl"
					class:btn-ghost={pkg_manager !== "npm"}
					onclick={() => (pkg_manager = "npm")}>NPM</button
				>
				<button
					class="btn btn-sm rounded-xl"
					class:btn-ghost={pkg_manager !== "pnpm"}
					onclick={() => (pkg_manager = "pnpm")}>PNPM</button
				>
				<button
					class="btn btn-sm rounded-xl"
					class:btn-ghost={pkg_manager !== "yarn"}
					onclick={() => (pkg_manager = "yarn")}>Yarn</button
				>
				<button
					class="btn btn-sm rounded-xl"
					class:btn-ghost={pkg_manager !== "bun"}
					onclick={() => (pkg_manager = "bun")}>Bun</button
				>
			</div>
		</div>
		{#key pkg_manager}
			<pre
				class="rounded-md p-4 my-2 overflow-x-scroll language-bash"><code
					>{@html Prism.highlight(
						install_cmd,
						Prism.languages.bash,
						"bash"
					)}</code
				></pre>
			<button
				class="link link-primary decoration-transparent w-fit inline-flex items-center"
				onclick={() => copy(install_cmd)}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
					fill="currentColor"
					class="w-4 h-4 mr-2"
				>
					<path
						d="M408 480H184a72 72 0 01-72-72V184a72 72 0 0172-72h224a72 72 0 0172 72v224a72 72 0 01-72 72z"
					/><path
						d="M160 80h235.88A72.12 72.12 0 00328 32H104a72 72 0 00-72 72v224a72.12 72.12 0 0048 67.88V160a80 80 0 0180-80z"
					/>
				</svg>
				Copy
			</button>
		{/key}
	</div>

	<div>
		<h3 class="text-xl font-bold">2. Usage</h3>
		<p>
			Mount a <code>&ltToaster /&gt</code> at the top level of your app and
			use the toast API to display toasts.
		</p>
		<pre class="rounded-md p-4 my-2 overflow-x-scroll language-svelte"><code
				id="use_code"
				>{@html Prism.highlight(
					`<script>
	import toast, { Toaster } from '${name}'

	function handleClick() {
		toast.success('Hello, world!')
	}
</script>

<Toaster />
<button type="button" onclick={handleClick}>Toast</button>`,
					Prism.languages.svelte,
					"svelte"
				)}</code
			></pre>
		<button
			class="link link-primary decoration-transparent w-fit inline-flex items-center"
			onclick={() =>
				copy(document.getElementById("use_code")?.textContent!)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
				fill="currentColor"
				class="w-4 h-4 mr-2"
			>
				<path
					d="M408 480H184a72 72 0 01-72-72V184a72 72 0 0172-72h224a72 72 0 0172 72v224a72 72 0 01-72 72z"
				/><path
					d="M160 80h235.88A72.12 72.12 0 00328 32H104a72 72 0 00-72 72v224a72.12 72.12 0 0048 67.88V160a80 80 0 0180-80z"
				/>
			</svg>
			Copy
		</button>
	</div>

	<hr class="border-base-content/20" />

	<div>
		<h3 class="text-4xl font-bold">Examples</h3>

		<div class="flex items-center space-x-2 my-4">
			<label for="position" class="text-base-content">Position:</label>
			<select
				class="select select-xs w-40"
				id="position"
				bind:value={position}
			>
				<option value="top-start">Top Left</option>
				<option value="top-center">Top Center</option>
				<option value="top-end">Top Right</option>
				<option value="middle-start">Middle Left</option>
				<option value="middle-center">Middle Center</option>
				<option value="middle-end">Middle Right</option>
				<option value="bottom-start">Bottom Left</option>
				<option value="bottom-center">Bottom Center</option>
				<option value="bottom-end">Bottom Right</option>
			</select>
		</div>
		<div class="flex items-center space-x-2 my-4">
			<label for="duration" class="text-base-content">Duration:</label>
			<input
				type="number"
				class="input input-xs w-40"
				id="duration"
				min="0"
				max="10000"
				bind:value={duration}
			/>
		</div>
		<div class="flex items-center space-x-2 my-4">
			<label for="dismissOnClick" class="text-base-content"
				>Dismiss on click:</label
			>
			<input
				type="checkbox"
				class="toggle toggle-primary"
				id="dismissOnClick"
				bind:checked={dismissOnClick}
			/>
		</div>
		<div class="flex flex-wrap space-x-2 space-y-2 my-4">
			<button
				class="btn"
				class:btn-outline={example !== "default"}
				onclick={() => {
					example = "default";
					exampleMessage = "Hello, world!";
					toast(exampleMessage, {
						position,
						duration,
						dismissOnClick,
					});
				}}
			>
				Default
			</button>
			<button
				class="btn btn-info"
				class:btn-outline={example !== "info"}
				onclick={() => {
					example = "info";
					exampleMessage = "You have a new message.";
					toast.info(exampleMessage, {
						position,
						duration,
						dismissOnClick,
					});
				}}
			>
				Info
			</button>
			<button
				class="btn btn-warning"
				class:btn-outline={example !== "warning"}
				onclick={() => {
					example = "warning";
					exampleMessage = "Warning! Your bread is burning.";
					toast.warning(exampleMessage, {
						position,
						duration,
						dismissOnClick,
					});
				}}
			>
				Warning
			</button>
			<button
				class="btn btn-success"
				class:btn-outline={example !== "success"}
				onclick={() => {
					example = "success";
					exampleMessage = "Successfully toasted!";
					toast.success(exampleMessage, {
						position,
						duration,
						dismissOnClick,
					});
				}}
			>
				Success
			</button>
			<button
				class="btn btn-error"
				class:btn-outline={example !== "error"}
				onclick={() => {
					example = "error";
					exampleMessage = "This didn't work.";
					toast.error(exampleMessage, {
						position,
						duration,
						dismissOnClick,
					});
				}}
			>
				Error
			</button>
			<button
				class="btn btn-neutral"
				class:btn-outline={example !== "promise"}
				onclick={() => {
					example = "promise";
					toast.promise(
						new Promise((resolve) => {
							setTimeout(() => {
								resolve("Promise resolved!");
							}, 2000);
						}),
						{
							loading: "Saving...",
							success: "Settings saved!",
							error: "Could not save.",
						},
						{
							position,
							duration,
							dismissOnClick,
						}
					);
				}}
			>
				Promise
			</button>
			<button
				class="btn"
				class:btn-outline={example !== "icon"}
				onclick={() => {
					example = "icon";
					exampleMessage = "Good Job!";
					toast(exampleMessage, {
						position,
						duration,
						dismissOnClick,
						icon: "👏",
					});
				}}
			>
				Custom Icon
			</button>
			<button
				class="btn"
				class:btn-outline={example !== "html"}
				onclick={() => {
					example = "html";
					exampleMessage =
						"<strong>HTML String</strong> <br/> <em>This is a toast message with HTML content.</em>";
					toast(exampleMessage, {
						position,
						duration,
						dismissOnClick,
					});
				}}
			>
				HTML String
			</button>
			<button
				class="btn"
				class:btn-outline={example !== "svelte"}
				onclick={() => {
					example = "svelte";
					toast(RichContent, {
						props: { someProp: "⭐" },
						duration: 0,
						dismissOnClick: false,
					});
				}}
			>
				Svelte Rich Content
			</button>
		</div>
		{#key exampleCode}
			<pre
				class="rounded-md p-4 my-2 overflow-x-scroll language-{example ===
				'svelte'
					? 'svelte'
					: 'javascript'}"><code id="example_code"
					>{@html Prism.highlight(
						exampleCode,
						example === "svelte"
							? Prism.languages.svelte
							: Prism.languages.javascript,
						example === "svelte" ? "svelte" : "javascript"
					)}</code
				></pre>
		{/key}
		<button
			class="link link-primary decoration-transparent w-fit inline-flex items-center"
			onclick={() =>
				copy(document.getElementById("example_code")?.textContent!)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 512 512"
				fill="currentColor"
				class="w-4 h-4 mr-2"
			>
				<path
					d="M408 480H184a72 72 0 01-72-72V184a72 72 0 0172-72h224a72 72 0 0172 72v224a72 72 0 01-72 72z"
				/><path
					d="M160 80h235.88A72.12 72.12 0 00328 32H104a72 72 0 00-72 72v224a72.12 72.12 0 0048 67.88V160a80 80 0 0180-80z"
				/>
			</svg>
			Copy
		</button>
	</div>
</div>

<footer>
	<div class="flex flex-col justify-center items-center space-y-4 py-10">
		<a href={repository.url} class="link">GitHub</a>
		<p class="text-center text-base-content/70">
			© 2025 svelte-daisyui-toast · Built by <a
				href={author.url}
				class="link text-base-content decoration-transparent"
				>{author.name}</a
			>
		</p>
	</div>
</footer>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
