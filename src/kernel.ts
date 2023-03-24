/**
 * See {@link https://en.wikipedia.org/wiki/Bilateral_filter} for details
 */
export class Kernel {

    private kernelSize: number;
    private halfKernelSize: number;

    private input: Uint8Array;
    private width: number;

    private gaussSpatialLUT: number[];
    private intensityLUT: number[];

    constructor() {
        this.intensityLUT = new Array(256);
    }

    public getSize() {
        return this.kernelSize;
    }
    public getHalfKernelSize() {
        return this.halfKernelSize;
    }
    public setInputData(input: Uint8Array, width: number): void {
        this.input = input;
        this.width = width;
    }

    public setSigma(spatial: number, intensity: number): void {
        this.setKernelSize(this.calculateKernelSize(spatial));

        this.calculateGaussianSpatialLUT(spatial);
        this.calculateIntensityLUT(intensity);
    }

    public run(startPosition: number, centralPixel: number): number {
        let sumWeight = 0;
        let normalizeWeight = 0;
        let weight = 0;
        let nearbyPixel = 0;
        let counter = 0;

        let j = 0;

        for (let i = 0; i < this.kernelSize; i++) {

            for (j = 0; j < this.kernelSize; j++) {
                nearbyPixel = this.input[startPosition + j];

                weight = this.gaussSpatialLUT[counter] * this.intensityLUT[Math.abs(nearbyPixel - centralPixel)];
                sumWeight += weight * nearbyPixel;
                normalizeWeight += weight;
                
                counter++;
            }
            startPosition += this.width;
        }

        return sumWeight/normalizeWeight + 0.5 | 0;
    }

    public run2(startKernelX: number, startHeight: number, centralPixel: number): number {
        let sumWeight = 0;
        let normalizeWeight = 0;
        let weight = 0;
        let nearbyPixel = 0;
        let counter = 0;

        let j = 0;
        const endWidth = startKernelX + this.kernelSize;
        for (let i = -this.halfKernelSize; i <= this.halfKernelSize; i++) {
            j = startKernelX;
            while (j < endWidth) {
                nearbyPixel = this.input[startHeight + j];

                weight = this.gaussSpatialLUT[counter] * this.intensityLUT[Math.abs(nearbyPixel - centralPixel)];
                sumWeight += weight * nearbyPixel;
                normalizeWeight += weight;
                
                j++;
                counter++;
            }
            startHeight += this.width;
        }
        return sumWeight/normalizeWeight + 0.5 | 0;
    }
    /**
     * Look Up Table for Gaussian function
     * @param {number} sigma Standard deviation. 
     * As the sigma parameter increases, the larger features get smoothened.
     */
    private calculateGaussianSpatialLUT(sigma: number): void {
        this.gaussSpatialLUT = new Array(this.kernelSize * this.kernelSize);

        const spatial = 1 / ((2 * Math.PI) * (sigma * sigma));
        const spatialSquare = 2 * (sigma * sigma);

        let counter = 0;
        /**
         * Fill look up table using geometrical 
         * distance between central pixel and nearby one within one kernel
         */
        for (let i = -this.halfKernelSize; i <= this.halfKernelSize; i++) {
            for (let j = -this.halfKernelSize; j <= this.halfKernelSize; j++) {
                this.gaussSpatialLUT[counter] = spatial * Math.exp(-(Math.pow(Math.hypot(i, j), 2)) / spatialSquare);

                counter++;
            }
        }
    }

    /**
     * Look Up Table for Intensity function
     * @param {number} sigma Pixel intensity range. 
     * As the range parameter σr increases, the bilateral filter gradually approaches Gaussian convolution more closely
     * because the range Gaussian widens and flattens, which means that it becomes 
     * nearly constant over the intensity interval of the image.
     */
    private calculateIntensityLUT(sigma: number): void {
        const intensity = 1 / ((2 * Math.PI) * (sigma * sigma));
        const intensitySquare = 2 * (sigma * sigma);

        /**
        * Calculate intensities functions for all of pixel intensity range, E.g. 0-255
        */
        for (let i = 0; i < this.intensityLUT.length; i++) {
            this.intensityLUT[i] = intensity * Math.exp(-(Math.pow(i, 2) / intensitySquare));
        }
    }
    
    private setKernelSize(value: number): void {
        this.kernelSize = value;
        this.halfKernelSize = Math.floor(this.kernelSize / 2);
    }

    private calculateKernelSize(spatial: number): number {
        const kernelSize = Math.floor(1.95 * spatial);
        const isEven = kernelSize % 2 === 0;
        const oddKernelSize = isEven ? kernelSize - 1 : kernelSize;

        return Math.max(3, oddKernelSize);
    }
}