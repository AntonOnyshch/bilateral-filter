# Bilateral filter

## Result

<img width="1038" alt="bilateral-filter-example" src="https://user-images.githubusercontent.com/58116769/223050159-4e3decf6-c1f4-4dd7-be90-b9db2428082f.png">


## Installation

```sh
npm install | npm start
```

## What this is all about
Bilateral filter is the most notable one for denoising images. I choosed this alone with average/median filters to denoise computed tomography images in my own project.

This code is the result of my little research of all filter implementations. Yet I do not quite understand all subtle moments and how this is work altogether. Surfing the internet gave me just a few js/ts code to be able to understand this properly. Aplenty Matlab/Python code is presented but almost all of them use other libraries solutions like OpenCV.

## YouTube
I started my research from youtube. Here's what I've got.

1. [Non-Linear Image Filters | Image Processing](https://www.youtube.com/watch?v=7FP7ndMEfsc)
The very first video I have seen. A great explanation with formulas and visualization.
It shows that bilateral filter consist of two parts: gaussian and intensity functions.

2. [98 - What is bilateral denoising filter?](https://www.youtube.com/watch?v=yenye2s90BA)
Almast the same information as above but under another perspective.

3. [Bilateral Filter with MatLab (Image Restoration)(Debug Line By line )](https://www.youtube.com/watch?v=hsKvo_oR4M0)
Matlab example with explanations.

4. [Median Filtering in Spatial Domain](https://www.youtube.com/watch?v=eJx3g-ZEfm4)
Median filter is the **base**. You must know it.
5. [Which is better filter for Gaussian noise...](https://www.youtube.com/watch?v=z51CQ4WKi5s)
Awesome explanation how kernel works and other stuff.
6. [How Blurs & Filters Work - Computerphile](https://www.youtube.com/watch?v=C_zFhWdM4ic)
What do filters do overall? Simple, light and powerfull video.

 
## Books
[Digital Signal Processing
By Steven W. Smith, Ph.D.](http://www.dspguide.com/eightres.htm)
Fabulous view on signal processing. Forceful explanation. 

# Other
[ChatGPT](https://chat.openai.com/chat)
I used this for javascript code. For example: "Give me javascript code of bilateral grid filter algorithm"

## About my code
1. My filter is for [Grayscale](https://en.wikipedia.org/wiki/Grayscale). It means it works only with one(gray) chanel. Before pass pixels onto the filter i create a new array and fill it with only one chanel from 4(rgba) on original canvas image data.

2. How do I calculate kernel size?
I use 1.95 * sigmaSpatial formula. There's another one: Math.PI * 2 * sigmaSpatial;
**Kernel size must always be odd number!**

3. Kernel class have two LUT(Look Up Table) which I calculates before main run. One for Gaussian function. Another one for Intensity.
It **drastically** increase performance.
