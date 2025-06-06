const decodeURL = async (url) => {
  let coordinates = await fetch(url)
  .then(function(response) {
    return response.text().then(function(text) {
      let newIndex = text.indexOf("table");
      let newEnd = text.indexOf("/table");
      // return only the response text between the table elements
      let newText = text.substring(newIndex, newEnd);
      // grab text between >< brackets while excluding the simple <p> tag
      let regEx = />.[^p/]?[^p/]?</g;
      const matches = [...newText.matchAll(regEx)];
      let x = [];
      let char = [];
      let y = [];
      let coords = [];
      // loop through matches and fill arrays with them
      for (let i = 0; i < matches.length; i++) {
        let cur = matches[i][0].substring(matches[i][0].indexOf(">") + 1, matches[i][0].indexOf("<"));
        if (i % 3 === 0) {
          x.push(cur);
        } else if (i % 3 === 1) {
          char.push(cur);
        } else  { // i % 3 === 2
          y.push(cur);
        }
      }
      coords = [];
      // organize matches into an array of objects
      for (let i = 0; i < x.length; i++) {
        coords.push({x: x[i], y: y[i], ch: char[i]});
      }
      // sort object by x ascending y descending; which makes printing simpler
      coords.sort(function(a, b) { 
          if (b.y - a.y === 0) {
            return a.x - b.x;
          } else {
            return b.y - a.y;
          }
      });
      return coords;
    });
  });
  if (coordinates && coordinates.length > 0) {
    let curY = coordinates[0].y;
    let newString = "";
    let curX = coordinates[0].x;
    for (let i = 0; i < coordinates.length; i++) {
      if (coordinates[i].y < curY) {
        curY = coordinates[i].y;
        curX = coordinates[i].x;
        newString += "\n";
      }
      while (curX + 1 < coordinates[i].x) {
        newString+= " ";
        ++curX;
      }
      newString += coordinates[i].ch;
      ++curX;
    }
    console.log(newString);
  }
};

decodeURL("https://docs.google.com/document/d/e/2PACX-1vRMx5YQlZNa3ra8dYYxmv-QIQ3YJe8tbI3kqcuC7lQiZm-CSEznKfN_HYNSpoXcZIV3Y_O3YoUB1ecq/pub");
decodeURL("https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub");
