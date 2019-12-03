import { Dimensions, Platform , PixelRatio} from "react-native";
import { CSS } from "@common/SDCSS";
type IamgeDesc = {
  colorModel: string,
  format: string,
  height: number,
  orientation: string,
  size: number,
  width: number
};
type Image = {
  id: number,
  desc: IamgeDesc,
  file_name: string,
  type: string,
  url: string
};

type imageUrl = {
  width: number,
  height: number,
  url: string
};

// export const getSuitableSize = (
//   image: Image[],
//   containerWidth: number,
//   defHeight: number
// ): imageUrl[] => {
//   //   if (typeof image.desc === 'string') {
//   //       image.desc = JSON.parse(image.desc);
//   //   }

//   //   // 判断
//   let len = image.length;
//   let width = containerWidth;
//   if (len == 1) {
//     width = width;
//   } else if (len <= 4) {
//     width = width / 2;
//   } else {
//     width = width / 3;
//   }
//   width = parseInt(width);

//   return image.map((item, index, self) => {
//     if (typeof item.desc === "string") {
//       item.desc = JSON.parse(item.desc);
//     }
//     // 第三张、第七张在最后
//     if (
//       (index == 0 && index == len - 1) ||
//       (index == 2 && index == len - 1) ||
//       (index == 6 && index == len - 1)
//     ) {
//       // 判断高度与宽度比例
//       if (item.desc.width >= item.desc.height) {
//         return {
//           width: containerWidth - 11,
//           height: containerWidth - 10,
//           url: item.url + `?imageView2/2/w/${containerWidth - 10}`
//         };
//       } else {
//         return {
//           width: containerWidth - 11,
//           height: (defHeight - 10) * 2,
//           url: item.url + `?imageView2/2/h/${(defHeight - 10) * 2}`
//         };
//       }
//     }
//     // 判断高度与宽度比例
//     if (item.desc.width >= item.desc.height) {
//       return {
//         width: width - 10,
//         height: width - 10,
//         url: item.url + `?imageView2/2/w/${width - 10}`
//       };
//     } else {
//       return {
//         width: width - 10,
//         height: width - 10,
//         url: item.url + `?imageView2/2/h/${width - 10}`
//       };
//     }
//   });
// };

export const getSuitableSize = (
  image: Image[],
  containerWidth: number,
  defHeight: number,
  tab1: boolean
): imageUrl[] => {
  //   if (typeof image.desc === 'string') {
  //       image.desc = JSON.parse(image.desc);
  //   }

  //   // 判断
  let len = image.length;
  let width = containerWidth;
  let sizeObj = {};
  // if (len == 1) {
  //   width = width;
  // // } else if (len <= 4) {
  // //   width = width / 2;
  // } else {
  //   width = width / 3;
  // }
  if (len == 1) {
    width = width;
  } else if (len == 2 || len == 4 || len == 3 || len == 5) {
    // width = width / 2.6;
    width = width / 3; //tab1 ? width / 3 : width / 2.6;
  } else {
    width = width / 3; //width / 3;
  }
  width = parseInt(width);

  return image.map((item, index, self) => {
    if (typeof item.desc === "string") {
      item.desc = JSON.parse(item.desc);
    }
    //console.warn("item.desc", item.desc)
    // 第三张、第七张在最后
    if (
      (index == 0 && index == len - 1)
    ) {
      // 判断高度与宽度比例
      if (item && item.desc && item.desc.width >= item.desc.height) {
        //console.warn("sizeObj", item.desc)
        sizeObj = {
          width: CSS.pixel(310),// containerWidth - 11,
          height: CSS.pixel(226),
          url: item.url + `?imageView2/2/w/${parseInt((containerWidth - 10) * PixelRatio.get())}`
        };
      } else {
        sizeObj = {
          width: CSS.pixel(226), //containerWidth - 11,
          height: CSS.pixel(310), //(defHeight - 10) * 2,
          url: item.url + `?imageView2/2/h/${parseInt((defHeight - 10) * PixelRatio.get() * 2)}`
        };
      }
      //console.warn("sizeObj", sizeObj)
      return sizeObj;
    }

    // 判断高度与宽度比例
    if (item.desc.width >= item.desc.height) {
      sizeObj = {
        //width: tab1 ? width - 10 : width, // - 10,
        width: width, // - 10,
        height: width, // - 10,
        url: item.url + `?imageView2/2/w/${parseInt((width - 10) * PixelRatio.get())}`
      };
    } else {
      sizeObj = {
        width: width, // - 10,
        height: width, // - 10,
        url: item.url + `?imageView2/2/h/${parseInt((width - 10) * PixelRatio.get() * 2)}`
      };
    }
    //console.warn("sizeObj2", sizeObj)
    return sizeObj;
  });
};
