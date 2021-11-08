import React from "react";
import Grid from "@material-ui/core/Grid";
import { projectStorage } from "../firebase/config";

var img_list = [];
var img_index = 1;
var ref = projectStorage.ref();
ref
  .listAll()
  .then((result) => {
    result.items.forEach((imgRef) => {
      imgRef.getDownloadURL().then((url) => {
        img_list.push({
          id: img_index,
          src: url,
          alt: "image",
          width: 300,
        });
        img_index++;
      });
    });
  })
  .catch((e) => {
    console.log(e);
  });

export default function ViewPhotos(props) {
  console.log(img_list);

  return (
    <Grid item xs={12}>
      <div>
        <h1 className="sbi-header">All Photos taken</h1>
        <div id="img-area">
          {img_list.map((ele) => (
            <img
              key={ele.id}
              id={ele.id}
              src={ele.src}
              alt={ele.alt}
              width={ele.width}
            />
          ))}
        </div>
      </div>
    </Grid>
  );
}
