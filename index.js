const express = require('express');
const app = express();
=
app.use(express.json());


const productInfo = {
  "A": { center: "C1", weight: 3 },
  "B": { center: "C1", weight: 2 },
  "C": { center: "C1", weight: 8 },
  "D": { center: "C2", weight: 12 },
  "E": { center: "C2", weight: 25 },
  "F": { center: "C3", weight: 15 },
  "G": { center: "C3", weight: 0.5 },
  "H": { center: "C3", weight: 1 },
  "I": { center: "C3", weight: 2 }
};


const centerDistance = {
  "C1": 3,
  "C2": 2.5,
  "C3": 2
};

function costRate(weight) {
  if (weight <= 5) {
    return 10;
  } else {
    const extraBlocks = Math.ceil((weight - 5) / 5);
    return 10 + 8 * extraBlocks;
  }
}


app.post('/calculate-delivery-cost', (req, res) => {
  const order = req.body;


  const centerWeights = { "C1": 0, "C2": 0, "C3": 0 };
  
  for (let product in order) {
    if (productInfo.hasOwnProperty(product)) {
      const center = productInfo[product].center;
      const weightPerUnit = productInfo[product].weight;
      centerWeights[center] += weightPerUnit * order[product];
    }
  
  }


  const centersUsed = Object.keys(centerWeights).filter(c => centerWeights[c] > 0);
  if (centersUsed.length === 0) {
    return res.json({ cost: 0 });
  }

  let loadedCostTotal = 0;
  let totalEmptyDistance = 0;

  centersUsed.forEach(center => {
    const w = centerWeights[center];
    const d = centerDistance[center];
    const loadedCost = d * costRate(w);
    loadedCostTotal += loadedCost;
    totalEmptyDistance += d;
  });


  const startingCenterDistance = Math.max(...centersUsed.map(center => centerDistance[center]));

  const extraEmptyCost = 10 * (totalEmptyDistance - startingCenterDistance);

  const totalCost = loadedCostTotal + extraEmptyCost;

  res.json({ cost: totalCost });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
