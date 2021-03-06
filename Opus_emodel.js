/*
MIT License

Copyright (c) 2021 Mohannad Alahmadi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
//Declare arryas corresponding to each Opus Codec configuration
const swbVbrBitrates=["14","15","16","19","22","25","28","31","34","37","40"] 
const swbCbrBitrates=["16","19","22","25","28","31","34","37","40"] 
const wbVbrBitrates=["11","12","13"] 
const wbCbrBitrates=["12","13","14","15"]
const nbVbrBitrates=["6","7","8","9"] 
const nbCbrBitrates=["6","7","8","9","10","11"]

// A JSON formatted Ie & Bpl factors dervied for the SWB, WB and NB Opus codec
const swb ={
    vbr:[{
           id:"14",
            value:[{ie:38.06,bplrandom:16.51,bplbursty:9.13}]
    },
    {     
            id:"15",
            value:[{ie:34.12,bplrandom:15,bplbursty:7.9}]
    },
    {
           id:"16",
            value:[{ie:30.16302131,bplrandom:11.83,bplbursty:10.06}]
    },
    {     
            id:"19",
            value:[{ie:23.80720462,bplrandom:10.67,bplbursty:8.92}]
    },
    {     
            id:"22",
            value:[{ie:20.22332357,bplrandom:10.47,bplbursty:8.57}]
    },    
    {     
            id:"25",
            value:[{ie:20.20905481,bplrandom:11.28,bplbursty:9.18}]
    },
    {     
            id:"28",
            value:[{ie:18.47734739,bplrandom:10.63,bplbursty:8.91}]
    },
    {     
            id:"31",
            value:[{ie:16.82867498,bplrandom:10.44,bplbursty:8.82}]
    },
    {     
            id:"34",
            value:[{ie:14.75893036,bplrandom:10.12,bplbursty:8.54}]
    },
    {     
            id:"37",
            value:[{ie:12.07782849,bplrandom:10.38,bplbursty:8.30}]
    },
    {     
            id:"40",
            value:[{ie:10.66596559,bplrandom:9.79,bplbursty:8.04}]
    }],
    cbr:[{
           id:"16",
            value:[{ie:36.88067115,bplrandom:13.30,bplbursty:10.80}]
    },
    {     
            id:"19",
            value:[{ie:29.58016175,bplrandom:10.74,bplbursty:8.93}]
    },
    {     
            id:"22",
            value:[{ie:23.38003477,bplrandom:10.01,bplbursty:8.46}]
    },    
    {     
            id:"25",
            value:[{ie:22.64371205,bplrandom:10.57,bplbursty:8.74}]
    },
    {     
            id:"28",
            value:[{ie:23.65242842,bplrandom:11.67,bplbursty:9.98}]
    },
    {     
            id:"31",
            value:[{ie:21.74245539,bplrandom:11.51,bplbursty:9.58}]
    },
    {     
            id:"34",
            value:[{ie:20.62029481,bplrandom:11.78,bplbursty:9.69}]
    },
    {     
            id:"37",
            value:[{ie:16.22868955,bplrandom:10.62,bplbursty:8.99}]
    },
    {     
            id:"40",
            value:[{ie:15.89845959,bplrandom:11.35,bplbursty:9.37}]
    }]

}
const wb ={
vbr:[{
       id:"11",
        value:[{ie:28.41322299,bplrandom:23.93979569,bplbursty:20.11987374}]
},
{     
        id:"12",
        value:[{ie:23.29505705,bplrandom:22.2151863,bplbursty:18.90376092}]
},
{     
        id:"13",
        value:[{ie:19.958882,bplrandom:19.49608704,bplbursty:16.91955649}]
}],
cbr:[{     
        id:"12",
        value:[{ie:29.76435108,bplrandom:24.80947978,bplbursty:20.77703993}]
},
{     
        id:"13",
        value:[{ie:26.16108167,bplrandom:23.0047189,bplbursty:19.372252}]
},    
{     
        id:"14",
        value:[{ie:20.77194577,bplrandom:17.5623101,bplbursty:15.84824707}]
},
{     
        id:"15",
        value:[{ie:18.06274989,bplrandom:18.73740804,bplbursty:16.09740659}]
}]

}
const nb ={
vbr:[{
       id:"6",
        value:[{ie:23.00233478,bplrandom:24.5644848,bplbursty:15.35503534}]
},
{     
        id:"7",
        value:[{ie:21.25545861,bplrandom:22.45885046,bplbursty:14.42549516}]
},
{     
        id:"8",
        value:[{ie:16.02443357,bplrandom:20.25866692,bplbursty:13.47963008}]
},
{     
        id:"9",
        value:[{ie:11.73674352,bplrandom:18.90829837,bplbursty:12.44222463}]
}     
    ],
cbr:[{
       id:"6",
        value:[{ie:46.26834316,bplrandom:8.939710714,bplbursty:5.655040056}]
},
{     
        id:"7",
        value:[{ie:31.73480382,bplrandom:18.17914283,bplbursty:11.76446295}]
},
{     
        id:"8",
        value:[{ie:19.24547807,bplrandom:15.12823436,bplbursty:10.1315844}]
},
{     
        id:"9",
        value:[{ie:13.20879771,bplrandom:17.23921027,bplbursty:11.36427122}]
},
{     
        id:"10",
        value:[{ie:6.197366255,bplrandom:15.32972957,bplbursty:10.47043983}]
},
{     
        id:"11",
        value:[{ie:2.030115291,bplrandom:15.95164784,bplbursty:10.73313709}]
}     
    ]

}

/*getEffective(bandwidth,mode,lossType) takes the following inputs to compute Ie,eff facotr for SWB/WB/NB codecs.
bandwidth: 'swb': for SWB E-model
           'wb': WB E-model
           'nb': NB E-model
mode: Opus operating mode
        'VBR': for the default Opus Variable bitrate operating mode
        'CBR': for the Constant bitrate operating mode
lossType: The type of loss, i.e. "random" or "bursty" loss patterns
*/
// it takes bandwidth, operating mode, and the type of packet loss
window.getEffective =function(bandwidth,mode,lossType){
        //filtering the arguments passed based on the Emodel implementation being used
        // starts by SWB
        if(bandwidth==="swb"){
            //checks if the vbr or cbr mode is being evaluated
            if(mode==="vbr"){swbBitrates = swbVbrBitrates; }
            if(mode==="cbr"){swbBitrates = swbCbrBitrates; }
            
            //After this point, the code returns all the ie & Bpl factors by looping through the codec configuration decalred above
            const result = swbBitrates.map(id => { //filters through each swb bitrate decalred
          
            const [tempVar] = swb[mode].filter(bitrateobj => {//filters the bitrate Object containing the ie anb Bpl based on the lossType
              return bitrateobj.id === id
          });
          
          let ie;
          if((mode==="vbr" || mode==="cbr") && (typeof(lossType)==="undefined")){//if no packet lossType detected,return ie only.
              ie = tempVar.value[0].ie;
    }
          let bpl=1;
          
          if((mode==="vbr" || mode==="cbr") && (lossType==="random" || lossType==="bursty")) { //if packet lossType is present (random/bursty)
              ie = tempVar.value[0].ie;
              bpl = tempVar.value[0]["bpl"+lossType];
          }
          return {//
              bitrate:id,
              ie:ie,
              bpl:bpl
          }
      }) 
         return result;// returns  ie and Bpl for every swb condition to be processed by the R-factor Equation.
    }
        //computes the WB factors using the same approach used for the SWB conditions above
        if(bandwidth==="wb"){
        if(mode==="vbr"){wbBitrates = wbVbrBitrates; }
        if(mode==="cbr"){wbBitrates = wbCbrBitrates; }
        
            const result = wbBitrates.map(id => {
            const [tempVar] = wb[mode].filter(bitrateobj => {
              return bitrateobj.id === id
          });
          
          let ie;
          if((mode==="vbr" || mode==="cbr") && (typeof(lossType)==="undefined")){//if no packet lossType detected.
              ie = tempVar.value[0].ie;
    }
          let bpl=1;
          
          if((mode==="vbr" || mode==="cbr") && (lossType==="random" || lossType==="bursty")) { //if packet lossType is present (random/bursty)
              ie = tempVar.value[0].ie;
              bpl = tempVar.value[0]["bpl"+lossType];
          }
          return {
              bitrate:id,
              ie:ie,
              bpl:bpl
          }
      }) 
          return result;
    }
        //computes the NB factors using the same approach used for the SWB conditions above
        if(bandwidth==="nb"){
        if(mode==="vbr"){nbBitrates = nbVbrBitrates; }
        if(mode==="cbr"){nbBitrates = nbCbrBitrates; }
        
            const result = nbBitrates.map(id => {
            const [tempVar] = nb[mode].filter(bitrateobj => {
              return bitrateobj.id === id
          });
          
          let ie;
          if((mode==="vbr" || mode==="cbr") && (typeof(lossType)==="undefined")){//if no packet lossType detected.
              ie = tempVar.value[0].ie;
    }
          let bpl=1;
          
          if((mode==="vbr" || mode==="cbr") && (lossType==="random" || lossType==="bursty")) { //if packet lossType is present (random/bursty)
              ie = tempVar.value[0].ie;
              bpl = tempVar.value[0]["bpl"+lossType];
          }
          return {
              bitrate:id,
              ie:ie,
              bpl:bpl
          }
      }) 
          return result;
    }
            }