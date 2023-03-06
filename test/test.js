"use strict";
import { Betest } from "betest";
import { GrayscaleBilateralFilter } from "../lib/grayscaleBilateralFilter.js";
import { Kernel } from "../lib/kernel.js";
const betest = new Betest({ results: { showAs: 'Line' } });

const imageMockup = new Uint8Array([
    205, 185, 193, 105, 135, 93,
    205, 189, 193, 115, 116, 13,
    215, 142, 124, 125, 181, 73,
    108, 185, 161, 135, 135, 83,
    65, 185, 53, 119, 135, 93,
    89, 185, 193, 105, 135, 93,
]);
const kernel = new Kernel();
betest.addGroup({
    name: 'Kernel',
    tests: [
        {
            expected: 3,
            test: function sigmaSpatialMin() {
                kernel.setSigma(2, 1);
                return kernel.getSize();
            }
        },
        {
            expected: 3,
            test: function sigmaSpatialNegative() {
                kernel.setSigma(-1, 1);
                return kernel.getSize();
            }
        },
        {
            expected: 7,
            test: function sigmaSpatialFloat() {
                kernel.setSigma(3.678, 1);
                return kernel.getSize();
            }
        },
        {
            expected: 192,
            test: function kernel() {
                const kernel = new Kernel();
                kernel.setInputData(imageMockup, 6);
                kernel.setSigma(2, 10);
                const res = kernel.run(1, 1);
                return res;
            }
        }
    ]
});
betest.runAll();
//betest.runTest('Kernel', 'kernel');