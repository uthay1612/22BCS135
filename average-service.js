const express = require("express");
const app = express();
const PORT = 9876;

const maxWindowSize = 10;
let numberWindow = [];

const mockData = {
  p: [2, 3, 5, 7, 11],
  f: [55, 89, 144, 233, 377],
  e: [2, 4, 6, 8, 10, 12],
  r: [5, 17, 23, 42, 59],
};

app.get("/numbers/:type", async (req, res) => {
  const type = req.params.type;
  const validTypes = ["p", "f", "e", "r"];

  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: "Invalid type. Use p, f, e, or r." });
  }

 
  const previousState = [...numberWindow];
  let fetchedNumbers = [];

  try {
    await new Promise(resolve => setTimeout(resolve, 100));

    fetchedNumbers = mockData[type];
  } catch (error) {
    return res.json({
      windowPrevState: previousState,
      windowCurrState: numberWindow,
      numbers: [],
      avg: calculateAverage(numberWindow),
    });
  }

  for (let num of fetchedNumbers) {
    if (!numberWindow.includes(num)) {
      numberWindow.push(num);
      if (numberWindow.length > maxWindowSize) {
        numberWindow.shift(); 
      }
    }
  }

  res.json({
    windowPrevState: previousState,
    windowCurrState: numberWindow,
    numbers: fetchedNumbers,
    avg: calculateAverage(numberWindow),
  });
});

function calculateAverage(arr) {
  if (arr.length === 0) return 0;
  const total = arr.reduce((sum, n) => sum + n, 0);
  return parseFloat((total / arr.length).toFixed(2));
}

app.listen(PORT, () => {
  console.log(`✅ Microservice is running at http://localhost:${PORT}`);
});
