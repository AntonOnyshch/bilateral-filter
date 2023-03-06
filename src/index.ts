import { GrayscaleBilateralFilter } from './grayscaleBilateralFilter.js';

let originalCvs: HTMLCanvasElement;
let filteredCvs: HTMLCanvasElement;

let originalCtx: CanvasRenderingContext2D;
let filteredCtx: CanvasRenderingContext2D;
let filteredImageData: ImageData;

let grayScaleArray: Uint8Array;

let sigmaSpatial: number;
let sigmaIntensity: number;

let bilateralFilter: GrayscaleBilateralFilter;

window.addEventListener('DOMContentLoaded', (event) => {

    sigmaSpatial = +(document.getElementById('sigmaSpatial') as HTMLInputElement).value;
    sigmaIntensity = +(document.getElementById('sigmaIntensity') as HTMLInputElement).value;

    const image = document.createElement('img') as HTMLImageElement;

    image.addEventListener("load", (e) => {
        const width = image.width.toString();
        const height = image.height.toString();

        originalCvs = document.getElementById("originalCvs") as HTMLCanvasElement;

        originalCvs.setAttribute('width', width);
        originalCvs.setAttribute('height', height);
        originalCvs.style.width = width;
        originalCvs.style.height = height;

        originalCtx = originalCvs.getContext("2d") as CanvasRenderingContext2D;

        originalCtx.drawImage(image, 0, 0);

        filteredCvs = document.getElementById("filteredCvs") as HTMLCanvasElement;

        filteredCvs.setAttribute('width', width);
        filteredCvs.setAttribute('height', height);
        filteredCvs.style.width = width;
        filteredCvs.style.height = height;

        filteredCtx = filteredCvs.getContext("2d") as CanvasRenderingContext2D;

        filteredImageData = filteredCtx.getImageData(0, 0, +width, +height);
        
        // Canvas have rgba chanels but i need only one since my image doesn't has colors
        grayScaleArray = getGrayscaleArray(originalCtx);

        bilateralFilter = new GrayscaleBilateralFilter(+width, +height);
        bilateralFilter.setSigma(sigmaSpatial, sigmaIntensity);
        bilateralFilter.setInputData(grayScaleArray);

        applyBilateralFilter();
    });
    
    const selectTestImage = document.getElementById('testImages') as HTMLSelectElement;
    selectTestImage.onchange = e => {
        const imageName = (e.currentTarget as HTMLSelectElement).value;

        if(imageName.length > 0) {
            image.src = `../images/${imageName}`;
        }
    }
});

function getGrayscaleArray(ctx: CanvasRenderingContext2D) {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    const grayScaleArray = new Uint8Array(data.byteLength / 4);

    // Took only "r" chanel
    for (let i = 0, j = 0; i < data.length; i+=4, j++) {
        grayScaleArray[j] = data[i];
    }

    return grayScaleArray;
}

function fillCanvasData(filteredArray: Uint8Array | Uint8ClampedArray, ctx: CanvasRenderingContext2D) {
    const data = new Uint32Array(filteredImageData.data.buffer);

    // Fill all 4 chanles with only one operation on abgr way
    for (let i = 0; i < filteredArray.length; i++) {
        data[i] = (255 << 24) + (filteredArray[i] << 16) + (filteredArray[i] << 8) + filteredArray[i];
    }

    ctx.putImageData(filteredImageData, 0, 0);
}

async function applyBilateralFilter() {
    await bilateralFilter.run();
    fillCanvasData(bilateralFilter.pixels, filteredCtx);
}

(document.getElementById('sigmaSpatial') as HTMLInputElement).onchange = e => {
    sigmaSpatial = +(e.target as HTMLInputElement).value;
    document.getElementById('sigmaSpatialText').textContent = sigmaSpatial.toString();
    bilateralFilter.setSigma(sigmaSpatial, sigmaIntensity);
    applyBilateralFilter();
}
(document.getElementById('sigmaIntensity') as HTMLInputElement).onchange = e => {
    sigmaIntensity = +(e.target as HTMLInputElement).value;
    document.getElementById('sigmaSpatialText').textContent = sigmaIntensity.toString();
    bilateralFilter.setSigma(sigmaSpatial, sigmaIntensity);
    applyBilateralFilter();
}