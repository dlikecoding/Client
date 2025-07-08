// export const zoomPhoto = (el: HTMLImageElement | HTMLVideoElement, zoomlv: number) => {
//   const elDim =
//     el instanceof HTMLImageElement
//       ? { w: el.naturalWidth, h: el.naturalHeight }
//       : { w: el.videoWidth, h: el.videoHeight };

//   const isElLandscape = elDim.w > elDim.h;

//   // const isDeviceLandscape = window.innerHeight > window.innerWidth;

//   if (isElLandscape) {
//     // Landscape: width matches device height
//     const newHeight = zoomlv === 3 ? window.innerHeight : (window.innerHeight / 3) * zoomlv;
//     const scale = newHeight / elDim.h;
//     const width = elDim.w * scale;

//     return {
//       height: `${newHeight}px`,
//       width: `${width}px`,
//     };
//   } else {
//     // Portrait: height = 3x image width
//     const newWidth = window.innerWidth * zoomlv;
//     const scale = newWidth / elDim.w; // = 3, explicitly
//     const height = elDim.h * scale;

//     return {
//       width: `${newWidth}px`,
//       height: `${height}px`,
//     };
//   }
// };

// // export const zoomMedia = (
// //   el: HTMLImageElement | HTMLVideoElement,
// //   zoomlv: number
// // ): { width: string; height: string } => {
// //   const elDim = el instanceof HTMLImageElement
// //     ? { w: el.naturalWidth, h: el.naturalHeight }
// //     : { w: el.videoWidth, h: el.videoHeight };

// //   const deviceWidth = window.innerWidth;
// //   const deviceHeight = window.innerHeight;
// //   const deviceIsLandscape = deviceWidth > deviceHeight;
// //   const elIsLandscape = elDim.w > elDim.h;
// //   const elAspectRatio = elDim.w / elDim.h;

// //   let newWidth: number, newHeight: number;

// //   const zoomMultiplier = Math.pow(1.5, zoomlv - 1);

// //   if (!deviceIsLandscape && elIsLandscape) {
// //     // Device Portrait, Image Landscape
// //     newHeight = elDim.h * zoomMultiplier;

// //     // At zoom level 3, cap to viewport height
// //     if (zoomlv >= 3) newHeight = Math.max(newHeight, deviceHeight);

// //     newWidth = newHeight * elAspectRatio;

// //   } else if (!deviceIsLandscape && !elIsLandscape) {
// //     // Device Portrait, Image Portrait
// //     newHeight = deviceWidth * zoomMultiplier; // Base on viewport width
// //     newWidth = newHeight * elAspectRatio;

// //   } else if (deviceIsLandscape && !elIsLandscape) {
// //     // Device Landscape, Image Portrait
// //     newWidth = elDim.w * zoomMultiplier;

// //     // At zoom level 3, cap to viewport width
// //     if (zoomlv >= 3) newWidth = Math.max(newWidth, deviceWidth);

// //     newHeight = newWidth / elAspectRatio;

// //   } else {
// //     // Device Landscape, Image Landscape
// //     newHeight = deviceHeight * zoomMultiplier; // Base on viewport height
// //     newWidth = newHeight * elAspectRatio;
// //   }

// //   return {
// //     width: `${Math.round(newWidth)}px`,
// //     height: `${Math.round(newHeight)}px`,
// //   };
// // };
