<script lang="ts">
	import { dismiss, toasts } from "./toast";
	import type { MergedToastOptions, Toast } from "./types";

	export const zIndex: number = 50;

	let toastList: Array<Toast> = [];
	let toastPositions: Set<MergedToastOptions["position"]> = new Set();

	toasts.subscribe((value) => {
		toastList = value;
		toastPositions = new Set(value.map((toast) => toast.options.position));
	});
</script>

{#each Array.from(toastPositions).map( (position) => position.split("-") ) as [vertical, horizontal]}
	<div
		class="toast toast-{vertical} toast-{horizontal}"
		class:items-start={horizontal === "start"}
		class:items-center={horizontal === "center"}
		class:items-end={horizontal === "end"}
		style="z-index: {zIndex};"
	>
		{#each toastList.filter((toast) => toast.options.position === `${vertical}-${horizontal}`) as toast}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<div
				id="toast-{toast.id}"
				role="alert"
				class="alert w-fit transition-transform duration-300 ease-in-out"
				class:alert-info={toast.type === "info"}
				class:alert-success={toast.type === "success"}
				class:alert-warning={toast.type === "warning"}
				class:alert-error={toast.type === "error"}
				onclick={() =>
					toast.options.dismissOnClick && dismiss(toast.id)}
			>
				{#if toast.options.icon}
					{#if typeof toast.options.icon === "string"}
						{@html toast.options.icon}
					{:else}
						<svelte:component this={toast.options.icon} />
					{/if}
				{/if}
				{#if typeof toast.message === "string"}
					<span>{@html toast.message}</span>
				{:else}
					<svelte:component
						this={toast.message}
						{toast}
						{...toast.options.props}
					/>
				{/if}
			</div>
		{/each}
	</div>
{/each}
