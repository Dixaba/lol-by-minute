try {
  function dixaba_setup() {
    alert(`Click on graph highlighted with red to select it for further copying.
Note: no data will be copied right now!`);

    allGraphs.forEach((graph, index) => {
      let div = document.createElement('div');
      div.id = 'dixaba_selector_' + index;

      let divStyle = div.style;
      divStyle.width = '100%';
      divStyle.height = '100%';
      divStyle.top = 0;
      divStyle.left = 0;
      divStyle.position = 'absolute';
      divStyle.background = 'red';
      divStyle.opacity = '50%';

      div.classList.add('dixaba-selector');

      graph.appendChild(div);

      div.onclick = (event) => {
        localStorage.setItem('dixaba-selected-graph', /\d+/.exec(event.target.id)[0]);
        let elements = Array.from(document.querySelectorAll('div.dixaba-selector'));
        while (elements.length > 0) {
          elements.shift().remove();
        }
      };
    });
  }

  const id = document.querySelector('.content.firstLevelContent.active').getAttribute('data-tab-id');

  const allGraphs = Array.from(
    document.querySelectorAll(`div[data-tab-id^="${id}"] > div.element > div.row > div.medium-12.small-24.columns`)
  ).filter((el, index) => index % 2 === 0);

  const selectedGraphNumber = localStorage.getItem('dixaba-selected-graph');

  if (selectedGraphNumber === null) {
    dixaba_setup();
  } else {
    const selectedGraph = allGraphs[selectedGraphNumber];
    const dataName = selectedGraph.parentNode.firstElementChild.firstElementChild.innerText.trim();
    const script = selectedGraph.querySelector('script').innerText;
    const data = /var datasetsgraphDD\d+\s+=\s+({.*?});/s.exec(script)[1];

    const regex = /label:\s".*?".*?data:\s+(\[.*?\]\])/gs;
    let m;
    let arr = [];

    while ((m = regex.exec(data)) !== null) {
      arr.push(m);
    }

    const timeline = arr.pop()[1];
    const values = JSON.parse(timeline);
    const output = values.reduce((acc, curr) => acc + '\n' + curr[1], '').substring(1);

    let outputDiv = document.createElement('div');
    outputDiv.id = 'dixaba-stat';
    let outputDivStyle = outputDiv.style;
    outputDivStyle.position = 'fixed';
    outputDivStyle.left = '30px';
    outputDivStyle.right = '30px';
    outputDivStyle.top = '30px';
    outputDivStyle.bottom = '30px';
    outputDivStyle.zIndex = 100;
    outputDivStyle.backgroundColor = 'wheat';
    outputDivStyle.color = 'black';
    outputDivStyle.fontSize = '48px';
    outputDivStyle.display = 'grid';
    outputDivStyle.justifyContent = 'center';
    outputDivStyle.alignItems = 'center';
    outputDiv.onclick = () => {
      navigator.clipboard
        .writeText(output)
        .then(() => alert('Data copied to clipboard!'))
        .catch((err) => console.log('Something went wrong', err));

      document.getElementById('dixaba-stat').remove();
    };

    let outputSpan = document.createElement('span');
    outputDiv.appendChild(outputSpan);
    outputSpan.innerText = `Click me to copy data named "${dataName}" to clipboard!`;

    let setupDiv = document.createElement('div');
    outputDiv.appendChild(setupDiv);
    let setupDivStyle = setupDiv.style;
    setupDivStyle.position = 'absolute';
    setupDivStyle.bottom = 0;
    setupDivStyle.right = 0;
    setupDivStyle.fontSize = '40px';
    setupDivStyle.border = '2px solid black';
    setupDivStyle.padding = '5px';
    setupDiv.innerText = 'Click me to select data you want to copy!';
    setupDiv.onclick = (event) => {
      event.stopPropagation();

      document.getElementById('dixaba-stat').remove();

      dixaba_setup();
    };

    document.body.appendChild(outputDiv);
  }
} catch (err) {
  alert('Shit happened!');
  console.log(err);
}
