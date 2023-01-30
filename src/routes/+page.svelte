<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { BlockBlobClient } from '@azure/storage-blob';
	export let form: ActionData;
	let getSasUrlSubmitButton: HTMLButtonElement;
	let fileInput: HTMLInputElement;
	let blockBlobClient: BlockBlobClient;
	let fileName: HTMLInputElement;
	let blobUrl: string | undefined;
	const uploadFile = async () => {
		if (!fileInput) {
			return;
		}
		const files = fileInput.files;
		if (!files || files.length === 0) {
			return;
		}
		const promises = [];
		promises.push(blockBlobClient.uploadData(files[0]));
		await Promise.all(promises);
	};
	$: if (form?.sasUrl) {
		blobUrl = undefined;
		blockBlobClient = new BlockBlobClient(form.sasUrl);
		uploadFile().then(() => {
			const url = new URL(blockBlobClient.url);
			blobUrl = url.protocol + '//' + url.host + url.pathname;
		});
	}
</script>
<h1>Upload to Blob Storage by SAS</h1>
<input
	type="file"
	name="file"
	style="display:none;"
	bind:this={fileInput}
	on:change={() => {
		const files = fileInput.files;
		if (!files || files.length === 0) return;
		fileName.value = files[0].name;
		getSasUrlSubmitButton.click();
	}}
/>
<form method="POST" action="?/getSasUrl" use:enhance>
	{#if form?.sasUrl}
		<div>success!</div>
	{/if}
	<input type="hidden" name="fileName" bind:this={fileName} />
	<button type="submit" style="display:none;" bind:this={getSasUrlSubmitButton}>submit</button>
	<button
		on:click|preventDefault={() => {
			fileInput.value = '';
			fileInput.click();
		}}>upload to blob storage</button
	>
</form>
{#if blobUrl}
	<!-- svelte-ignore a11y-missing-attribute -->
	<img src={blobUrl} />
{/if}