(() => {
  try {
    const id = document.querySelector('.content.firstLevelContent.active').getAttribute('data-tab-id');

    const farmingGraphs = Array.from(
      document.querySelectorAll(
        `div[data-tab-id="${id}_farming"] > div.element > div.row > div.medium-12.small-24.columns`
      )
    ).filter((el, index) => index % 2 === 0);

    let goldGraph = farmingGraphs.filter((el) =>
      /\s*Gold\s*/.test(el.parentNode.firstElementChild.firstElementChild.innerText)
    );

    if (goldGraph.length == 1) goldGraph = goldGraph[0];
    else {
      alert('Shit happened: some kind of error happened');
      return;
    }

    let data = goldGraph.querySelector('script').innerText;
    if (data.length == 0) {
      alert('Shit happened: some kind of error happened');
      return;
    }

    data = /var datasetsgraphDD\d+\s+=\s+({.*?});/s.exec(data);
    if (data.length == 1) {
      alert('Shit happened: some kind of error happened');
      return;
    }
    data = data[1];

    const regex = /label:\s".*?".*?data:\s+(\[.*?\]\])/gs;
    let m;
    let arr = [];

    while ((m = regex.exec(data)) !== null) {
      arr.push(m);
    }

    data = arr.pop()[1];

    const values = JSON.parse(data);

    const output = values.reduce((acc, curr) => acc + '\n' + curr[1], '').substring(1);

    let outputDiv = document.createElement('div');

    outputDiv.id = 'dixaba-stat';
    outputDiv.onclick = () => {
      navigator.clipboard
        .writeText(output)
        .then(() => alert('Data copied to clipboard!'))
        .catch((err) => console.log('Something went wrong', err));
      document.getElementById('dixaba-stat').remove();
    };

    let divStyle = outputDiv.style;
    divStyle.position = 'fixed';
    divStyle.left = '30px';
    divStyle.right = '30px';
    divStyle.top = '30px';
    divStyle.bottom = '30px';
    divStyle.zIndex = 100;
    divStyle.backgroundColor = 'wheat';
    divStyle.color = 'black';
    divStyle.fontSize = '48px';
    divStyle.display = 'grid';
    divStyle.justifyContent = 'center';
    divStyle.alignItems = 'center';

    let outputSpan = document.createElement('span');
    outputDiv.appendChild(outputSpan);

    outputSpan.innerText = 'Click me to copy data to clipboard and remove me!';

    document.body.appendChild(outputDiv);
  } catch (err) {}
})();
