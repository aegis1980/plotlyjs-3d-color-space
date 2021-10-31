var img = new Image();
img.crossOrigin = 'anonymous';
img.src = 'img/autumn_leaves_at_glencoe.jpg';
var canvas = document.getElementById('pic');
var ctx = canvas.getContext('2d');
img.onload = function() {

  canvas.width = this.width;
  canvas.height = this.height;

  ctx.drawImage(img, 0, 0);
  const n = this.width * this.height;
  const r = new Array(n);
  const g = new Array(n);
  const b = new Array(n);
  const h = new Array(n);
  const s = new Array(n);
  const l = new Array(n);
  const cieL = new Array(n);
  const cieA = new Array(n);
  const cieB = new Array(n);
  const hslX = new Array(n);
  const hslY = new Array(n);
  const colors = new Array(n); //used for plot in all color spaces.

  let i=0;

  for (let x = 0; x < this.width; x++){
    for (let y = 0; y < this.height;y++){

      const pxl = ctx.getImageData(x, y, 1, 1);
  
      const rgba = `rgba(${pxl.data[0]}, ${pxl.data[1]}, ${pxl.data[2]}, ${pxl.data[3] / 255})`;
      colors[i] = rgba;
      r[i] = pxl.data[0];
      g[i] = pxl.data[1];
      b[i] = pxl.data[2];

      const hsl = rgb2hsl(r[i],g[i],b[i]);
      h[i] = hsl[0];
      s[i] = hsl[1];
      l[i] = hsl[2];

      const xyz = rgb2xyz(r[i],g[i],b[i]);
      const lab = xyz2lab(xyz);
      cieL[i] = lab[0];
      cieA[i] = lab[1];
      cieB[i] = lab[2];
      i++;
    }
  }

  // convert hsl 'polar'-esque coords to cartesian for plot.
  for (i=0; i < n ; i++){
    hslX[i] =  s[i] * Math.cos(deg2rad(h[i])); 
    hslY[i] = s[i] * Math.sin(deg2rad(h[i]));
    // (l)ightness altered for z-axis 
  }



  const rgbTrace = {
    x: r, y: g, z: b,
    mode: 'markers',
    marker: {
      color: colors,
      size: 1,
      symbol: 'circle',
      opacity:1},
    type: 'scatter3d'
  };

  const hslTrace = {
    x: hslX, y: hslY, z: l,
    mode: 'markers',
    marker: {
      color: colors,
      size: 1,
      symbol: 'circle',
      opacity:1},
    type: 'scatter3d'
  };

  const labTrace = {
    x: cieL, y: cieA, z: cieB,
    mode: 'markers',
    marker: {
      color: colors,
      size: 1,
      symbol: 'circle',
      opacity: 1},
    type: 'scatter3d'
  };  
  
  const rgbLayout = {
    title: {
      text: "RGB colorspace" 
    },
    height: 600,
    
    scene:{
      dragmode : "turntable",
      margin: {
        l: 0, r: 0, b: 0, t: 0
      },
      xaxis: {                
        title: "R"      
      },
      yaxis: {                
        title: "G"      
      },
      zaxis: {                
        title: "B",
      }
    }
  };

  const hslLayout = {
    title: {
      text: "HSL colorspace" 
    },
    height: 600,
    scene:{
      aspectmode:'cube',
      dragmode : "turntable",
      margin: {
        l: 0, r: 0, b: 0, t: 0
      },
      xaxis: {                
        title: "S"      
      },
      yaxis: {                
        title: "S"      
      },
      zaxis: {                
        title: "L",     
      }
    }
  };

  const labLayout = {
    title: {
      text: "CIELab colorspace" 
    },
    height: 600,
    scene:{
      aspectmode:'cube',
      dragmode : "turntable",
      margin: {
        l: 0, r: 0, b: 0, t: 0
      },
      xaxis: {                
        title: "L"      
      },
      yaxis: {                
        title: "a"      
      },
      zaxis: {                
        title: "b",
      }
    }
  };
  
  Plotly.newPlot('rgbPlot', [rgbTrace], rgbLayout);
  Plotly.newPlot('hslPlot', [hslTrace], hslLayout);
  Plotly.newPlot('labPlot', [labTrace], labLayout);

  document.getElementById("loader").style.display = "none";
};
