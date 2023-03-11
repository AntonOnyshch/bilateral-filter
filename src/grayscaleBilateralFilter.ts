import { Kernel } from './kernel.js';

export class GrayscaleBilateralFilter {
    private width: number;
    private height: number;

    private kernel: Kernel;

    public readonly pixels: Uint8Array;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.pixels = new Uint8Array(width * height);
        this.kernel = new Kernel();
    }

    public setInputData(value: Uint8Array) {
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
            let height = 0;
            let centralPixelIndex = 0;
            const t0 = performance.now();

            for (let y1 = halfKernelSize; y1 < endHeight; y1++) {
                height = y1 * width
                for (let x = halfKernelSize; x < endWidth; x++) {
                    centralPixelIndex = height + x;
                    result[centralPixelIndex] = this.kernel.run(x, y1, centralPixelIndex);
                }
            }

            console.log(performance.now() - t0);

            resolve();
        });
    }
}