import { Kernel } from './kernel.js';

export class GrayscaleBilateralFilter {
    private width: number;
    private height: number;

    private kernel: Kernel;

    private input: Uint8Array;

    public readonly pixels: Uint8Array;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.pixels = new Uint8Array(width * height);
        this.kernel = new Kernel();
    }

    public setInputData(value: Uint8Array) {
        this.input = value;
        this.kernel.setInputData(value, this.width);
    }

    public setSigma(spatial: number, intensity: number): void {
        this.kernel.setSigma(spatial, intensity);
    }

    public run(): Promise<void> {
        return new Promise((resolve, reject) => {
            const result = this.pixels;

            const width = this.width;

            const halfKernelSize = this.kernel.getHalfKernelSize();

            const endHeight = this.height - halfKernelSize;
            const endWidth = this.width - halfKernelSize;
            const halfKernelSizeStride = halfKernelSize * width;

            let height = halfKernelSize * width;
            let centralPixelIndex = 0;
            let topLeftKernelIndex = 0;
            const t0 = performance.now();

            for (let i = halfKernelSize; i < endHeight; i++) {
                topLeftKernelIndex = height - halfKernelSizeStride;
                for (let j = halfKernelSize; j < endWidth; j++) {
                    centralPixelIndex = height + j;
                    result[centralPixelIndex] = this.kernel.run(topLeftKernelIndex + (j - halfKernelSize), this.input[centralPixelIndex]);
                }

                height += width;
            }

            console.log(performance.now() - t0);

            resolve();
        });
    }
}